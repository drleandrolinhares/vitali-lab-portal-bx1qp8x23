import { useState, useEffect, useMemo } from 'react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown, UploadCloud, X, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewRequest() {
  const { addOrder, currentUser, priceList, appSettings } = useAppStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [availableWorkTypes, setAvailableWorkTypes] = useState<string[]>([])
  const [dentistsList, setDentistsList] = useState<{ id: string; name: string }[]>([])
  const [scaleOpen, setScaleOpen] = useState(false)
  const [materialOpen, setMaterialOpen] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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
    implantBrand: '',
    implantType: '',
    estruturaFixacao: 'SOBRE DENTE',
  })
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [selectedArches, setSelectedArches] = useState<string[]>([])

  const isAdminOrReception = currentUser?.role === 'admin' || currentUser?.role === 'receptionist'

  const availableMaterials = useMemo(() => {
    let list: string[] = []
    try {
      if (appSettings['materials_list']) {
        list = JSON.parse(appSettings['materials_list'])
      }
    } catch (e) {
      console.error('Failed to parse materials_list', e)
    }

    const fromPriceList = priceList.map((p) => p.material).filter(Boolean)
    return Array.from(new Set([...list, ...fromPriceList])).sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    )
  }, [appSettings, priceList])

  const availableScales = useMemo(() => {
    if (appSettings['shade_scales']) {
      try {
        const parsed = JSON.parse(appSettings['shade_scales'])
        return parsed.sort((a: string, b: string) => a.localeCompare(b, 'pt-BR'))
      } catch (e) {
        console.error('Failed to parse shade_scales', e)
      }
    }
    return []
  }, [appSettings])

  const availableImplantBrands = useMemo(() => {
    if (appSettings['implant_brands']) {
      try {
        const parsed = JSON.parse(appSettings['implant_brands'])
        return parsed.sort((a: string, b: string) => a.localeCompare(b, 'pt-BR'))
      } catch (e) {
        console.error('Failed to parse implant_brands', e)
      }
    }
    return []
  }, [appSettings])

  useEffect(() => {
    if (isAdminOrReception) {
      const fetchDentists = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, name, clinic')
          .eq('role', 'dentist')
        if (data) {
          const sorted = data
            .map((d: any) => ({
              id: d.id,
              name: `${d.name} ${d.clinic ? `(${d.clinic})` : ''}`,
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name, 'pt-BR'))
          setDentistsList(sorted)
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
          priceList
            .filter((p) => {
              const catMatch = p.category && normalize(p.category) === normalizedFormSector
              const secMatch = p.sector && normalize(p.sector) === normalizedFormSector
              return catMatch || secMatch
            })
            .map((p) => p.work_type)
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, 'pt-BR'))

      setAvailableWorkTypes(filtered)

      if (formData.workType && !filtered.includes(formData.workType)) {
        setFormData((prev) => ({ ...prev, workType: '' }))
      }
    } else {
      setAvailableWorkTypes([])
    }
  }, [formData.sector, priceList])

  useEffect(() => {
    if (formData.workType && formData.sector) {
      const priceItem =
        priceList.find((p) => p.work_type === formData.workType && p.sector === formData.sector) ||
        priceList.find((p) => p.work_type === formData.workType)

      if (priceItem && priceItem.material) {
        setFormData((prev) => ({ ...prev, material: priceItem.material }))
      }
    }
  }, [formData.workType, formData.sector, priceList])

  const isSobreImplante = formData.estruturaFixacao === 'SOBRE IMPLANTE'

  useEffect(() => {
    if (!isSobreImplante) {
      setFormData((prev) => ({ ...prev, implantBrand: '', implantType: '' }))
    }
  }, [isSobreImplante])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArr])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

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

    if (!formData.material) {
      toast({
        title: 'Atenção',
        description: 'Selecione um material para o pedido.',
        variant: 'destructive',
      })
      return
    }

    if (isSobreImplante) {
      if (!formData.implantBrand) {
        toast({
          title: 'Atenção',
          description: 'A Marca do Componente é obrigatória para este procedimento.',
          variant: 'destructive',
        })
        return
      }
      if (!formData.implantType) {
        toast({
          title: 'Atenção',
          description: 'O Tipo do Componente é obrigatório para este procedimento.',
          variant: 'destructive',
        })
        return
      }
    }

    setSubmitting(true)

    let fileUrls: string[] = []
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${currentUser?.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('order_files')
          .upload(filePath, file)

        if (!uploadError) {
          const { data } = supabase.storage.from('order_files').getPublicUrl(filePath)
          fileUrls.push(data.publicUrl)
        } else {
          toast({
            title: 'Erro de upload',
            description: `Falha ao enviar arquivo ${file.name}`,
            variant: 'destructive',
          })
        }
      }
    }

    const success = await addOrder({
      ...formData,
      material: formData.material,
      stlDeliveryMethod:
        formData.shippingMethod === 'dentist_send' ? formData.stlDeliveryMethod : '',
      teeth: selectedTeeth,
      arches: selectedArches,
      fileUrls,
    })
    setSubmitting(false)

    if (success) {
      navigate('/app')
    }
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

            {isSobreImplante && (
              <div className="grid gap-6 sm:grid-cols-2 bg-muted/10 p-5 rounded-xl border animate-fade-in-down">
                <div className="space-y-2">
                  <Label className="uppercase font-semibold text-xs">Marca do Componente *</Label>
                  {availableImplantBrands.length > 0 ? (
                    <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={brandOpen}
                          className={cn(
                            'w-full justify-between h-11 font-normal bg-background',
                            !formData.implantBrand && 'text-muted-foreground',
                          )}
                        >
                          {formData.implantBrand || 'Selecione a marca...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar marca..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                            <CommandGroup>
                              {availableImplantBrands.map((b) => (
                                <CommandItem
                                  key={b}
                                  value={b}
                                  onSelect={(currentValue) => {
                                    const originalValue =
                                      availableImplantBrands.find(
                                        (m) => m.toLowerCase() === currentValue,
                                      ) || currentValue
                                    setFormData((prev) => ({
                                      ...prev,
                                      implantBrand:
                                        originalValue === formData.implantBrand
                                          ? ''
                                          : originalValue,
                                    }))
                                    setBrandOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      formData.implantBrand === b ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {b}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      placeholder="Ex: Neodent, Straumann..."
                      value={formData.implantBrand}
                      onChange={(e) => setFormData({ ...formData, implantBrand: e.target.value })}
                      className="h-11"
                      required
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-semibold text-xs">Tipo do Componente *</Label>
                  <Input
                    placeholder="Ex: Munhão Universal..."
                    value={formData.implantType}
                    onChange={(e) => setFormData({ ...formData, implantType: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
              </div>
            )}

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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Estrutura de Fixação *</Label>
                <Select
                  value={formData.estruturaFixacao}
                  onValueChange={(v) => setFormData({ ...formData, estruturaFixacao: v })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOBRE DENTE">SOBRE DENTE</SelectItem>
                    <SelectItem value="SOBRE IMPLANTE">SOBRE IMPLANTE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="uppercase font-semibold text-xs">Material *</Label>
                {availableMaterials.length > 0 ? (
                  <Popover open={materialOpen} onOpenChange={setMaterialOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={materialOpen}
                        className={cn(
                          'w-full justify-between h-11 font-normal bg-background',
                          !formData.material && 'text-muted-foreground',
                        )}
                      >
                        {formData.material || 'Selecione o material...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar material..." />
                        <CommandList>
                          <CommandEmpty>Nenhum material encontrado.</CommandEmpty>
                          <CommandGroup>
                            {availableMaterials.map((mat) => (
                              <CommandItem
                                key={mat}
                                value={mat}
                                onSelect={(currentValue) => {
                                  const originalValue =
                                    availableMaterials.find(
                                      (m) => m.toLowerCase() === currentValue,
                                    ) || currentValue
                                  setFormData((prev) => ({
                                    ...prev,
                                    material:
                                      originalValue === formData.material ? '' : originalValue,
                                  }))
                                  setMaterialOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    formData.material === mat ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                {mat}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    placeholder="Ex: Zircônia, Resina..."
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="h-11"
                    required
                  />
                )}
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
                  <Popover open={scaleOpen} onOpenChange={setScaleOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={scaleOpen}
                        className="w-full justify-between h-11 font-normal bg-background"
                      >
                        {formData.shadeScale
                          ? availableScales.find((s) => s === formData.shadeScale) ||
                            formData.shadeScale
                          : 'Selecione a escala...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar escala..." />
                        <CommandList>
                          <CommandEmpty>Nenhuma escala encontrada.</CommandEmpty>
                          <CommandGroup>
                            {availableScales.map((scale) => (
                              <CommandItem
                                key={scale}
                                value={scale}
                                onSelect={(currentValue) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    shadeScale:
                                      currentValue === formData.shadeScale ? '' : currentValue,
                                  }))
                                  setScaleOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    formData.shadeScale === scale ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                {scale}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    VOU ENVIAR ARQUIVO STL / LINK
                  </Label>
                </div>
              </RadioGroup>

              {formData.shippingMethod === 'dentist_send' && (
                <div className="mt-4 pt-4 border-t space-y-6 animate-fade-in-down">
                  <div className="space-y-3">
                    <Label className="uppercase font-semibold text-xs text-primary">
                      ANEXAR ARQUIVOS STL/DIGITAIS
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 border-primary/20 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-2 text-primary/60" />
                          <p className="mb-1 text-sm text-muted-foreground font-medium">
                            <span className="font-semibold text-primary">Clique para anexar</span>{' '}
                            ou arraste e solte
                          </p>
                          <p className="text-xs text-muted-foreground opacity-70">
                            .STL, .PLY, .OBJ, .ZIP (Max 50MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          multiple
                          accept=".stl,.obj,.ply,.zip,.rar"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mt-3">
                        {selectedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 text-sm bg-background border rounded-md"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileIcon className="w-4 h-4 text-primary shrink-0" />
                              <span className="truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-destructive shrink-0"
                              onClick={() => removeFile(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase font-semibold text-xs text-primary">
                      OU FORNEÇA UM LINK DE ENVIO (WeTransfer, Drive, etc)
                    </Label>
                    <Input
                      placeholder="Cole o link aqui..."
                      value={formData.stlDeliveryMethod}
                      onChange={(e) =>
                        setFormData({ ...formData, stlDeliveryMethod: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
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
