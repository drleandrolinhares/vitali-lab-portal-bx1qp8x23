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
import { toast } from '@/hooks/use-toast'
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react'

type PriceItem = {
  id: string
  category: string
  work_type: string
  price: string
  notes: string | null
}

const CATEGORIES = ['Soluções Cerâmicas', 'Studio Acrílico']

export default function PriceList() {
  const { currentUser } = useAppStore()
  const isAdmin = currentUser?.role === 'admin'

  const [items, setItems] = useState<PriceItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ category: '', work_type: '', price: '', notes: '' })

  const fetchItems = async () => {
    const { data } = await supabase
      .from('price_list' as any)
      .select('*')
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
    } else {
      setEditingId(null)
      setFormData({ category, work_type: '', price: '', notes: '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.work_type || !formData.price) {
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
    }

    const payload = { ...formData, notes: formData.notes || null }

    if (editingId) {
      const { error } = await supabase
        .from('price_list' as any)
        .update(payload)
        .eq('id', editingId)
      if (error) return toast({ title: 'Erro ao salvar alterações', variant: 'destructive' })
    } else {
      const { error } = await supabase.from('price_list' as any).insert([payload])
      if (error) return toast({ title: 'Erro ao adicionar item', variant: 'destructive' })
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
              ? 'Gerencie os valores e informações dos trabalhos oferecidos.'
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
                    <TableHead className="w-[20%]">Valor da etapa</TableHead>
                    <TableHead>Informações importantes</TableHead>
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
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.price}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {item.notes || '-'}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
            <p className="text-sm text-muted-foreground">Categoria: {formData.category}</p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="price">
                Valor da etapa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex: R$ 350,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Informações importantes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações sobre o serviço (opcional)"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingId ? 'Salvar Alterações' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
