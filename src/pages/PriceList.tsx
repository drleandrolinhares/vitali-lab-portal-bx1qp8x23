import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { toast } from '@/hooks/use-toast'
import { Plus, Edit2, Trash2, DollarSign, X } from 'lucide-react'

type PriceStage = {
  id: string
  name: string
  price: number
  kanban_stage: string
}

type PriceItem = {
  id: string
  category: string
  work_type: string
  price: string
  notes: string | null
  price_stages?: PriceStage[]
}

const CATEGORIES = ['Soluções Cerâmicas', 'Studio Acrílico']

export default function PriceList() {
  const { currentUser, kanbanStages } = useAppStore()
  const isAdmin = currentUser?.role === 'admin'

  const [items, setItems] = useState<PriceItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ category: '', work_type: '', price: '', notes: '' })
  const [stages, setStages] = useState<
    { id?: string; name: string; price: string; kanban_stage: string }[]
  >([])

  const fetchItems = async () => {
    const { data } = await supabase
      .from('price_list' as any)
      .select('*, price_stages(*)')
      .order('created_at', { ascending: true })
    if (data) setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openModal = (category: string, item?: PriceItem) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        category: item.category,
        work_type: item.work_type,
        price: item.price,
        notes: item.notes || '',
      })
      setStages(
        (item.price_stages || []).map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price.toFixed(2).replace('.', ','),
          kanban_stage: s.kanban_stage,
        })),
      )
    } else {
      setEditingId(null)
      setFormData({ category, work_type: '', price: '', notes: '' })
      setStages([])
    }
    setIsOpen(true)
  }

  const addStage = () =>
    setStages([...stages, { name: '', price: '', kanban_stage: kanbanStages[0]?.name || '' }])

  const updateStage = (index: number, field: string, value: string) => {
    const newStages = [...stages]
    newStages[index] = { ...newStages[index], [field]: value }
    setStages(newStages)
  }

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!formData.work_type || !formData.price) {
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
    }

    for (const s of stages) {
      if (!s.name || !s.price || !s.kanban_stage) {
        return toast({ title: 'Preencha todos os campos das etapas', variant: 'destructive' })
      }
    }

    const totalStr = formData.price.replace(/[^0-9,-]+/g, '').replace(',', '.')
    const totalNum = Number(totalStr)
    const sumStages = stages.reduce(
      (acc, s) => acc + Number(s.price.replace(/[^0-9,-]+/g, '').replace(',', '.')),
      0,
    )

    if (stages.length > 0 && Math.abs(totalNum - sumStages) > 0.01) {
      return toast({
        title: 'Atenção: A soma das etapas não corresponde ao Valor Total',
        description: `Soma: R$ ${sumStages.toFixed(2).replace('.', ',')} vs Total: R$ ${totalNum.toFixed(2).replace('.', ',')}`,
        variant: 'destructive',
      })
    }

    const payload = {
      category: formData.category,
      work_type: formData.work_type,
      price: formData.price,
      notes: formData.notes || null,
    }
    let currentId = editingId

    if (editingId) {
      const { error } = await supabase
        .from('price_list' as any)
        .update(payload)
        .eq('id', editingId)
      if (error) return toast({ title: 'Erro ao salvar alterações', variant: 'destructive' })
      await supabase
        .from('price_stages' as any)
        .delete()
        .eq('price_list_id', editingId)
    } else {
      const { data, error } = await supabase
        .from('price_list' as any)
        .insert([payload])
        .select()
        .single()
      if (error || !data) return toast({ title: 'Erro ao adicionar item', variant: 'destructive' })
      currentId = data.id
    }

    if (stages.length > 0 && currentId) {
      const stagesPayload = stages.map((s) => ({
        price_list_id: currentId,
        name: s.name,
        price: Number(s.price.replace(/[^0-9,-]+/g, '').replace(',', '.')),
        kanban_stage: s.kanban_stage,
      }))
      const { error: errStages } = await supabase.from('price_stages' as any).insert(stagesPayload)
      if (errStages) return toast({ title: 'Erro ao salvar etapas', variant: 'destructive' })
    }

    toast({ title: 'Tabela atualizada com sucesso!' })
    setIsOpen(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return
    const { error } = await supabase
      .from('price_list' as any)
      .delete()
      .eq('id', id)
    if (error) return toast({ title: 'Erro ao excluir', variant: 'destructive' })
    toast({ title: 'Item excluído' })
    fetchItems()
  }

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Tabela de Preços</h2>
          <p className="text-muted-foreground text-sm">
            {isAdmin
              ? 'Gerencie os valores e etapas de cobrança dos trabalhos.'
              : 'Consulte os valores de nossos serviços.'}
          </p>
        </div>
      </div>

      {CATEGORIES.map((category) => {
        const categoryItems = items.filter((i) => i.category === category)
        return (
          <Card key={category} className="shadow-subtle border-t-4 border-t-primary/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
              <CardTitle className="text-lg font-semibold">{category}</CardTitle>
              {isAdmin && (
                <Button size="sm" onClick={() => openModal(category)}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Item
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Trabalho</TableHead>
                    <TableHead className="w-[20%]">Valor Total</TableHead>
                    <TableHead>Etapas Mapeadas</TableHead>
                    {isAdmin && <TableHead className="w-[100px] text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 4 : 3}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhum serviço cadastrado nesta categoria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoryItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-foreground">
                          {item.work_type}
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                              {item.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.price}
                        </TableCell>
                        <TableCell>
                          {item.price_stages && item.price_stages.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {item.price_stages.map((s, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center text-[10px] font-medium bg-muted px-2 py-0.5 rounded-full border"
                                >
                                  {s.name}: {formatBRL(s.price)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sem etapas</span>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => openModal(category, item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
            <p className="text-sm text-muted-foreground">Categoria: {formData.category}</p>
          </DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto pr-2 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="work_type">
                  Trabalho <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="work_type"
                  value={formData.work_type}
                  onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                  placeholder="Ex: Coroa Emax"
                  autoFocus
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="price">
                  Valor Total <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: R$ 350,00"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Informações importantes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações (opcional)"
                  className="resize-none min-h-[60px]"
                />
              </div>
            </div>

            <div className="pt-4 border-t mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Etapas de Cobrança</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Divida o valor por fases do Kanban.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addStage}>
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {stages.map((st, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start bg-muted/40 p-3 rounded-lg border border-border/50"
                  >
                    <div className="grid gap-3 flex-1">
                      <Input
                        placeholder="Nome da Etapa (ex: Design CAD)"
                        value={st.name}
                        onChange={(e) => updateStage(i, 'name', e.target.value)}
                        className="h-8 text-sm bg-background"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 items-start">
                        <Input
                          placeholder="Valor (ex: 100,00)"
                          value={st.price}
                          onChange={(e) => updateStage(i, 'price', e.target.value)}
                          className="h-8 text-sm sm:w-1/3 bg-background"
                        />
                        <div className="flex-1 w-full space-y-1">
                          <Select
                            value={st.kanban_stage}
                            onValueChange={(v) => updateStage(i, 'kanban_stage', v)}
                          >
                            <SelectTrigger className="h-8 text-sm bg-background">
                              <SelectValue placeholder="Gatilho: Fase do Kanban" />
                            </SelectTrigger>
                            <SelectContent>
                              {kanbanStages.map((k) => (
                                <SelectItem key={k.id} value={k.name}>
                                  {k.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground italic pl-1 text-amber-600 dark:text-amber-500 font-medium">
                            * Valor cobrado ao sair do bloco selecionado
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive shrink-0 mt-8"
                      onClick={() => removeStage(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {stages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                    Nenhuma etapa cadastrada. O valor será considerado integralmente ao finalizar o
                    pedido.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Salvar Alterações' : 'Adicionar Serviço'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
