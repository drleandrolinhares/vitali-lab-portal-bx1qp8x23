import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HourlyCostDashboard } from '@/components/HourlyCostDashboard'

interface StageInput {
  name: string
  price: string
  kanban_stage: string
}

const formatBRL = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export default function PriceList() {
  const { selectedLab, kanbanStages, appSettings, updateSettings } = useAppStore()
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [globalConfigOpen, setGlobalConfigOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState<Record<string, string>>({})

  // Local state purely for the dialog form fields
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
    stages: [] as StageInput[],
  })

  const computeCosts = (config: Record<string, string>) => {
    const itemsStr = config['hourly_cost_fixed_items']
    const hoursStr = config['hourly_cost_monthly_hours']

    let totalCosts = 0
    let hours = 176

    if (itemsStr) {
      try {
        const items = JSON.parse(itemsStr)
        totalCosts += items.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
      } catch (e) {
        console.error('Failed to parse hourly_cost_fixed_items', e)
      }
    }
    if (hoursStr) {
      hours = parseFloat(String(hoursStr).replace(',', '.')) || 176
    }

    if (hours <= 0) return { totalFixedCosts: totalCosts, totalHourlyCost: 0, costPerMinute: 0 }

    const hourlyCost = totalCosts / hours

    return {
      totalFixedCosts: totalCosts,
      totalHourlyCost: hourlyCost,
      costPerMinute: hourlyCost / 60,
    }
  }

  const [tableCosts, setTableCosts] = useState({
    totalFixedCosts: 0,
    totalHourlyCost: 0,
    costPerMinute: 0,
  })

  const [modalCosts, setModalCosts] = useState({
    totalFixedCosts: 0,
    totalHourlyCost: 0,
    costPerMinute: 0,
  })

  useEffect(() => {
    const computed = computeCosts(appSettings)
    if (computed.totalFixedCosts > 0 || computed.totalHourlyCost > 0) {
      setTableCosts(computed)
    } else {
      const fetchDb = async () => {
        const { data } = await supabase
          .from('app_settings')
          .select('*')
          .in('key', ['hourly_cost_fixed_items', 'hourly_cost_monthly_hours'])
        if (data) {
          const config = data.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }),
            {},
          )
          setLocalConfig((prev) => ({ ...prev, ...config }))
          setTableCosts(computeCosts(config))
        }
      }
      fetchDb()
    }
  }, [appSettings])

  useEffect(() => {
    const fetchDbSettings = async () => {
      const { data } = await supabase.from('app_settings').select('*')
      if (data) {
        const mapped = data.reduce(
          (acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }),
          {},
        )
        setLocalConfig(mapped)
      }
    }
    fetchDbSettings()
  }, [])

  const fetchPrices = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('price_list')
      .select('*, price_stages(*)')
      .order('work_type')
    if (data) setPrices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  const filteredPrices = useMemo(() => {
    return prices.filter((p) => selectedLab === 'Todos' || p.sector === selectedLab)
  }, [prices, selectedLab])

  const getSetting = (key: string) => {
    const storeVal = appSettings[key]
    if (storeVal !== undefined && storeVal !== null && storeVal !== '') return storeVal
    return localConfig[key]
  }

  const handleOpenGlobalConfig = () => {
    setConfigForm({
      cardFee: getSetting('global_card_fee') || '0',
      commission: getSetting('global_commission') || '0',
      inadimplency: getSetting('global_inadimplency') || '0',
      taxes: getSetting('global_taxes') || '0',
    })
    setGlobalConfigOpen(true)
  }

  const handleSaveGlobalConfig = async () => {
    const updates = {
      global_card_fee: configForm.cardFee || '0',
      global_commission: configForm.commission || '0',
      global_inadimplency: configForm.inadimplency || '0',
      global_taxes: configForm.taxes || '0',
    }

    await updateSettings(updates)

    setLocalConfig((prev) => ({ ...prev, ...updates }))

    toast({ title: 'Taxas globais salvas com sucesso!' })
    setGlobalConfigOpen(false)
  }

  const handleNew = () => {
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
      stages: [],
    })
    setModalOpen(true)
  }

  const handleEdit = (item: any) => {
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
      stages: (item.price_stages || []).map((s: any) => ({
        name: s.name,
        price: String(s.price),
        kanban_stage: s.kanban_stage,
      })),
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.work_type || !formData.price) {
      return toast({ title: 'Preencha os campos obrigatórios.', variant: 'destructive' })
    }

    const execTimeForSave = parseFloat(String(formData.execution_time).replace(',', '.')) || 0
    const calculatedFixedCost = execTimeForSave * modalCosts.costPerMinute

    const payload = {
      work_type: formData.work_type,
      category: formData.category,
      material: formData.material,
      price: formData.price,
      sector: formData.sector,
      execution_time: execTimeForSave,
      cadista_cost: parseFloat(String(formData.cadista_cost).replace(',', '.')) || 0,
      material_cost: parseFloat(String(formData.material_cost).replace(',', '.')) || 0,
      fixed_cost: calculatedFixedCost,
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
        price: parseFloat(String(s.price).replace(',', '.')) || 0,
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
  }

  const handleModalCostsFetched = useCallback(
    (costs: { totalFixedCosts: number; totalHourlyCost: number; costPerMinute: number }) => {
      setModalCosts(costs)
    },
    [],
  )

  const priceNum = parseFloat(String(formData.price).replace(',', '.')) || 0
  const execTime = parseFloat(String(formData.execution_time).replace(',', '.')) || 0
  const cadistaVal = parseFloat(String(formData.cadista_cost).replace(',', '.')) || 0
  const materialVal = parseFloat(String(formData.material_cost).replace(',', '.')) || 0

  const globalCardFee =
    parseFloat(String(getSetting('global_card_fee') || '0').replace(',', '.')) || 0
  const globalCommission =
    parseFloat(String(getSetting('global_commission') || '0').replace(',', '.')) || 0
  const globalInadimplency =
    parseFloat(String(getSetting('global_inadimplency') || '0').replace(',', '.')) || 0
  const globalTaxes = parseFloat(String(getSetting('global_taxes') || '0').replace(',', '.')) || 0

  const fixedCost = execTime * modalCosts.costPerMinute
  const fixedCostPerc = priceNum > 0 ? (fixedCost / priceNum) * 100 : 0
  const materialCostPerc = priceNum > 0 ? (materialVal / priceNum) * 100 : 0

  const cardFeeVal = priceNum * (globalCardFee / 100)
  const commissionVal = priceNum * (globalCommission / 100)
  const inadimplencyVal = priceNum * (globalInadimplency / 100)
  const taxesVal = priceNum * (globalTaxes / 100)

  const totalCosts =
    fixedCost + cardFeeVal + commissionVal + inadimplencyVal + taxesVal + cadistaVal + materialVal
  const profitVal = priceNum - totalCosts
  const profitMargin = priceNum > 0 ? (profitVal / priceNum) * 100 : 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
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
          <Button variant="outline" onClick={handleOpenGlobalConfig}>
            <Settings className="w-4 h-4 mr-2" /> Taxas Globais
          </Button>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link to="/hourly-cost">
              <Calculator className="w-4 h-4 mr-2" /> Custo Hora
            </Link>
          </Button>
          <Button onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" /> Novo Procedimento
          </Button>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Procedimento</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className="text-right">Valor Venda Final</TableHead>
                <TableHead className="text-right">Tempo Exec.</TableHead>
                <TableHead className="text-right">Custo / Min</TableHead>
                <TableHead className="text-right">Custo Fixo Est.</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
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
                    Nenhum procedimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6">
                      <div className="font-medium">{item.work_type}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.category}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50">
                        {item.sector || 'Geral'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">R$ {item.price}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.execution_time ? `${item.execution_time} min` : '-'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-medium">
                      {formatBRL(tableCosts.costPerMinute)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatBRL((item.execution_time || 0) * tableCosts.costPerMinute)}
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
              Estas taxas em % serão aplicadas automaticamente na análise de rentabilidade de todos
              os procedimentos sobre o Valor de Venda Final.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Taxa de Cartão (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={configForm.cardFee}
                  onChange={(e) => setConfigForm({ ...configForm, cardFee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Comissões (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={configForm.commission}
                  onChange={(e) => setConfigForm({ ...configForm, commission: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Inadimplência (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={configForm.inadimplency}
                  onChange={(e) => setConfigForm({ ...configForm, inadimplency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Impostos (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={configForm.taxes}
                  onChange={(e) => setConfigForm({ ...configForm, taxes: e.target.value })}
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

          {modalOpen && <HourlyCostDashboard onFetched={handleModalCostsFetched} />}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-4 max-h-[55vh] overflow-y-auto px-1 pr-3 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome do Procedimento *</Label>
                  <Input
                    value={formData.work_type}
                    onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
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
                    onValueChange={(v) => setFormData({ ...formData, sector: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soluções Cerâmicas">Soluções Cerâmicas</SelectItem>
                      <SelectItem value="Studio Acrílico">Studio Acrílico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valor de Venda Final (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={formData.price}
                    className="font-semibold"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tempo de Execução (minutos)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 45"
                    value={formData.execution_time}
                    onChange={(e) => setFormData({ ...formData, execution_time: e.target.value })}
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
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cadista_cost}
                    onChange={(e) => setFormData({ ...formData, cadista_cost: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custo de Material (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.material_cost}
                    onChange={(e) => setFormData({ ...formData, material_cost: e.target.value })}
                  />
                </div>
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
                      <Label className="text-xs">Descrição</Label>
                      <Input
                        size="sm"
                        value={stage.name}
                        onChange={(e) => updateStage(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Valor (R$)</Label>
                      <Input
                        size="sm"
                        value={stage.price}
                        onChange={(e) => updateStage(idx, 'price', e.target.value)}
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
                        setFormData((p) => ({ ...p, stages: p.stages.filter((_, i) => i !== idx) }))
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
                    'mt-6 p-4 rounded-lg border flex items-center justify-between transition-colors',
                    profitVal > 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400'
                      : profitVal < 0
                        ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'
                        : 'bg-muted',
                  )}
                >
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">
                      Lucro Líquido Estimado
                    </p>
                    <p className="text-2xl font-bold">{formatBRL(profitVal)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">
                      Margem
                    </p>
                    <p className="text-xl font-bold flex items-center justify-end gap-1">
                      {profitVal > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : profitVal < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : null}
                      {profitMargin.toFixed(1)}%
                    </p>
                  </div>
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
  )
}
