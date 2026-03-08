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
import { Textarea } from '@/components/ui/textarea'
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
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'
import { Package, Plus, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react'

export default function Inventory() {
  const { selectedLab, currentUser, logAudit } = useAppStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [productModal, setProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    purchase_cost: '',
    packaging_type: 'Frasco',
    usage_factor: '1',
    storage_location: '',
    initial_quantity: '',
    last_purchase_brand: '',
    last_purchase_value: '',
    observations: '',
  })

  const [transactionModal, setTransactionModal] = useState<{
    open: boolean
    type: 'in' | 'out'
    item: any | null
  }>({ open: false, type: 'in', item: null })
  const [transQuantity, setTransQuantity] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('inventory_items')
      .select('*, inventory_transactions(*)')
      .order('name')
    if (data) {
      const processedItems = data.map((item) => {
        const calculatedQty = (item.inventory_transactions || []).reduce((acc: number, t: any) => {
          if (t.type === 'in') return acc + t.quantity
          if (t.type === 'out') return acc - t.quantity
          return acc
        }, 0)
        return { ...item, quantity: calculatedQty }
      })
      setItems(processedItems)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((i) => selectedLab === 'Todos' || i.sector === selectedLab)
  }, [items, selectedLab])

  const unitPrice = useMemo(() => {
    const cost = Number(newProduct.purchase_cost.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0
    const factor = Number(newProduct.usage_factor) || 1
    return factor > 0 ? cost / factor : 0
  }, [newProduct.purchase_cost, newProduct.usage_factor])

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.purchase_cost || !newProduct.usage_factor)
      return toast({ title: 'Preencha os campos obrigatórios' })

    const { data: insertedItem, error } = await supabase
      .from('inventory_items' as any)
      .insert({
        name: newProduct.name,
        unit_price: unitPrice,
        quantity: 0,
        sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
        purchase_cost: Number(newProduct.purchase_cost.replace(/[^0-9,-]+/g, '').replace(',', '.')),
        packaging_type: newProduct.packaging_type,
        usage_factor: Number(newProduct.usage_factor),
        storage_location: newProduct.storage_location,
        last_purchase_brand: newProduct.last_purchase_brand,
        last_purchase_value:
          Number(newProduct.last_purchase_value.replace(/[^0-9,-]+/g, '').replace(',', '.')) ||
          null,
        observations: newProduct.observations,
      })
      .select()
      .single()

    if (error) {
      return toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }

    const initQty = parseInt(newProduct.initial_quantity) || 0
    if (initQty > 0 && insertedItem) {
      await supabase.from('inventory_transactions').insert({
        item_id: insertedItem.id,
        type: 'in',
        quantity: initQty,
      })
    }

    toast({ title: 'Produto cadastrado!' })
    setProductModal(false)
    setNewProduct({
      name: '',
      purchase_cost: '',
      packaging_type: 'Frasco',
      usage_factor: '1',
      storage_location: '',
      initial_quantity: '',
      last_purchase_brand: '',
      last_purchase_value: '',
      observations: '',
    })
    fetchItems()
  }

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${item.name}" definitivamente?`))
      return

    const { error } = await supabase.from('inventory_items').delete().eq('id', item.id)
    if (error) {
      toast({
        title: 'Erro ao excluir',
        description:
          'Não foi possível excluir o item. Verifique se ele possui transações vinculadas.',
        variant: 'destructive',
      })
    } else {
      await logAudit('DELETE_INVENTORY_ITEM', 'inventory_items', item.id, { name: item.name })
      toast({ title: 'Produto excluído com sucesso' })
      fetchItems()
    }
  }

  const handleTransaction = async () => {
    if (!transQuantity || !transactionModal.item) return
    const qty = parseInt(transQuantity)
    if (qty <= 0) return toast({ title: 'Quantidade inválida' })
    if (transactionModal.type === 'out' && qty > transactionModal.item.quantity) {
      return toast({ title: 'Estoque insuficiente', variant: 'destructive' })
    }

    const { error } = await supabase.from('inventory_transactions').insert({
      item_id: transactionModal.item.id,
      type: transactionModal.type,
      quantity: qty,
    })

    if (error) toast({ title: 'Erro ao registrar', variant: 'destructive' })
    else {
      toast({ title: transactionModal.type === 'in' ? 'Entrada registrada' : 'Baixa registrada' })
      setTransactionModal({ open: false, type: 'in', item: null })
      setTransQuantity('')
      fetchItems()
    }
  }

  const totalCapital = useMemo(
    () =>
      filteredItems.reduce((acc, item) => acc + Number(item.unit_price) * Number(item.quantity), 0),
    [filteredItems],
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl dark:bg-blue-900/30">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Controle de Estoque</h2>
            <p className="text-muted-foreground text-sm">
              Gerencie materiais e capital imobilizado.
            </p>
          </div>
        </div>
        <Button onClick={() => setProductModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <Card className="shadow-subtle border-l-4 border-l-blue-500 w-full md:w-1/3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Capital Investido (Ocioso)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{formatBRL(totalCapital)}</div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Produto / Local</TableHead>
                <TableHead>Embalagem</TableHead>
                <TableHead>Custo Aquis.</TableHead>
                <TableHead>Custo Unit.</TableHead>
                <TableHead className="text-center">Qtd. Atual</TableHead>
                <TableHead className="text-right">Capital Retido</TableHead>
                <TableHead className="text-right pr-6">Ações Rápidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-medium">
                      <div>{item.name}</div>
                      {item.storage_location && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Local: {item.storage_location}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{item.packaging_type || '-'}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Rende: {item.usage_factor} un
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBRL(Number(item.purchase_cost || 0))}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatBRL(Number(item.unit_price))}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-bold px-2 py-1 rounded-md ${item.quantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-muted'}`}
                      >
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-muted-foreground">
                      {formatBRL(Number(item.unit_price) * Number(item.quantity))}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {currentUser?.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(item)}
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => setTransactionModal({ open: true, type: 'in', item })}
                        >
                          <ArrowUpRight className="w-3 h-3 mr-1" /> Entrada
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => setTransactionModal({ open: true, type: 'out', item })}
                        >
                          <ArrowDownRight className="w-3 h-3 mr-1" /> Baixa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={productModal} onOpenChange={setProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Produto no Estoque</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="col-span-2 space-y-2">
              <Label>Nome do Material</Label>
              <Input
                placeholder="Ex: Resina A2"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Custo de Aquisição (R$)</Label>
              <Input
                placeholder="0,00"
                value={newProduct.purchase_cost}
                onChange={(e) => setNewProduct({ ...newProduct, purchase_cost: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Embalagem</Label>
              <Select
                value={newProduct.packaging_type}
                onValueChange={(v) => setNewProduct({ ...newProduct, packaging_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frasco">Frasco</SelectItem>
                  <SelectItem value="Caixa">Caixa</SelectItem>
                  <SelectItem value="Litro">Litro</SelectItem>
                  <SelectItem value="Galão">Galão</SelectItem>
                  <SelectItem value="Unidade">Unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rendimento (Qtd por Embalagem)</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 50"
                value={newProduct.usage_factor}
                onChange={(e) => setNewProduct({ ...newProduct, usage_factor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Custo Unitário (Calculado)</Label>
              <Input readOnly className="bg-muted font-semibold" value={formatBRL(unitPrice)} />
            </div>
            <div className="space-y-2">
              <Label>Qtd. Comprada (Inicial)</Label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 10"
                value={newProduct.initial_quantity}
                onChange={(e) => setNewProduct({ ...newProduct, initial_quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Local de Armazenamento</Label>
              <Input
                placeholder="Ex: Sala 1 - Armário A"
                value={newProduct.storage_location}
                onChange={(e) => setNewProduct({ ...newProduct, storage_location: e.target.value })}
              />
            </div>

            {/* Novas opções de registro */}
            <div className="col-span-2 mt-2 pt-4 border-t border-border">
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Detalhes da Compra & Histórico (Opcional)
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Marca da última compra</Label>
              <Input
                placeholder="Ex: 3M, Ivoclar..."
                value={newProduct.last_purchase_brand}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, last_purchase_brand: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Valor da última compra (R$)</Label>
              <Input
                placeholder="0,00"
                value={newProduct.last_purchase_value}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, last_purchase_value: e.target.value })
                }
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Observações</Label>
              <Textarea
                placeholder="Adicione notas, links de fornecedores ou detalhes específicos sobre o produto..."
                className="min-h-[80px]"
                value={newProduct.observations}
                onChange={(e) => setNewProduct({ ...newProduct, observations: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProduct}>Cadastrar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={transactionModal.open}
        onOpenChange={(o) => !o && setTransactionModal({ ...transactionModal, open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionModal.type === 'in' ? 'Registrar Entrada' : 'Registrar Baixa (Consumo)'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-md mb-4">
              <p className="text-sm font-semibold">{transactionModal.item?.name}</p>
              <p className="text-xs text-muted-foreground">
                Estoque atual: {transactionModal.item?.quantity} unidades
              </p>
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 5"
                value={transQuantity}
                onChange={(e) => setTransQuantity(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTransactionModal({ ...transactionModal, open: false })}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTransaction}
              variant={transactionModal.type === 'out' ? 'destructive' : 'default'}
            >
              Confirmar Transação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
