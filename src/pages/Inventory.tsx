import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Package, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function Inventory() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [productModal, setProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', unit_price: '' })

  const [transactionModal, setTransactionModal] = useState<{
    open: boolean
    type: 'in' | 'out'
    item: any | null
  }>({ open: false, type: 'in', item: null })
  const [transQuantity, setTransQuantity] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('inventory_items').select('*').order('name')
    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.unit_price)
      return toast({ title: 'Preencha todos os campos' })
    const { error } = await supabase.from('inventory_items').insert({
      name: newProduct.name,
      unit_price: Number(newProduct.unit_price.replace(/[^0-9,-]+/g, '').replace(',', '.')),
      quantity: 0,
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Produto cadastrado!' })
      setProductModal(false)
      setNewProduct({ name: '', unit_price: '' })
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
    () => items.reduce((acc, item) => acc + Number(item.unit_price) * Number(item.quantity), 0),
    [items],
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
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
                <TableHead className="pl-6">Produto / Material</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead className="text-center">Qtd. Atual</TableHead>
                <TableHead className="text-right">Capital Retido</TableHead>
                <TableHead className="text-right pr-6">Ações Rápidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-medium">{item.name}</TableCell>
                    <TableCell>{formatBRL(Number(item.unit_price))}</TableCell>
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
                      <div className="flex justify-end gap-2">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Produto no Estoque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Material</Label>
              <Input
                placeholder="Ex: Resina A2 4g"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Custo Unitário (R$)</Label>
              <Input
                placeholder="0,00"
                value={newProduct.unit_price}
                onChange={(e) => setNewProduct({ ...newProduct, unit_price: e.target.value })}
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
