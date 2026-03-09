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
import { DollarSign, Plus, Trash2 } from 'lucide-react'

export default function PriceList() {
  const { selectedLab } = useAppStore()
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    work_type: '',
    category: 'Prótese Fixa',
    material: '',
    price: '',
    sector: 'Soluções Cerâmicas',
  })

  const fetchPrices = async () => {
    setLoading(true)
    const { data } = await supabase.from('price_list').select('*').order('work_type')
    if (data) setPrices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  const filteredPrices = useMemo(() => {
    return prices.filter((p) => selectedLab === 'Todos' || p.sector === selectedLab)
  }, [prices, selectedLab])

  useEffect(() => {
    if (selectedLab !== 'Todos') {
      setFormData((prev) => ({ ...prev, sector: selectedLab }))
    }
  }, [selectedLab])

  const handleSave = async () => {
    if (!formData.work_type || !formData.price) {
      return toast({ title: 'Preencha os campos obrigatórios.', variant: 'destructive' })
    }

    const { error } = await supabase.from('price_list').insert({
      work_type: formData.work_type,
      category: formData.category,
      material: formData.material,
      price: formData.price,
      sector: formData.sector,
    })

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Procedimento registrado com sucesso!' })
      setModalOpen(false)
      setFormData({
        work_type: '',
        category: 'Prótese Fixa',
        material: '',
        price: '',
        sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
      })
      fetchPrices()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este procedimento?')) return
    const { error } = await supabase.from('price_list').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Procedimento excluído' })
      fetchPrices()
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
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
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Procedimento
        </Button>
      </div>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Procedimento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Setor / Laboratório</TableHead>
                <TableHead className="text-right">Valor Base</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Nenhum procedimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-medium">{item.work_type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-muted-foreground">{item.material || '-'}</TableCell>
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
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Procedimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Procedimento *</Label>
              <Input
                placeholder="Ex: Coroa Emax"
                value={formData.work_type}
                onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input
                placeholder="Ex: Prótese Fixa"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Material</Label>
              <Input
                placeholder="Ex: Zircônia, Resina Acrílica..."
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Laboratório / Setor</Label>
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
              <Label>Valor (R$) *</Label>
              <Input
                placeholder="150.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
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
