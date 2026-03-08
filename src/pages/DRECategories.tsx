import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Edit2, Settings } from 'lucide-react'
import { DRECategory } from '@/lib/types'

export default function DRECategories() {
  const { dreCategories, currentUser, addDRECategory, updateDRECategory } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<DRECategory | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    type: 'revenue' | 'variable' | 'fixed'
  }>({ name: '', type: 'fixed' })
  const [isSaving, setIsSaving] = useState(false)

  if (currentUser?.role !== 'admin') return <Navigate to="/" replace />

  const getTypeLabel = (type: string) => {
    if (type === 'revenue') return 'Receita'
    if (type === 'variable') return 'Custo Variável'
    if (type === 'fixed') return 'Despesa Operacional'
    return type
  }

  const handleOpenNew = () => {
    setEditingCategory(null)
    setFormData({ name: '', type: 'fixed' })
    setModalOpen(true)
  }

  const handleOpenEdit = (cat: DRECategory) => {
    setEditingCategory(cat)
    setFormData({ name: cat.name, type: cat.category_type })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    setIsSaving(true)
    let success = false

    if (editingCategory) {
      if (
        editingCategory.name === formData.name &&
        editingCategory.category_type === formData.type
      ) {
        setModalOpen(false)
        setIsSaving(false)
        return
      }
      success = await updateDRECategory(editingCategory.name, formData.name.trim(), formData.type)
    } else {
      success = await addDRECategory(formData.name.trim(), formData.type)
    }

    setIsSaving(false)
    if (success) setModalOpen(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Categorias DRE</h2>
            <p className="text-muted-foreground text-sm">
              Gerencie a estrutura do seu Demonstrativo de Resultados.
            </p>
          </div>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria
        </Button>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-4">
          <CardTitle>Estrutura Cadastrada</CardTitle>
          <CardDescription>
            Todas as categorias que estruturam seu fluxo de caixa e relatórios.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Nome da Categoria</TableHead>
                <TableHead>Classificação DRE</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dreCategories.map((cat) => (
                <TableRow key={cat.name}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {getTypeLabel(cat.category_type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                      onClick={() => handleOpenEdit(cat)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria DRE'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Ao renomear esta categoria, todos os registros históricos vinculados serão atualizados automaticamente para manter a integridade.'
                : 'Crie uma nova classificação para organizar seus relatórios e contas a pagar.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Nome da Categoria <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: Marketing, Logística..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Classificação Estrutural <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v: any) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Receita Bruta</SelectItem>
                  <SelectItem value="variable">Custo Variável (Dedução direta)</SelectItem>
                  <SelectItem value="fixed">Despesa Operacional (Fixa)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.name.trim()}>
              {isSaving ? 'Salvando...' : 'Salvar Categoria'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
