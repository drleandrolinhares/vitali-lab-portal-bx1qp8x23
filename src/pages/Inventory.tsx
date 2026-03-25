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
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'
import { Package, Plus, ArrowUpRight, ArrowDownRight, Trash2, X, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const formatQty = (q: any) => {
  const num = Number(q)
  if (isNaN(num)) return '0'
  return num % 1 === 0 ? num.toString() : num.toFixed(2)
}

export default function Inventory() {
  const { selectedLab, currentUser, logAudit } = useAppStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [productModal, setProductModal] = useState<{
    open: boolean
    mode: 'create' | 'view' | 'in'
    item: any | null
  }>({ open: false, mode: 'create', item: null })

  const [formData, setFormData] = useState({
    name: '',
    purchase_cost: '',
    packagingTypes: [''],
    items_per_box: '1',
    usage_factor: '1',
    minimum_stock_level: '0',
    storage_location: '',
    initial_quantity: '',
    last_purchase_brand: '',
    last_purchase_value: '',
    observations: '',
  })

  const [baixaModal, setBaixaModal] = useState<{ open: boolean; item: any | null }>({
    open: false,
    item: null,
  })
  const [baixaData, setBaixaData] = useState<{ qty: string; type: 'box' | 'item' }>({
    qty: '',
    type: 'box',
  })

  const fetchItems = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*, inventory_transactions(*)')
        .order('name')

      if (error) throw error

      if (data) {
        const processedItems = data.map((item) => {
          const calculatedQty = (item.inventory_transactions || []).reduce(
            (acc: number, t: any) => {
              if (t.type === 'in') return acc + Number(t.quantity)
              if (t.type === 'out') return acc - Number(t.quantity)
              return acc
            },
            0,
          )
          return { ...item, quantity: calculatedQty }
        })
        setItems(processedItems)
      }
    } catch (err: any) {
      console.error('Fetch inventory error:', err)
      setFetchError(err.message || 'Falha de comunicação. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(
      (i) =>
        !selectedLab ||
        selectedLab.toUpperCase() === 'TODOS' ||
        (i.sector || '').toUpperCase() === selectedLab.toUpperCase(),
    )
  }, [items, selectedLab])

  const openModal = (mode: 'create' | 'view' | 'in', item?: any) => {
    if (item) {
      let initialPackaging: string[] = []
      if (item.packaging_types && item.packaging_types.length > 0) {
        initialPackaging = [...item.packaging_types]
      } else if (item.packaging_type) {
        initialPackaging = [item.packaging_type]
      }

      if (mode !== 'view') {
        initialPackaging.push('')
      } else if (initialPackaging.length === 0) {
        initialPackaging = ['-']
      }

      setFormData({
        name: item.name,
        purchase_cost: String(item.purchase_cost || ''),
        packagingTypes: initialPackaging,
        items_per_box: String(item.items_per_box || '1'),
        usage_factor: String(item.usage_factor || '1'),
        minimum_stock_level: String(item.minimum_stock_level || '0'),
        storage_location: item.storage_location || '',
        initial_quantity: '',
        last_purchase_brand: item.last_purchase_brand || '',
        last_purchase_value: String(item.last_purchase_value || ''),
        observations: item.observations || '',
      })
    } else {
      setFormData({
        name: '',
        purchase_cost: '',
        packagingTypes: [''],
        items_per_box: '1',
        usage_factor: '1',
        minimum_stock_level: '0',
        storage_location: '',
        initial_quantity: '',
        last_purchase_brand: '',
        last_purchase_value: '',
        observations: '',
      })
    }
    setProductModal({ open: true, mode, item: item || null })
  }

  const handlePackagingChange = (index: number, value: string) => {
    if (productModal.mode === 'view') return
    const newTypes = [...formData.packagingTypes]
    newTypes[index] = value
    if (index === newTypes.length - 1 && value.trim() !== '') {
      newTypes.push('')
    }
    setFormData({ ...formData, packagingTypes: newTypes })
  }

  const removePackaging = (index: number) => {
    if (productModal.mode === 'view') return
    const newTypes = formData.packagingTypes.filter((_, i) => i !== index)
    if (newTypes.length === 0) newTypes.push('')
    setFormData({ ...formData, packagingTypes: newTypes })
  }

  const costVal = Number(formData.purchase_cost.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0
  const yieldProd = Number(formData.usage_factor) || 1
  const unitProdCost = yieldProd > 0 ? costVal / yieldProd : 0
  const qtyBought = Number(formData.initial_quantity) || 0
  const totalCost = costVal * qtyBought

  const handleSaveProduct = async () => {
    if (productModal.mode === 'view') return

    if (!formData.name || !formData.purchase_cost || !formData.usage_factor)
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })

    if (productModal.mode === 'in' && qtyBought <= 0) {
      return toast({
        title: 'Quantidade Inválida',
        description: 'Informe a quantidade comprada para registrar a entrada.',
        variant: 'destructive',
      })
    }

    const packTypes = formData.packagingTypes.filter((t) => t.trim() !== '' && t !== '-')

    const payload = {
      name: formData.name,
      purchase_cost: costVal,
      unit_price: unitProdCost,
      packaging_types: packTypes,
      items_per_box: Number(formData.items_per_box) || 1,
      usage_factor: yieldProd,
      minimum_stock_level: Number(formData.minimum_stock_level) || 0,
      storage_location: formData.storage_location,
      last_purchase_brand: formData.last_purchase_brand,
      last_purchase_value:
        Number(formData.last_purchase_value.replace(/[^0-9,-]+/g, '').replace(',', '.')) || null,
      observations: formData.observations,
      sector:
        !selectedLab || selectedLab.toUpperCase() === 'TODOS'
          ? 'SOLUÇÕES CERÂMICAS'
          : selectedLab.toUpperCase(),
    }

    if (productModal.mode === 'create') {
      const { data: insertedItem, error } = await supabase
        .from('inventory_items' as any)
        .insert({ ...payload, quantity: 0 })
        .select()
        .single()

      if (error)
        return toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' })

      if (qtyBought > 0 && insertedItem) {
        await supabase.from('inventory_transactions').insert({
          item_id: insertedItem.id,
          type: 'in',
          quantity: qtyBought,
        })
      }
      toast({ title: 'Produto cadastrado!' })
    } else if (productModal.mode === 'in') {
      const { error } = await supabase
        .from('inventory_items' as any)
        .update(payload)
        .eq('id', productModal.item.id)

      if (error)
        return toast({
          title: 'Erro ao atualizar',
          description: error.message,
          variant: 'destructive',
        })

      if (qtyBought > 0) {
        await supabase.from('inventory_transactions').insert({
          item_id: productModal.item.id,
          type: 'in',
          quantity: qtyBought,
        })
      }
      toast({ title: 'Entrada registrada e produto atualizado!' })
    }

    setProductModal({ open: false, mode: 'create', item: null })
    fetchItems()
  }

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${item.name}" definitivamente?`))
      return

    const { error } = await supabase.from('inventory_items').delete().eq('id', item.id)
    if (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o item. Verifique se possui transações.',
        variant: 'destructive',
      })
    } else {
      await logAudit('DELETE_INVENTORY_ITEM', 'inventory_items', item.id, { name: item.name })
      toast({ title: 'Produto excluído com sucesso' })
      fetchItems()
    }
  }

  const handleBaixa = async () => {
    if (!baixaData.qty || !baixaModal.item) return
    let qty = Number(baixaData.qty)
    if (qty <= 0) return toast({ title: 'Quantidade inválida' })

    let effectiveQty = qty
    if (baixaData.type === 'item') {
      const itemsPerBox = Number(baixaModal.item.items_per_box) || 1
      effectiveQty = qty / itemsPerBox
    }

    if (effectiveQty > baixaModal.item.quantity) {
      return toast({ title: 'Estoque insuficiente', variant: 'destructive' })
    }

    const { error } = await supabase.from('inventory_transactions').insert({
      item_id: baixaModal.item.id,
      type: 'out',
      quantity: effectiveQty,
    })

    if (error) toast({ title: 'Erro ao registrar', variant: 'destructive' })
    else {
      toast({ title: 'Baixa registrada com sucesso' })
      setBaixaModal({ open: false, item: null })
      setBaixaData({ qty: '', type: 'box' })
      fetchItems()
    }
  }

  const totalCapital = useMemo(
    () =>
      filteredItems.reduce(
        (acc, item) => acc + Number(item.purchase_cost || 0) * Number(item.quantity),
        0,
      ),
    [filteredItems],
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl dark:bg-blue-900/30">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Controle de Estoque</h2>
            <p className="text-muted-foreground text-sm">
              Gerencie embalagens, custos e rendimentos detalhados.
            </p>
          </div>
        </div>
        <Button onClick={() => openModal('create')}>
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
                <TableHead>Embalagem & Itens</TableHead>
                <TableHead>Custo Emb. Fechada</TableHead>
                <TableHead>Custo Unit. Prod.</TableHead>
                <TableHead className="text-center">Qtd. Atual</TableHead>
                <TableHead className="text-right">Capital Retido</TableHead>
                <TableHead className="text-right pr-6">Ações Rápidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Carregando estoque...
                  </TableCell>
                </TableRow>
              ) : fetchError ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <p className="text-destructive font-medium">{fetchError}</p>
                      <Button variant="outline" size="sm" onClick={fetchItems}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhum produto encontrado para este setor.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const pTypes =
                    item.packaging_types && item.packaging_types.length > 0
                      ? item.packaging_types
                      : item.packaging_type
                        ? [item.packaging_type]
                        : []

                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.actions-col')) return
                        openModal('view', item)
                      }}
                    >
                      <TableCell className="pl-6 font-medium">
                        <div className="font-semibold text-primary">{item.name}</div>
                        {item.storage_location && (
                          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center">
                            <Package className="w-3 h-3 mr-1 inline opacity-60" />{' '}
                            {item.storage_location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {pTypes.map((t: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] py-0 h-4 px-1.5"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                          {item.items_per_box} item(s) / caixa
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Rende: {item.usage_factor} un
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatBRL(Number(item.purchase_cost || 0))}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatBRL(Number(item.unit_price))}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold px-2 py-1 rounded-md ${Number(item.quantity) < Number(item.minimum_stock_level || 0) ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-muted'}`}
                        >
                          {formatQty(item.quantity)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-muted-foreground">
                        {formatBRL(Number(item.purchase_cost || 0) * Number(item.quantity))}
                      </TableCell>
                      <TableCell
                        className="text-right pr-6 actions-col"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {currentUser?.role === 'admin' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item)
                              }}
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              openModal('in', item)
                            }}
                          >
                            <ArrowUpRight className="w-3 h-3 mr-1" /> Entrada
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              setBaixaModal({ open: true, item })
                            }}
                          >
                            <ArrowDownRight className="w-3 h-3 mr-1" /> Baixa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={productModal.open}
        onOpenChange={(o) => !o && setProductModal({ ...productModal, open: false })}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {productModal.mode === 'create'
                ? 'Novo Produto no Estoque'
                : productModal.mode === 'in'
                  ? 'Registrar Nova Entrada'
                  : 'Detalhes do Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="col-span-2 space-y-2">
              <Label>Nome do Material</Label>
              <Input
                placeholder="Ex: Resina A2"
                value={formData.name}
                readOnly={productModal.mode !== 'create'}
                className={cn(productModal.mode !== 'create' && 'bg-muted opacity-80')}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Custo da Embalagem Fechada (R$)</Label>
              <Input
                placeholder="0,00"
                value={formData.purchase_cost}
                readOnly={productModal.mode === 'view'}
                className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Local de Armazenamento</Label>
              <Input
                placeholder="Ex: Sala 1 - Armário A"
                value={formData.storage_location}
                readOnly={productModal.mode === 'view'}
                className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
              />
            </div>

            <div className="col-span-2 mt-2 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 col-span-2">
                  <Label>Tipos de Embalagem</Label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {formData.packagingTypes.map((type, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <Input
                          className={cn(
                            'w-36',
                            productModal.mode === 'view' && 'bg-muted opacity-80',
                          )}
                          placeholder={
                            idx === formData.packagingTypes.length - 1 &&
                            productModal.mode !== 'view'
                              ? 'Nova embalagem...'
                              : 'Ex: Frasco'
                          }
                          value={type}
                          readOnly={productModal.mode === 'view'}
                          onChange={(e) => handlePackagingChange(idx, e.target.value)}
                        />
                        {idx < formData.packagingTypes.length - 1 &&
                          productModal.mode !== 'view' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => removePackaging(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                      </div>
                    ))}
                  </div>
                  {productModal.mode !== 'view' && (
                    <p className="text-xs text-muted-foreground">
                      Preencha o último campo para adicionar um novo tipo automaticamente.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quantidade de Itens na Caixa</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Ex: 5"
                    value={formData.items_per_box}
                    readOnly={productModal.mode === 'view'}
                    className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                    onChange={(e) => setFormData({ ...formData, items_per_box: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rendimento de Produção</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Ex: 50 coroas"
                    value={formData.usage_factor}
                    readOnly={productModal.mode === 'view'}
                    className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                    onChange={(e) => setFormData({ ...formData, usage_factor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque Mínimo (Aviso)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 5"
                    value={formData.minimum_stock_level}
                    readOnly={productModal.mode === 'view'}
                    className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_stock_level: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custo Unitário de Produção</Label>
                  <Input
                    readOnly
                    className="bg-emerald-50 dark:bg-emerald-900/10 font-semibold text-emerald-700 dark:text-emerald-400"
                    value={formatBRL(unitProdCost)}
                  />
                </div>
              </div>
            </div>

            {productModal.mode !== 'view' && (
              <>
                <div className="col-span-2 mt-2 pt-2 border-t border-border" />
                <div className="space-y-2">
                  <Label className="text-blue-600 dark:text-blue-400">
                    {productModal.mode === 'create'
                      ? 'Qtd. Comprada (Inicial em Caixas)'
                      : 'Qtd. Comprada (Nova Entrada)'}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 10"
                    value={formData.initial_quantity}
                    onChange={(e) => setFormData({ ...formData, initial_quantity: e.target.value })}
                    className="border-blue-200 dark:border-blue-900/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custo Total da Compra Atual</Label>
                  <Input readOnly className="bg-muted font-semibold" value={formatBRL(totalCost)} />
                </div>
              </>
            )}

            <div className="col-span-2 mt-4 pt-4 border-t border-border">
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Detalhes da Compra & Histórico (Opcional)
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Marca da última compra</Label>
              <Input
                placeholder="Ex: 3M, Ivoclar..."
                value={formData.last_purchase_brand}
                readOnly={productModal.mode === 'view'}
                className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                onChange={(e) => setFormData({ ...formData, last_purchase_brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor da última compra (R$)</Label>
              <Input
                placeholder="0,00"
                value={formData.last_purchase_value}
                readOnly={productModal.mode === 'view'}
                className={cn(productModal.mode === 'view' && 'bg-muted opacity-80')}
                onChange={(e) => setFormData({ ...formData, last_purchase_value: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Observações</Label>
              <Textarea
                placeholder="Adicione notas, links de fornecedores ou detalhes..."
                className={cn(
                  'min-h-[80px]',
                  productModal.mode === 'view' && 'bg-muted opacity-80',
                )}
                value={formData.observations}
                readOnly={productModal.mode === 'view'}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            {productModal.mode === 'view' ? (
              <Button
                variant="outline"
                onClick={() => setProductModal({ ...productModal, open: false })}
              >
                Fechar Detalhes
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setProductModal({ ...productModal, open: false })}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct}>
                  {productModal.mode === 'create' ? 'Cadastrar Produto' : 'Salvar Entrada'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={baixaModal.open}
        onOpenChange={(o) => !o && setBaixaModal({ ...baixaModal, open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Baixa (Consumo)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-md mb-4 flex justify-between items-center border border-border">
              <div>
                <p className="text-sm font-semibold">{baixaModal.item?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Itens por caixa: {baixaModal.item?.items_per_box}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estoque Atual</p>
                <p className="text-sm font-bold text-primary">
                  {formatQty(baixaModal.item?.quantity)} embalagens
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label>Quantidade a Baixar</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ex: 1"
                  value={baixaData.qty}
                  onChange={(e) => setBaixaData({ ...baixaData, qty: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Unidade de Medida</Label>
                <Select
                  value={baixaData.type}
                  onValueChange={(v) => setBaixaData({ ...baixaData, type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Embalagem Fechada</SelectItem>
                    <SelectItem value="item">Unidade/Item (Avulso)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {baixaData.type === 'item' && Number(baixaData.qty) > 0 && (
              <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-900/50 mt-4">
                Será deduzido{' '}
                <strong className="font-bold">
                  {(Number(baixaData.qty) / (Number(baixaModal.item?.items_per_box) || 1)).toFixed(
                    2,
                  )}
                </strong>{' '}
                embalagem(s) do estoque atual.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBaixaModal({ open: false, item: null })}>
              Cancelar
            </Button>
            <Button onClick={handleBaixa} variant="destructive">
              Confirmar Baixa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
