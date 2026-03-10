import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { createUser } from '@/services/users'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit2, Shield, Loader2 } from 'lucide-react'
import { useAppStore } from '@/stores/main'

export const PERMISSION_OPTIONS = [
  { id: 'inbox', label: 'Caixa de Entrada' },
  { id: 'new-request', label: 'Novo Pedido' },
  { id: 'kanban', label: 'Evolução dos Trabalhos' },
  { id: 'history', label: 'Histórico Global' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'comparative-dashboard', label: 'DASH COMPARATIVO' },
  { id: 'finances', label: 'Finanças' },
  { id: 'accounts-payable', label: 'Contas a Pagar' },
  { id: 'inventory', label: 'Estoque' },
  { id: 'dentists', label: 'Dentistas' },
  { id: 'patients', label: 'Pacientes' },
  { id: 'prices', label: 'Tabela de Preços' },
  { id: 'settings', label: 'Configurações e Usuários' },
  { id: 'dre-categories', label: 'Categorias DRE' },
  { id: 'audit', label: 'Logs de Auditoria' },
]

export function UsersManagement() {
  const { currentUser } = useAppStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'dentist',
    job_function: '',
    clinic: '',
    whatsapp_group_link: '',
  })
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('name', { ascending: true })
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openModal = (user?: any) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        job_function: user.job_function || '',
        clinic: user.clinic || '',
        whatsapp_group_link: user.whatsapp_group_link || '',
      })
      setSelectedPerms(user.permissions || [])
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'dentist',
        job_function: '',
        clinic: '',
        whatsapp_group_link: '',
      })
      setSelectedPerms([])
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || (!editingUser && (!formData.email || !formData.password))) {
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
    }
    setSaving(true)

    let finalGroupLink = formData.whatsapp_group_link.trim()
    if (
      finalGroupLink &&
      !finalGroupLink.startsWith('http://') &&
      !finalGroupLink.startsWith('https://')
    ) {
      finalGroupLink = `https://${finalGroupLink}`
    }

    if (editingUser) {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          clinic: formData.clinic,
          job_function: formData.job_function,
          role: formData.role,
          whatsapp_group_link: finalGroupLink,
          permissions: selectedPerms,
        })
        .eq('id', editingUser.id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else toast({ title: 'Usuário atualizado com sucesso' })
    } else {
      const { error } = await createUser({
        ...formData,
        job_function: formData.job_function,
        whatsapp_group_link: finalGroupLink,
        permissions: selectedPerms,
      })
      if (error)
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao criar',
          variant: 'destructive',
        })
      else toast({ title: 'Usuário criado com sucesso' })
    }

    setSaving(false)
    setModalOpen(false)
    fetchUsers()
  }

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const toggleAllPerms = () => {
    if (selectedPerms.length === PERMISSION_OPTIONS.length) {
      setSelectedPerms([])
    } else {
      setSelectedPerms(PERMISSION_OPTIONS.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Gerencie o acesso e permissões de usuários do sistema.
        </p>
        <Button onClick={() => openModal()} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Função na Empresa</TableHead>
              <TableHead className="text-center">Acesso Customizado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="text-muted-foreground">{user.job_function}</TableCell>
                  <TableCell className="text-center">
                    {user.permissions && user.permissions.length > 0 ? (
                      <span className="inline-flex items-center text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.permissions.length} módulos
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Padrão</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openModal(user)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Nome Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Clínica (Opcional)</Label>
                <Input
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Email de Acesso</Label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled={!!editingUser}
                  className={editingUser ? 'bg-muted' : ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!editingUser && (
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label>Senha Inicial</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Função do Usuário</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="dentist">Dentista</SelectItem>
                    {currentUser?.role === ('master' as any) && (
                      <SelectItem value="master">Master</SelectItem>
                    )}
                    <SelectItem value="receptionist">Recepção / Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Função na Empresa</Label>
                <Input
                  value={formData.job_function}
                  onChange={(e) => setFormData({ ...formData, job_function: e.target.value })}
                  placeholder="Ex: Ceramista, Recepção"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Link Grupo WhatsApp</Label>
                <Input
                  value={formData.whatsapp_group_link}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp_group_link: e.target.value })
                  }
                  placeholder="Ex: https://chat.whatsapp.com/..."
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base">Permissões de Acesso (Menu Lateral)</Label>
                <Button variant="outline" size="sm" type="button" onClick={toggleAllPerms}>
                  {selectedPerms.length === PERMISSION_OPTIONS.length
                    ? 'Desmarcar Tudo'
                    : 'Marcar Tudo'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Selecione os módulos que este usuário poderá visualizar. Se nenhum for selecionado,
                as permissões padrões da função serão aplicadas.
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border rounded-md bg-muted/20">
                {PERMISSION_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`perm-${opt.id}`}
                      checked={selectedPerms.includes(opt.id)}
                      onCheckedChange={() => togglePerm(opt.id)}
                    />
                    <Label
                      htmlFor={`perm-${opt.id}`}
                      className="font-normal cursor-pointer text-sm"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
