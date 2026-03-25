import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toast } from '@/hooks/use-toast'
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Calculator,
  Settings,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Filter,
  Search,
  Copy,
  Printer,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HourlyCostDashboard } from '@/components/HourlyCostDashboard'
import { calculateProcedureProfitability, computeHourlyCosts } from '@/lib/financial'

interface StageInput {
  name: string
  price: string
  kanban_stage: string
}

const formatBRL = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const parseLocalNum = (val: string | number | null | undefined) => {
  const parsed = parseFloat(String(val ?? '').replace(',', '.'))
  return !isNaN(parsed) ? parsed : 0
}

const isInvalidNumber = (val: string | number | null | undefined) => {
  const str = String(val ?? '').trim()
  if (str === '') return true
  const parsed = parseFloat(str.replace(',', '.'))
  return isNaN(parsed) || parsed < 0
}

export default function PriceList() {
  const { selectedLab, kanbanStages, appSettings, updateSettings, currentUser } = useAppStore()
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [globalConfigOpen, setGlobalConfigOpen] = useState(false)
  const [profitFilter, setProfitFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Validation States
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [globalErrors, setGlobalErrors] = useState<Record<string, boolean>>({})
  const [globalAttempted, setGlobalAttempted] = useState(false)

  const sharedCosts = useMemo(() => computeHourlyCosts(appSettings), [appSettings])

  const getSetting = useCallback(
    (key: string) => {
      return appSettings[key] || ''
    },
    [appSettings],
  )

  const [configForm, setConfigForm] = useState({
    cardFee: '0',
    commission: '0',
    inadimplency: '0',
    taxes: '0',
  })

  const [formData, setFormData] = useState({
    id: '',
    work_type: '',
    category: 'PROTESE FIXA',
    material: '',
    price: '',
    sector: 'Soluções Cerâmicas',
    execution_time: '',
    cadista_cost: '',
    material_cost: '',
    is_hidden: false,
    notes: '',
    estrutura_fixacao: 'SOBRE DENTE',
    stages: [] as StageInput[],
  })

  const fetchPrices = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('price_list')
      .select('*, price_stages(*)')
      .order('work_type', { ascending: true })
    if (data) {
      const sorted = data.sort((a, b) =>
        (a.work_type || '').localeCompare(b.work_type || '', 'pt-BR'),
      )
      setPrices(sorted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  const getMargin = useCallback(
    (item: any) => {
      const pNum = parseLocalNum(item.price)
      const eTime = parseLocalNum(item.execution_time)
      const cVal = parseLocalNum(item.cadista_cost)
      const mVal = parseLocalNum(item.material_cost)

      const globalCardFee = parseLocalNum(getSetting('global_card_fee'))
      const globalCommission = parseLocalNum(getSetting('global_commission'))
      const globalInadimplency = parseLocalNum(getSetting('global_inadimplency'))
      const globalTaxes = parseLocalNum(getSetting('global_taxes'))

      const { profitMargin } = calculateProcedureProfitability({
        price: pNum,
        executionTime: eTime,
        cadistaCost: cVal,
        materialCost: mVal,
        costPerMinute: sharedCosts.costPerMinute,
        globalCardFee,
        globalCommission,
        globalInadimplency,
        globalTaxes,
      })

      return profitMargin
    },
    [getSetting, sharedCosts.costPerMinute],
  )

  const filteredPrices = useMemo(() => {
    const result = prices.filter((p) => {
      if (selectedLab !== 'Todos' && (p.sector || '').toUpperCase() !== selectedLab.toUpperCase())
        return false

      if (profitFilter.length > 0) {
        const margin = getMargin(p)
        let category = 'low'
        if (margin > 20) category = 'high'
        else if (margin >= 10) category = 'medium'

        if (!profitFilter.includes(category)) return false
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchesWorkType = p.work_type?.toLowerCase().includes(q)
        const matchesCategory = p.category?.toLowerCase().includes(q)
        const matchesMaterial = p.material?.toLowerCase().includes(q)
        if (!matchesWorkType && !matchesCategory && !matchesMaterial) return false
      }

      return true
    })

    return result.sort((a, b) => (a.work_type || '').localeCompare(b.work_type || '', 'pt-BR'))
  }, [prices, selectedLab, profitFilter, getMargin, searchQuery])

  const availableMaterials = useMemo(() => {
    let list: string[] = []
    try {
      if (appSettings['materials_list']) {
        list = JSON.parse(appSettings['materials_list'])
      }
    } catch (e) {
      console.error('Failed to parse materials_list', e)
    }
    const fromPriceList = prices.map((p) => p.material).filter(Boolean)
    return Array.from(new Set([...list, ...fromPriceList])).sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    )
  }, [appSettings, prices])

  const handleOpenGlobalConfig = () => {
    setGlobalErrors({})
    setGlobalAttempted(false)
    setConfigForm({
      cardFee: getSetting('global_card_fee') || '0',
      commission: getSetting('global_commission') || '0',
      inadimplency: getSetting('global_inadimplency') || '0',
      taxes: getSetting('global_taxes') || '0',
    })
    setGlobalConfigOpen(true)
  }

  const handleSaveGlobalConfig = async () => {
    setGlobalAttempted(true)
    const newErrors: Record<string, boolean> = {}

    if (isInvalidNumber(configForm.cardFee)) newErrors.cardFee = true
    if (isInvalidNumber(configForm.commission)) newErrors.commission = true
    if (isInvalidNumber(configForm.inadimplency)) newErrors.inadimplency = true
    if (isInvalidNumber(configForm.taxes)) newErrors.taxes = true

    setGlobalErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return toast({ title: 'Preencha os campos obrigatórios.', variant: 'destructive' })
    }

    const updates = {
      global_card_fee: configForm.cardFee || '0',
      global_commission: configForm.commission || '0',
      global_inadimplency: configForm.inadimplency || '0',
      global_taxes: configForm.taxes || '0',
    }

    await updateSettings(updates)

    toast({ title: 'Taxas globais salvas com sucesso!' })
    setGlobalConfigOpen(false)
  }

  const handleGlobalChange = (field: keyof typeof configForm, value: string) => {
    setConfigForm((prev) => ({ ...prev, [field]: value }))
    if (globalAttempted || globalErrors[field]) {
      setGlobalErrors((prev) => ({ ...prev, [field]: isInvalidNumber(value) }))
    }
  }

  const handleGlobalBlur = (field: keyof typeof configForm) => {
    setGlobalErrors((prev) => ({ ...prev, [field]: isInvalidNumber(configForm[field]) }))
  }

  const handleNew = () => {
    setFormErrors({})
    setHasAttemptedSubmit(false)
    setFormData({
      id: '',
      work_type: '',
      category: 'PROTESE FIXA',
      material: '',
      price: '',
      sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
      execution_time: '',
      cadista_cost: '',
      material_cost: '',
      is_hidden: false,
      notes: '',
      estrutura_fixacao: 'SOBRE DENTE',
      stages: [],
    })
    setModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setFormErrors({})
    setHasAttemptedSubmit(false)
    setFormData({
      id: item.id,
      work_type: item.work_type,
      category: item.category,
      material: item.material || '',
      price: item.price,
      sector: item.sector || 'Soluções Cerâmicas',
      execution_time: item.execution_time ? String(item.execution_time) : '',
      cadista_cost: item.cadista_cost ? String(item.cadista_cost) : '',
      material_cost: item.material_cost ? String(item.material_cost) : '',
      is_hidden: item.is_hidden || false,
      notes: item.notes || '',
      estrutura_fixacao: item.estrutura_fixacao || 'SOBRE DENTE',
      stages: (item.price_stages || []).map((s: any) => ({
        name: s.name,
        price: String(s.price),
        kanban_stage: s.kanban_stage,
      })),
    })
    setModalOpen(true)
  }

  const handleDuplicate = (item: any) => {
    setFormErrors({})
    setHasAttemptedSubmit(false)
    setFormData({
      id: '',
      work_type: `${item.work_type} (Cópia)`,
      category: item.category,
      material: item.material || '',
      price: item.price,
      sector: item.sector || 'Soluções Cerâmicas',
      execution_time: item.execution_time ? String(item.execution_time) : '',
      cadista_cost: item.cadista_cost ? String(item.cadista_cost) : '',
      material_cost: item.material_cost ? String(item.material_cost) : '',
      is_hidden: item.is_hidden || false,
      notes: item.notes || '',
      estrutura_fixacao: item.estrutura_fixacao || 'SOBRE DENTE',
      stages: (item.price_stages || []).map((s: any) => ({
        name: s.name,
        price: String(s.price),
        kanban_stage: s.kanban_stage,
      })),
    })
    setModalOpen(true)
  }

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (hasAttemptedSubmit || formErrors[field]) {
      if (field === 'price') {
        setFormErrors((prev) => ({ ...prev, [field]: isInvalidNumber(value as string) }))
      } else if (field !== 'is_hidden' && typeof value === 'string') {
        setFormErrors((prev) => ({ ...prev, [field]: !value.trim() }))
      }
    }
  }

  const handleFormBlur = (field: keyof typeof formData) => {
    if (field === 'price') {
      setFormErrors((prev) => ({ ...prev, [field]: isInvalidNumber(formData[field] as string) }))
    } else if (field !== 'is_hidden') {
      setFormErrors((prev) => ({
        ...prev,
        [field]: !(formData[field] as string)?.toString().trim(),
      }))
    }
  }

  const handleSave = async () => {
    setHasAttemptedSubmit(true)
    const newErrors: Record<string, boolean> = {}

    if (!formData.work_type?.trim()) newErrors.work_type = true
    if (isInvalidNumber(formData.price)) newErrors.price = true

    formData.stages.forEach((stage, idx) => {
      if (!stage.name?.trim()) newErrors[`stage_${idx}_name`] = true
      if (isInvalidNumber(stage.price)) newErrors[`stage_${idx}_price`] = true
    })

    setFormErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return toast({ title: 'Preencha os campos obrigatórios.', variant: 'destructive' })
    }

    const execTimeForSave = parseLocalNum(formData.execution_time)
    const calculatedFixedCost = execTimeForSave * sharedCosts.costPerMinute

    const payload: any = {
      work_type: formData.work_type,
      category: formData.category,
      material: formData.material,
      price: formData.price,
      sector: formData.sector,
      execution_time: execTimeForSave,
      cadista_cost: parseLocalNum(formData.cadista_cost),
      material_cost: parseLocalNum(formData.material_cost),
      fixed_cost: calculatedFixedCost,
      is_hidden: formData.is_hidden,
      notes: formData.notes,
      estrutura_fixacao: formData.estrutura_fixacao,
    }

    let priceListId = formData.id

    if (priceListId) {
      const { error } = await supabase.from('price_list').update(payload).eq('id', priceListId)
      if (error) return toast({ title: 'Erro ao atualizar', variant: 'destructive' })
      await supabase.from('price_stages').delete().eq('price_list_id', priceListId)
    } else {
      const { data, error } = await supabase.from('price_list').insert(payload).select().single()
      if (error) return toast({ title: 'Erro ao criar', variant: 'destructive' })
      priceListId = data.id
    }

    if (formData.stages.length > 0) {
      const stagesToInsert = formData.stages.map((s) => ({
        price_list_id: priceListId,
        name: s.name,
        price: parseLocalNum(s.price),
        kanban_stage: s.kanban_stage || kanbanStages[0]?.name || 'TRIAGEM',
      }))
      await supabase.from('price_stages').insert(stagesToInsert)
    }

    toast({ title: 'Procedimento salvo com sucesso!' })
    setModalOpen(false)
    fetchPrices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este procedimento?')) return
    const { error } = await supabase.from('price_list').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Procedimento excluído' })
      fetchPrices()
    }
  }

  const updateStage = (index: number, key: keyof StageInput, value: string) => {
    const newStages = [...formData.stages]
    newStages[index][key] = value
    setFormData({ ...formData, stages: newStages })

    if (hasAttemptedSubmit || formErrors[`stage_${index}_${key}`]) {
      if (key === 'price') {
        setFormErrors((prev) => ({ ...prev, [`stage_${index}_${key}`]: isInvalidNumber(value) }))
      } else {
        setFormErrors((prev) => ({ ...prev, [`stage_${index}_${key}`]: !value.trim() }))
      }
    }
  }

  const handleStageBlur = (index: number, key: keyof StageInput) => {
    if (key === 'price') {
      setFormErrors((prev) => ({
        ...prev,
        [`stage_${index}_${key}`]: isInvalidNumber(formData.stages[index][key]),
      }))
    } else {
      setFormErrors((prev) => ({
        ...prev,
        [`stage_${index}_${key}`]: !formData.stages[index][key]?.trim(),
      }))
    }
  }

  const priceNum = parseLocalNum(formData.price)
  const execTime = parseLocalNum(formData.execution_time)
  const cadistaVal = parseLocalNum(formData.cadista_cost)
  const materialVal = parseLocalNum(formData.material_cost)

  const globalCardFee = parseLocalNum(getSetting('global_card_fee'))
  const globalCommission = parseLocalNum(getSetting('global_commission'))
  const globalInadimplency = parseLocalNum(getSetting('global_inadimplency'))
  const globalTaxes = parseLocalNum(getSetting('global_taxes'))

  const {
    fixedCost,
    cardFeeVal,
    commissionVal,
    inadimplencyVal,
    taxesVal,
    totalCosts,
    profitVal,
    profitMargin,
  } = calculateProcedureProfitability({
    price: priceNum,
    executionTime: execTime,
    cadistaCost: cadistaVal,
    materialCost: materialVal,
    costPerMinute: sharedCosts.costPerMinute,
    globalCardFee,
    globalCommission,
    globalInadimplency,
    globalTaxes,
  })

  const fixedCostPerc = priceNum > 0 ? (fixedCost / priceNum) * 100 : 0
  const materialCostPerc = priceNum > 0 ? (materialVal / priceNum) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl dark:bg-emerald-900/30">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Tabela de Preços</h2>
              <p className="text-muted-foreground text-sm">
                Gerencie os valores cobrados por procedimento e analise margens.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link to="/materials">
                <Settings className="w-4 h-4 mr-2" /> Materiais
              </Link>
            </Button>
            <Button variant="outline" onClick={handleOpenGlobalConfig}>
              <Settings className="w-4 h-4 mr-2" /> Taxas Globais
            </Button>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/hourly-cost">
                <Calculator className="w-4 h-4 mr-2" /> Custo Hora
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> Exportar PDF
            </Button>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" /> Novo Procedimento
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 bg-muted/30 p-3 rounded-lg border">
          <div className="flex-1 flex items-center gap-2 w-full sm:max-w-xs relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3" />
            <Input
              placeholder="Buscar procedimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background w-full normal-case"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="text-sm font-medium text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">Filtrar por Margem:</span>
            </div>
            <ToggleGroup
              type="multiple"
              value={profitFilter}
              onValueChange={setProfitFilter}
              className="justify-start flex-wrap gap-2"
            >
              <ToggleGroupItem
                value="high"
                aria-label="Alta Margem"
                variant="outline"
                className="h-8 px-3 text-xs data-[state=on]:bg-emerald-100 data-[state=on]:border-emerald-300 data-[state=on]:text-emerald-900 dark:data-[state=on]:bg-emerald-900/40 dark:data-[state=on]:border-emerald-800 dark:data-[state=on]:text-emerald-300 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-sm" />
                Alta (&gt; 20%)
              </ToggleGroupItem>
              <ToggleGroupItem
                value="medium"
                aria-label="Margem Média"
                variant="outline"
                className="h-8 px-3 text-xs data-[state=on]:bg-amber-100 data-[state=on]:border-amber-300 data-[state=on]:text-amber-900 dark:data-[state=on]:bg-amber-900/40 dark:data-[state=on]:border-amber-800 dark:data-[state=on]:text-amber-300 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-sm" />
                Média (10% a 20%)
              </ToggleGroupItem>
              <ToggleGroupItem
                value="low"
                aria-label="Baixa Margem"
                variant="outline"
                className="h-8 px-3 text-xs data-[state=on]:bg-red-100 data-[state=on]:border-red-300 data-[state=on]:text-red-900 dark:data-[state=on]:bg-red-900/40 dark:data-[state=on]:border-red-800 dark:data-[state=on]:text-red-300 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-sm" />
                Baixa (&lt; 10%)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Card className="shadow-subtle">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 h-10 py-2">Procedimento</TableHead>
                  <TableHead className="h-10 py-2">Setor</TableHead>
                  <TableHead className="text-right h-10 py-2">Valor Venda Final</TableHead>
                  <TableHead className="text-right h-10 py-2">Tempo Exec.</TableHead>
                  <TableHead className="text-right h-10 py-2">Custo / Min</TableHead>
                  <TableHead className="text-right h-10 py-2">Custo Fixo Est.</TableHead>
                  <TableHead className="text-right pr-6 h-10 py-2">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Carregando procedimentos...
                    </TableCell>
                  </TableRow>
                ) : filteredPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      {prices.length > 0 && (profitFilter.length > 0 || searchQuery)
                        ? 'Nenhum procedimento encontrado para os filtros selecionados.'
                        : 'Nenhum procedimento encontrado.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrices.map((item) => {
                    const margin = getMargin(item)
                    let containerClass =
                      'flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-colors text-white '
                    let badgeClass = 'px-1.5 py-0.5 rounded text-[11px] font-bold shadow-sm '

                    if (margin > 20) {
                      containerClass +=
                        'bg-emerald-500 border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700'
                      badgeClass += 'bg-emerald-600/50 border border-emerald-400/50'
                    } else if (margin >= 10) {
                      containerClass +=
                        'bg-amber-500 border-amber-600 dark:bg-amber-600 dark:border-amber-700'
                      badgeClass += 'bg-amber-600/50 border border-amber-400/50'
                    } else {
                      containerClass +=
                        'bg-red-500 border-red-600 dark:bg-red-600 dark:border-red-700'
                      badgeClass += 'bg-red-600/50 border border-red-400/50'
                    }

                    return (
                      <TableRow key={item.id} className="group hover:bg-muted/30">
                        <TableCell className="pl-6 py-1.5 min-w-[320px]">
                          <div className={containerClass}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-bold tracking-tight leading-tight text-[13px]">
                                  {item.work_type}
                                </span>
                                {item.is_hidden && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] uppercase border-white/40 text-white bg-black/20 px-1 py-0 h-4"
                                  >
                                    Oculto
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] font-medium text-white/80 mt-0 uppercase tracking-wider">
                                {item.category}
                              </span>
                            </div>
                            <div className={badgeClass}>{margin.toFixed(1)}%</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Badge variant="outline" className="bg-muted/50 text-[10px] py-0 h-5">
                            {item.sector || 'Geral'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold py-1.5 text-[13px]">
                          {formatBRL(parseLocalNum(item.price))}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground py-1.5 text-xs">
                          {item.execution_time ? `${item.execution_time} min` : '-'}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground font-medium py-1.5 text-xs">
                          {formatBRL(sharedCosts.costPerMinute)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground py-1.5 text-xs">
                          {formatBRL((item.execution_time || 0) * sharedCosts.costPerMinute)}
                        </TableCell>
                        <TableCell className="text-right pr-6 py-1.5 space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(item)}
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                          {(currentUser?.role === 'master' || currentUser?.role === 'admin') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDuplicate(item)}
                              title="Duplicar"
                            >
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Global Config Dialog */}
        <Dialog open={globalConfigOpen} onOpenChange={setGlobalConfigOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configurações Globais de Precificação</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Estas taxas em % serão aplicadas automaticamente na análise de rentabilidade de
                todos os procedimentos sobre o Valor de Venda Final.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Taxa de Cartão (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={configForm.cardFee}
                    onChange={(e) => handleGlobalChange('cardFee', e.target.value)}
                    onBlur={() => handleGlobalBlur('cardFee')}
                    className={cn(
                      globalErrors.cardFee && 'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Comissões (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={configForm.commission}
                    onChange={(e) => handleGlobalChange('commission', e.target.value)}
                    onBlur={() => handleGlobalBlur('commission')}
                    className={cn(
                      globalErrors.commission &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Inadimplência (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={configForm.inadimplency}
                    onChange={(e) => handleGlobalChange('inadimplency', e.target.value)}
                    onBlur={() => handleGlobalBlur('inadimplency')}
                    className={cn(
                      globalErrors.inadimplency &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Impostos (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={configForm.taxes}
                    onChange={(e) => handleGlobalChange('taxes', e.target.value)}
                    onBlur={() => handleGlobalBlur('taxes')}
                    className={cn(
                      globalErrors.taxes && 'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGlobalConfigOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGlobalConfig}>Salvar Taxas</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Procedure Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Editar Procedimento' : 'Novo Procedimento'}</DialogTitle>
            </DialogHeader>

            {modalOpen && <HourlyCostDashboard />}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-4 max-h-[55vh] overflow-y-auto px-1 pr-3 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>
                      Nome do Procedimento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={formData.work_type}
                      onChange={(e) => handleFormChange('work_type', e.target.value)}
                      onBlur={() => handleFormBlur('work_type')}
                      className={cn(
                        formErrors.work_type && 'border-destructive focus-visible:ring-destructive',
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Categoria <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => handleFormChange('category', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROTESE FIXA">PROTESE FIXA</SelectItem>
                        <SelectItem value="PRÓTESE MÓVEL">PRÓTESE MÓVEL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Setor</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(v) => handleFormChange('sector', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLUÇÕES CERÂMICAS">Soluções Cerâmicas</SelectItem>
                        <SelectItem value="STÚDIO ACRÍLICO">Studio Acrílico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Material</Label>
                    <Input
                      list="materials-list"
                      placeholder="Selecione ou digite um material..."
                      value={formData.material}
                      onChange={(e) => handleFormChange('material', e.target.value)}
                    />
                    <datalist id="materials-list">
                      {availableMaterials.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Valor de Venda Final (R$) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="150,00"
                      value={formData.price}
                      className={cn(
                        'font-semibold',
                        formErrors.price && 'border-destructive focus-visible:ring-destructive',
                      )}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                      onBlur={() => handleFormBlur('price')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tempo de Execução (minutos)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex: 45"
                      value={formData.execution_time}
                      onChange={(e) => handleFormChange('execution_time', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                      CUSTO FIXO ESPECÍFICO DESTE PROCEDIMENTO (Tempo × Custo/Min)
                    </Label>
                    <Input
                      value={formatBRL(fixedCost)}
                      readOnly
                      disabled
                      className="bg-muted font-semibold text-primary cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Custo Cadista / Terceiro (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.cadista_cost}
                      onChange={(e) => handleFormChange('cadista_cost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custo de Material (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.material_cost}
                      onChange={(e) => handleFormChange('material_cost', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estrutura de Fixação</Label>
                    <Select
                      value={formData.estrutura_fixacao}
                      onValueChange={(v) => handleFormChange('estrutura_fixacao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOBRE DENTE">SOBRE DENTE</SelectItem>
                        <SelectItem value="SOBRE IMPLANTE">SOBRE IMPLANTE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Input
                      className="normal-case"
                      value={formData.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      placeholder="Notas adicionais"
                    />
                  </div>

                  {currentUser?.role === 'master' && (
                    <div className="space-y-2 col-span-2 flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20 mt-2">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold text-destructive">
                          PROCEDIMENTO OCULTO
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Este procedimento será usado apenas para testes e ficará invisível para os
                          demais usuários.
                        </p>
                      </div>
                      <Switch
                        checked={formData.is_hidden}
                        onCheckedChange={(v) => handleFormChange('is_hidden', v)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-6 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">
                        Etapas de Faturamento (Opcional)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Divida o valor por etapas do Kanban (não interfere no cálculo de lucro).
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          stages: [
                            ...p.stages,
                            { name: '', price: '', kanban_stage: kanbanStages[0]?.name || '' },
                          ],
                        }))
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Etapa
                    </Button>
                  </div>
                  {formData.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-end bg-muted/40 p-3 rounded-md border border-border/50"
                    >
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">
                          Descrição <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          size="sm"
                          value={stage.name}
                          onChange={(e) => updateStage(idx, 'name', e.target.value)}
                          onBlur={() => handleStageBlur(idx, 'name')}
                          className={cn(
                            formErrors[`stage_${idx}_name`] &&
                              'border-destructive focus-visible:ring-destructive',
                          )}
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-xs">
                          Valor (R$) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          size="sm"
                          type="text"
                          inputMode="decimal"
                          value={stage.price}
                          onChange={(e) => updateStage(idx, 'price', e.target.value)}
                          onBlur={() => handleStageBlur(idx, 'price')}
                          className={cn(
                            formErrors[`stage_${idx}_price`] &&
                              'border-destructive focus-visible:ring-destructive',
                          )}
                        />
                      </div>
                      <div className="w-48 space-y-1">
                        <Label className="text-xs">Gatilho (Kanban)</Label>
                        <Select
                          value={stage.kanban_stage}
                          onValueChange={(v) => updateStage(idx, 'kanban_stage', v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {kanbanStages.map((s) => (
                              <SelectItem key={s.id} value={s.name}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            stages: p.stages.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Profitability Analysis */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border flex flex-col h-full sticky top-0 shadow-sm">
                  <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
                    <PieChart className="w-5 h-5" /> Análise de Rentabilidade
                  </h3>

                  <div className="space-y-3 flex-1 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Preço de Venda Final</span>
                      <span className="text-lg">{formatBRL(priceNum)}</span>
                    </div>

                    <div className="h-px bg-border my-2" />

                    <div className="flex justify-between text-muted-foreground items-center">
                      <span>Custo Fixo</span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(fixedCost)}{' '}
                        <span className="w-12 text-right text-[10px]">
                          ({fixedCostPerc.toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Custo Cadista / Terceiros</span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(cadistaVal)}{' '}
                        <span className="w-12 text-right text-[10px]">
                          ({priceNum > 0 ? ((cadistaVal / priceNum) * 100).toFixed(1) : 0}%)
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Custo de Material</span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(materialVal)}{' '}
                        <span className="w-12 text-right text-[10px]">
                          ({materialCostPerc.toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-px bg-border/50 my-2" />

                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Taxa de Cartão <span className="text-[10px]">({globalCardFee}%)</span>
                      </span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(cardFeeVal)} <span className="w-12"></span>
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Comissões <span className="text-[10px]">({globalCommission}%)</span>
                      </span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(commissionVal)} <span className="w-12"></span>
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Impostos <span className="text-[10px]">({globalTaxes}%)</span>
                      </span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(taxesVal)} <span className="w-12"></span>
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Inadimplência <span className="text-[10px]">({globalInadimplency}%)</span>
                      </span>
                      <span className="flex items-center gap-2">
                        - {formatBRL(inadimplencyVal)} <span className="w-12"></span>
                      </span>
                    </div>

                    <div className="h-px bg-border my-2" />

                    <div className="flex justify-between font-medium text-destructive">
                      <span>Custo Total Estimado</span>
                      <span>{formatBRL(totalCosts)}</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'mt-6 p-4 rounded-lg border transition-colors',
                      profitMargin >= 20
                        ? 'bg-emerald-600 border-emerald-700 text-white dark:bg-emerald-900 dark:border-emerald-950'
                        : profitMargin >= 10
                          ? 'bg-amber-500 border-amber-600 text-white dark:bg-amber-600 dark:border-amber-700'
                          : 'bg-red-600 border-red-700 text-white dark:bg-red-900 dark:border-red-950',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-90 mb-0.5">
                          Lucro Líquido Estimado
                        </p>
                        <p className="text-2xl font-bold">{formatBRL(profitVal)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-90 mb-0.5">
                          Margem
                        </p>
                        <p className="text-xl font-bold flex items-center justify-end gap-1">
                          {profitMargin >= 20 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {profitMargin.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    {profitMargin < 10 && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-[11px] font-bold tracking-wide flex items-center gap-1.5 uppercase">
                          <AlertTriangle className="w-4 h-4" />
                          ALERTA: PERIGO DE LUCRATIVIDADE BAIXA
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Procedimento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* PRINT ONLY VIEW */}
      <div id="price-list-print-area" className="hidden print:block w-full bg-white text-black p-4">
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-black">VITALI LAB</h2>
          <h3 className="text-xl text-gray-800 mt-1 uppercase font-semibold">
            Tabela de Preços - {selectedLab === 'Todos' ? 'Visão Consolidada' : selectedLab}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Gerado em {new Date().toLocaleDateString('pt-BR')} às{' '}
            {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <table className="w-full text-left border-collapse text-sm mb-8">
          <thead>
            <tr className="border-b-2 border-black text-black">
              <th className="py-3 px-2 font-bold uppercase text-xs w-1/3">Procedimento</th>
              <th className="py-3 px-2 font-bold uppercase text-xs">Categoria</th>
              <th className="py-3 px-2 font-bold uppercase text-xs">Material</th>
              <th className="py-3 px-2 text-right font-bold uppercase text-xs">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-gray-300 break-inside-avoid',
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                )}
              >
                <td className="py-2.5 px-2 font-semibold text-gray-900">{item.work_type}</td>
                <td className="py-2.5 px-2 text-gray-700 text-xs uppercase">{item.category}</td>
                <td className="py-2.5 px-2 text-gray-700 text-xs uppercase">
                  {item.material || '-'}
                </td>
                <td className="py-2.5 px-2 text-right font-bold text-black whitespace-nowrap">
                  {formatBRL(parseLocalNum(item.price))}
                </td>
              </tr>
            ))}
            {filteredPrices.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                  Nenhum procedimento encontrado para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          Documento gerado internamente pelo sistema Studio Vitali Lab. Valores sujeitos a
          alteração.
        </div>
      </div>
    </div>
  )
}
