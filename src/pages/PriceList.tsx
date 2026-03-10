import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { DollarSign, Plus, Trash2, Edit2, ListTree, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StageInput {
  name: string
  price: string
  kanban_stage: string
}

export default function PriceList() {
  const { selectedLab, kanbanStages } = useAppStore()
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    work_type: '',
    category: 'PROTESE FIXA',
    material: '',
    price: '',
    sector: 'Soluções Cerâmicas',
    stages: [] as StageInput[],
  })

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

  // Auto-calculate total price when stages change
  useEffect(() => {
    if (formData.stages.length > 0) {
      const total = formData.stages.reduce((sum, stage) => {
        const val = parseFloat(String(stage.price).replace(',', '.')) || 0
        return sum + val
      }, 0)
      setFormData((prev) => ({ ...prev, price: total.toFixed(2) }))
    }
  }, [formData.stages])

  const handleNew = () => {
    setFormData({
      id: '',
      work_type: '',
      category: 'PROTESE FIXA',
      material: '',
      price: '',
      sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
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

    const payload = {
      work_type: formData.work_type,
      category: formData.category,
      material: formData.material,
      price: formData.price,
      sector: formData.sector,
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
        price: parseFloat(s.price.replace(',', '.')) || 0,
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
              Gerencie os valores cobrados por procedimento.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link to="/hourly-cost">
              <Calculator className="w-4 h-4 mr-2" /> Precificação (Custo Hora)
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
                <TableHead>Categoria</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className="text-right">Valor Base</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhum procedimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6">
                      <div className="font-medium">{item.work_type}</div>
                      {item.price_stages && item.price_stages.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <ListTree className="w-3 h-3 mr-1" /> {item.price_stages.length} etapas
                          associadas
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.sector === 'Studio Acrílico'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {item.sector || 'Geral'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">R$ {item.price}</TableCell>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Procedimento' : 'Novo Procedimento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
                <Label>Material</Label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
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
            </div>

            <div className="space-y-4 mt-6 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">
                    Etapas de Faturamento (Opcional)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Divida o valor total por etapas do Kanban.
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

            <div className="space-y-2 mt-4">
              <Label>Valor Total (R$) *</Label>
              <Input
                placeholder="150.00"
                value={formData.price}
                readOnly={formData.stages.length > 0}
                className={
                  formData.stages.length > 0
                    ? 'bg-muted cursor-not-allowed font-semibold text-primary'
                    : ''
                }
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {formData.stages.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  O valor total é calculado automaticamente com base nas etapas.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
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
