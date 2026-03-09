import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TeethSelector } from '@/components/TeethSelector'
import { toast } from '@/hooks/use-toast'

export default function NewRequest() {
  const { addOrder, currentUser } = useAppStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [priceListItems, setPriceListItems] = useState<
    { category: string; sector: string; workType: string }[]
  >([])
  const [availableWorkTypes, setAvailableWorkTypes] = useState<string[]>([])
  const [dentistsList, setDentistsList] = useState<{ id: string; name: string }[]>([])
  const [availableScales, setAvailableScales] = useState<string[]>([])

  const [formData, setFormData] = useState({
    dentistId: '',
    patientName: '',
    patientCpf: '',
    patientBirthDate: '',
    sector: '',
    workType: '',
    material: '',
    shade: '',
    shadeScale: '',
    shippingMethod: 'lab_pickup',
    stlDeliveryMethod: '',
    observations: '',
  })
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [selectedArches, setSelectedArches] = useState<string[]>([])

  const isAdminOrReception = currentUser?.role === 'admin' || currentUser?.role === 'receptionist'

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase.from('price_list').select('category, sector, work_type')
      if (data) {
        setPriceListItems(
          data.map((d: any) => ({
            category: d.category || '',
            sector: d.sector || '',
            workType: d.work_type,
          })),
        )
      }
    }
    fetchPrices()

    const fetchScales = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'shade_scales')
        .maybeSingle()
      if (data && data.value) {
        try {
          setAvailableScales(JSON.parse(data.value))
        } catch (e) {
          console.error('Failed to parse shade_scales', e)
        }
      }
    }
    fetchScales()

    if (isAdminOrReception) {
      const fetchDentists = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, name, clinic')
          .eq('role', 'dentist')
        if (data) {
          setDentistsList(
            data.map((d: any) => ({
              id: d.id,
              name: `${d.name} ${d.clinic ? `(${d.clinic})` : ''}`,
            })),
          )
        }
      }
      fetchDentists()
    }
  }, [isAdminOrReception])

  useEffect(() => {
    if (formData.sector) {
      const normalize = (str: string) =>
        str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      const normalizedFormSector = normalize(formData.sector)

      const filtered = Array.from(
        new Set(
          priceListItems
            .filter((p) => {
              const catMatch = p.category && normalize(p.category) === normalizedFormSector
              const secMatch = p.sector && normalize(p.sector) === normalizedFormSector
              return catMatch || secMatch
            })
            .map((p) => p.workType)
            .filter(Boolean),
        ),
      ).sort()

      setAvailableWorkTypes(filtered)

      if (formData.workType && !filtered.includes(formData.workType)) {
        setFormData((prev) => ({ ...prev, workType: '' }))
      }
    } else {
      setAvailableWorkTypes([])
    }
  }, [formData.sector, priceListItems])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientName || !formData.workType || !formData.sector) return

    if (isAdminOrReception && !formData.dentistId) {
      toast({
        title: 'Atenção',
        description: 'Selecione um dentista para este pedido.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    await addOrder({
      ...formData,
      material: formData.material || 'Padrão',
      stlDeliveryMethod:
        formData.shippingMethod === 'dentist_send' ? formData.stlDeliveryMethod : '',
      teeth: selectedTeeth,
      arches: selectedArches,
    })
    setSubmitting(false)
    navigate('/app')
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="shadow-elevation border-muted/60">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl uppercase tracking-tight font-bold text-primary">
            NOVO PEDIDO VITALI LAB
          </CardTitle>
          <CardDescription>
            Preencha os detalhes clínicos do paciente e especificações.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 pt-8">
            {isAdminOrReception && (
              <div className="space-y-2 p-5 border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
                <Label className="uppercase font-bold text-xs text-emerald-800 dark:text-emerald-300">
                  Selecione o Cliente (Modo Lab) *
                </Label>
                <Select
                  value={formData.dentistId}
                  onValueChange={(v) => setFormData({ ...formData, dentistId: v })}
                  required
                >
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Escolha um dentista cadastrado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dentistsList.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="uppercase font-semibold text-xs text-muted-foreground">
                NOME COMPLETO DO PACIENTE *
              </Label>
              <Input
                required
                placeholder="Ex: João da Silva"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="h-12 text-lg font-medium"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs text-muted-foreground">
                  CPF do Paciente (Opcional)
                </Label>
                <Input
                  placeholder="000.000.000-00"
                  value={formData.patientCpf}
                  onChange={(e) => setFormData({ ...formData, patientCpf: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs text-muted-foreground">
                  Data de Nascimento (Opcional)
                </Label>
                <Input
                  type="date"
                  value={formData.patientBirthDate}
                  onChange={(e) => setFormData({ ...formData, patientBirthDate: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Setor do Laboratório *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(v) => setFormData({ ...formData, sector: v })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLUÇÕES CERÂMICAS">Soluções Cerâmicas</SelectItem>
                    <SelectItem value="STÚDIO ACRÍLICO">Stúdio Acrílico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Tipo de Trabalho *</Label>
                <Select
                  value={formData.workType}
                  onValueChange={(v) => setFormData({ ...formData, workType: v })}
                  required
                  disabled={!formData.sector || availableWorkTypes.length === 0}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue
                      placeholder={
                        !formData.sector
                          ? 'Selecione o setor...'
                          : availableWorkTypes.length === 0
                            ? 'Nenhum trabalho cadastrado'
                            : 'Selecione...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkTypes.map((wt) => (
                      <SelectItem key={wt} value={wt}>
                        {wt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 bg-muted/10 p-5 rounded-xl border">
              <Label className="uppercase font-semibold text-xs text-muted-foreground">
                Seleção de Elementos (Odontograma)
              </Label>
              <TeethSelector
                value={selectedTeeth}
                onChange={setSelectedTeeth}
                arches={selectedArches}
                onArchesChange={setSelectedArches}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Material</Label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="h-11"
                  placeholder="Ex: Zircônia, Resina..."
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">COR BASE</Label>
                <Input
                  placeholder="Ex: A2, BL1..."
                  value={formData.shade}
                  onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Escala Usada</Label>
                {availableScales.length > 0 ? (
                  <Select
                    value={formData.shadeScale}
                    onValueChange={(v) => setFormData({ ...formData, shadeScale: v })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableScales.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Ex: VITA..."
                    value={formData.shadeScale}
                    onChange={(e) => setFormData({ ...formData, shadeScale: e.target.value })}
                    className="h-11"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4 bg-muted/20 p-5 rounded-xl border">
              <Label className="text-base font-semibold">
                Método de Envio do Molde/Escaneamento
              </Label>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(v) => setFormData({ ...formData, shippingMethod: v })}
                className="flex flex-col space-y-3 mt-2"
              >
                <div className="flex items-center space-x-3 bg-background p-3 rounded-lg border">
                  <RadioGroupItem value="lab_pickup" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer flex-1">
                    Solicitar motoboy do laboratório
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-background p-3 rounded-lg border">
                  <RadioGroupItem value="dentist_send" id="r2" />
                  <Label htmlFor="r2" className="font-bold cursor-pointer flex-1">
                    VOU ENVIAR ARQUIVO STL
                  </Label>
                </div>
              </RadioGroup>
              {formData.shippingMethod === 'dentist_send' && (
                <div className="mt-4 pt-4 border-t space-y-2 animate-fade-in-down">
                  <Label className="uppercase font-semibold text-xs text-primary">
                    FORMA DO ENVIO *
                  </Label>
                  <Input
                    placeholder="Link ou método..."
                    value={formData.stlDeliveryMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, stlDeliveryMethod: e.target.value })
                    }
                    className="h-11"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="uppercase font-semibold text-xs">Observações Adicionais</Label>
              <Textarea
                placeholder="Instruções sobre textura, formato..."
                className="min-h-[100px]"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-5 flex justify-end gap-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-11 px-6"
            >
              Cancelar
            </Button>
            <Button type="submit" className="h-11 px-8 text-base" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar Pedido'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
