import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { createUser, updateUser } from '@/services/users'
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
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit2, Shield, Loader2 } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const PERMISSION_OPTIONS = [
  { id: 'inbox', label: 'CAIXA DE ENTRADA' },
  { id: 'new-request', label: 'NOVO PEDIDO' },
  { id: 'kanban', label: 'EVOLUÇÃO DOS TRABALHOS' },
  { id: 'history', label: 'HISTÓRICO GLOBAL' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'comparative-dashboard', label: 'DASH COMPARATIVO' },
  { id: 'finances', label: 'FINANÇAS' },
  { id: 'accounts-payable', label: 'CONTAS A PAGAR' },
  { id: 'inventory', label: 'ESTOQUE' },
  { id: 'dentists', label: 'DENTISTAS' },
  { id: 'patients', label: 'PACIENTES' },
  { id: 'prices', label: 'TABELA DE PREÇOS' },
  { id: 'users', label: 'USUÁRIOS' },
  { id: 'settings', label: 'CONFIGURAÇÕES GERAIS' },
  { id: 'dre-categories', label: 'CATEGORIAS DRE' },
  { id: 'audit', label: 'LOGS DE AUDITORIA' },
  { id: 'add-dentist', label: 'CRIAR NOVOS DENTISTAS' },
]

export function UsersManagement() {
  const { currentUser, logAudit } = useAppStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const [mainTab, setMainTab] = useState<'usuarios' | 'colaboradores'>('usuarios')
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive'>('active')
  const [subRoleFilter, setSubRoleFilter] = useState<string>('all')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'dentist',
    job_function: '',
    clinic: '',
    whatsapp_group_link: '',
    personal_phone: '',
    is_active: true,
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
        email: user.email?.includes('@vitalilab.local') ? '' : user.email,
        password: '',
        role: user.role,
        job_function: user.job_function || '',
        clinic: user.clinic || '',
        whatsapp_group_link: user.whatsapp_group_link || '',
        personal_phone: user.personal_phone || '',
        is_active: user.is_active !== false,
      })
      setSelectedPerms(user.permissions || [])
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: mainTab === 'usuarios' ? 'dentist' : 'receptionist',
        job_function: '',
        clinic: '',
        whatsapp_group_link: '',
        personal_phone: '',
        is_active: true,
      })
      setSelectedPerms([])
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      return toast({ title: 'O NOME É OBRIGATÓRIO', variant: 'destructive' })
    }
    if (!formData.email || !formData.email.includes('@')) {
      return toast({ title: 'FORMATO DE EMAIL INVÁLIDO', variant: 'destructive' })
    }
    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      return toast({
        title: 'A SENHA INICIAL DEVE TER NO MÍNIMO 6 CARACTERES',
        variant: 'destructive',
      })
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
      const { error } = await updateUser({
        userId: editingUser.id,
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password || undefined,
        clinic: formData.clinic,
        job_function: formData.job_function,
        role: formData.role,
        whatsapp_group_link: finalGroupLink,
        permissions: selectedPerms,
        personal_phone: formData.personal_phone,
        is_active: formData.is_active,
      })

      if (error) {
        toast({ title: 'ERRO', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'USUÁRIO ATUALIZADO COM SUCESSO' })
        if (editingUser.email !== formData.email.toLowerCase()) {
          await logAudit('UPDATE_EMAIL', 'profile', editingUser.id, {
            oldEmail: editingUser.email,
            newEmail: formData.email.toLowerCase(),
          })
        }
      }
    } else {
      const { error } = await createUser({
        ...formData,
        email: formData.email.toLowerCase(),
        job_function: formData.job_function,
        whatsapp_group_link: finalGroupLink,
        permissions: selectedPerms,
        phone: formData.personal_phone,
      })
      if (error)
        toast({
          title: 'ERRO',
          description: error.message || 'ERRO AO CRIAR',
          variant: 'destructive',
        })
      else toast({ title: 'USUÁRIO CRIADO COM SUCESSO' })
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

  const filteredUsers = users.filter((u) => {
    const isDentist = u.role === 'dentist'
    const isTabMatch = mainTab === 'usuarios' ? isDentist : !isDentist
    const isActiveMatch = statusFilter === 'active' ? u.is_active !== false : u.is_active === false
    const isSubRoleMatch = subRoleFilter === 'all' || u.role === subRoleFilter

    return isTabMatch && isActiveMatch && isSubRoleMatch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Tabs
          value={mainTab}
          onValueChange={(v: any) => {
            setMainTab(v)
            setSubRoleFilter('all')
          }}
          className="w-full sm:w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usuarios" className="uppercase text-xs font-bold">
              USUÁRIOS (DENTISTAS)
            </TabsTrigger>
            <TabsTrigger value="colaboradores" className="uppercase text-xs font-bold">
              COLABORADORES
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={subRoleFilter} onValueChange={setSubRoleFilter}>
            <SelectTrigger className="w-[170px] uppercase text-xs font-bold">
              <SelectValue placeholder="FILTRAR FUNÇÃO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="uppercase text-xs font-bold">
                TODAS FUNÇÕES
              </SelectItem>
              {mainTab === 'usuarios' ? (
                <SelectItem value="dentist" className="uppercase text-xs font-bold">
                  DENTISTA
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="admin" className="uppercase text-xs font-bold">
                    ADMINISTRADOR
                  </SelectItem>
                  <SelectItem value="receptionist" className="uppercase text-xs font-bold">
                    RECEPÇÃO / PRODUÇÃO
                  </SelectItem>
                  {currentUser?.role === ('master' as any) && (
                    <SelectItem value="master" className="uppercase text-xs font-bold">
                      MASTER
                    </SelectItem>
                  )}
                </>
              )}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-[130px] uppercase text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="uppercase text-xs font-bold">
                ATIVOS
              </SelectItem>
              <SelectItem value="inactive" className="uppercase text-xs font-bold">
                INATIVOS
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => openModal()}
            size="sm"
            className="uppercase text-xs font-bold whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> NOVO
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase text-xs font-bold">NOME</TableHead>
              <TableHead className="uppercase text-xs font-bold">CONTATO</TableHead>
              <TableHead className="uppercase text-xs font-bold">FUNÇÃO / PERFIL</TableHead>
              <TableHead className="text-center uppercase text-xs font-bold">
                ACESSO CUSTOMIZADO
              </TableHead>
              <TableHead className="text-right uppercase text-xs font-bold">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground uppercase text-xs font-bold"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  CARREGANDO...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground uppercase text-xs font-bold"
                >
                  NENHUM REGISTRO ENCONTRADO.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.is_active === false ? 'opacity-60' : ''}>
                  <TableCell className="font-medium uppercase text-sm">{user.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.email?.includes('@vitalilab.local') ? 'SEM EMAIL' : user.email}
                    </div>
                    {user.personal_phone && (
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        {user.personal_phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium uppercase text-sm">{user.role}</div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">
                      {user.job_function}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.permissions && user.permissions.length > 0 ? (
                      <span className="inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200 uppercase">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.permissions.length} MÓDULOS
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground uppercase font-semibold">
                        PADRÃO
                      </span>
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
            <DialogTitle className="uppercase">
              {editingUser ? 'EDITAR USUÁRIO' : 'NOVO USUÁRIO'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">NOME COMPLETO</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">TELEFONE / WHATSAPP</Label>
                <Input
                  value={formData.personal_phone}
                  onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                  placeholder="EX: (11) 99999-9999"
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">EMAIL DE ACESSO</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="EX: EXEMPLO@EMAIL.COM"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">
                  SENHA {editingUser ? '(OPCIONAL)' : 'INICIAL'}
                </Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'PREENCHA PARA ALTERAR' : 'MÍN. 6 CARACTERES'}
                  required={!editingUser}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">FUNÇÃO DO USUÁRIO</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger className="uppercase text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin" className="uppercase text-xs font-bold">
                      ADMINISTRADOR
                    </SelectItem>
                    <SelectItem value="dentist" className="uppercase text-xs font-bold">
                      DENTISTA
                    </SelectItem>
                    {currentUser?.role === ('master' as any) && (
                      <SelectItem value="master" className="uppercase text-xs font-bold">
                        MASTER
                      </SelectItem>
                    )}
                    <SelectItem value="receptionist" className="uppercase text-xs font-bold">
                      RECEPÇÃO / PRODUÇÃO
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">FUNÇÃO NA EMPRESA</Label>
                <Input
                  value={formData.job_function}
                  onChange={(e) => setFormData({ ...formData, job_function: e.target.value })}
                  placeholder="EX: CERAMISTA, RECEPÇÃO"
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">CLÍNICA (OPCIONAL)</Label>
                <Input
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-xs font-bold">LINK GRUPO WHATSAPP</Label>
                <Input
                  value={formData.whatsapp_group_link}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp_group_link: e.target.value })
                  }
                  placeholder="EX: HTTPS://CHAT.WHATSAPP.COM/..."
                />
              </div>

              {editingUser && (
                <div className="space-y-2 col-span-2 flex flex-col justify-center mt-2 border-t pt-4">
                  <Label className="mb-2 uppercase text-xs font-bold">STATUS DA CONTA</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <span className="text-sm font-medium uppercase">
                      {formData.is_active ? 'ATIVO' : 'INATIVO (BLOQUEADO)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm uppercase font-bold">
                  PERMISSÕES DE ACESSO (MENU LATERAL)
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={toggleAllPerms}
                  className="uppercase text-[10px] font-bold"
                >
                  {selectedPerms.length === PERMISSION_OPTIONS.length
                    ? 'DESMARCAR TUDO'
                    : 'MARCAR TUDO'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-4 uppercase font-semibold">
                SELECIONE OS MÓDULOS QUE ESTE USUÁRIO PODERÁ VISUALIZAR. SE NENHUM FOR SELECIONADO,
                AS PERMISSÕES PADRÕES DA FUNÇÃO SERÃO APLICADAS.
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
                      className="font-bold cursor-pointer text-xs uppercase"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="uppercase text-xs font-bold"
            >
              CANCELAR
            </Button>
            <Button onClick={handleSave} disabled={saving} className="uppercase text-xs font-bold">
              {saving ? 'SALVANDO...' : 'SALVAR'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
