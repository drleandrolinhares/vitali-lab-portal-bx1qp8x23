import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
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

export default function NewRequest() {
  const { addOrder } = useAppStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    patientName: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientName || !formData.workType || !formData.sector) return
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
    navigate('/')
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
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coroa">Coroa Total</SelectItem>
                    <SelectItem value="Faceta">Faceta/Lente</SelectItem>
                    <SelectItem value="Inlay/Onlay">Inlay/Onlay</SelectItem>
                    <SelectItem value="Protocolo">Protocolo</SelectItem>
                    <SelectItem value="Placa">Placa de Bruxismo</SelectItem>
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
                <Input
                  placeholder="Ex: VITA..."
                  value={formData.shadeScale}
                  onChange={(e) => setFormData({ ...formData, shadeScale: e.target.value })}
                  className="h-11"
                />
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
