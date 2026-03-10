import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function MaterialsPage() {
  const { appSettings, updateSetting, currentUser } = useAppStore()
  const [materials, setMaterials] = useState<string[]>([])
  const [newMaterial, setNewMaterial] = useState('')

  useEffect(() => {
    try {
      if (appSettings['materials_list']) {
        setMaterials(JSON.parse(appSettings['materials_list']))
      }
    } catch (e) {
      console.error('Failed to parse materials_list', e)
    }
  }, [appSettings])

  const saveMaterials = async (list: string[]) => {
    await updateSetting('materials_list', JSON.stringify(list))
    setMaterials(list)
  }

  const handleAdd = async () => {
    if (!newMaterial.trim()) return
    const formatted = newMaterial.trim()
    if (materials.find((m) => m.toLowerCase() === formatted.toLowerCase())) {
      toast({ title: 'Atenção', description: 'Este material já existe.', variant: 'destructive' })
      return
    }
    const list = [...materials, formatted].sort()
    await saveMaterials(list)
    setNewMaterial('')
    toast({ title: 'Sucesso', description: 'Material adicionado com sucesso!' })
  }

  const handleDelete = async (mat: string) => {
    if (!confirm(`Deseja remover o material "${mat}" da lista global?`)) return
    const list = materials.filter((m) => m !== mat)
    await saveMaterials(list)
    toast({ title: 'Sucesso', description: 'Material removido com sucesso!' })
  }

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Acesso restrito. Você não tem permissão para acessar esta página.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/prices">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Gerenciamento de Materiais
          </h2>
          <p className="text-muted-foreground text-sm">
            Configure a lista de materiais disponíveis para os pedidos dos dentistas.
          </p>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <CardTitle className="text-lg">Novo Material</CardTitle>
          <CardDescription>
            Adicione um novo material à lista global do laboratório.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <Label>Nome do Material</Label>
              <Input
                placeholder="Ex: Zircônia Premium, Resina Impressa..."
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Material
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 h-12">Material Cadastrado</TableHead>
                <TableHead className="w-[100px] text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                    <p>Nenhum material configurado.</p>
                    <p className="text-xs mt-1">
                      A lista será mesclada com os materiais da tabela de preços.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((mat) => (
                  <TableRow key={mat}>
                    <TableCell className="pl-6 font-medium">{mat}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mat)}
                        title="Remover Material"
                      >
                        <Trash2 className="w-4 h-4 text-destructive hover:text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
