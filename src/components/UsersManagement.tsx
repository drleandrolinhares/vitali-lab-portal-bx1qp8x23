import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { createUser, updateUser } from '@/services/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  MoreVertical,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Key,
  Copy,
  Edit,
} from 'lucide-react'
import { useAppStore } from '@/stores/main'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MODULES } from './RolePermissionsPanel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { PartnerPricesPanel, PartnerPricesPanelRef } from './PartnerPricesPanel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ROLES_INFO = [
  {
    id: 'master',
    title: 'Master',
    desc: 'Este perfil possui acesso total e irrestrito a todas as funções e visualizações do sistema.',
    icon: ShieldCheck,
    category: 'SÓCIO',
  },
  {
    id: 'admin',
    title: 'Administrador',
    desc: 'Este perfil é responsável por coordenar as operações, organizando a equipe e configurando o sistema. Possui acesso estendido baseado em permissões.',
    icon: Building,
    category: 'SÓCIO',
  },
  {
    id: 'technical_assistant',
    title: 'Auxiliar Técnico',
    desc: 'Este perfil é voltado para apoiar os profissionais durante os atendimentos, organizar materiais e gerenciar o estoque.',
    icon: Briefcase,
    category: 'COLABORADOR',
  },
  {
    id: 'financial',
    title: 'Financeiro',
    desc: 'Este perfil é responsável por controlar as receitas, despesas e o faturamento do laboratório. Foco nas operações financeiras.',
    icon: CreditCard,
    category: 'COLABORADOR',
  },
  {
    id: 'relationship_manager',
    title: 'Gestor de Relacionamento',
    desc: 'Este perfil é responsável por monitorar a experiência dos dentistas, promovendo ações de engajamento e fidelização.',
    icon: User,
    category: 'COLABORADOR',
  },
  {
    id: 'dentist',
    title: 'Profissional (Dentista)',
    desc: 'Este perfil é voltado para os dentistas responsáveis pelos casos. Possui acesso estritamente aos seus próprios pedidos e pacientes.',
    icon: User,
    category: 'DENTISTA',
  },
  {
    id: 'laboratory',
    title: 'Laboratório Parceiro',
    desc: 'Perfil B2B para laboratórios parceiros. Visualiza apenas seus pedidos com tabela de preços customizada.',
    icon: Building,
    category: 'LABORATÓRIO PARCEIRO',
  },
  {
    id: 'receptionist',
    title: 'Recepcionista / Produção',
    desc: 'Este perfil é responsável por recepcionar pedidos e organizar o andamento do laboratório. Acesso operacional e de triagem.',
    icon: Mail,
    category: 'COLABORADOR',
  },
]

const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) return false
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false
  }
  return true
}

export function UsersManagement() {
  const { currentUser, logAudit, appSettings } = useAppStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ativos')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [activeTab, setActiveTab] = useState<'pessoais' | 'perfil' | 'permissoes' | 'precos'>(
    'pessoais',
  )

  const partnerPricesRef = useRef<PartnerPricesPanelRef>(null)

  const actualUserRole = currentUser?.role
  const isCurrentUserMaster = actualUserRole === 'master'
  const isMasterOrAdmin = actualUserRole === 'master' || actualUserRole === 'admin'

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    personal_phone: '',
    clinic: '',
    commercial_agreement: '0',
    birth_date: '',
    rg: '',
    cpf: '',
    cep: '',
    address: '',
    address_number: '',
    address_complement: '',
    city: '',
    state: '',
    has_access_schedule: false,
    can_move_kanban_cards: true,
    role: 'dentist',
    is_active: true,
    assigned_dentists: [] as string[],
    closing_date: '',
    payment_due_date: '',
    clinic_contact_name: '',
    clinic_contact_role: '',
    clinic_contact_phone: '',
    whatsapp_group_link: '',
  })

  const [selectedPerms, setSelectedPerms] = useState<Record<string, any> | null>(null)

  const effectivePerms = useMemo(() => {
    if (selectedPerms !== null) return selectedPerms
    try {
      const defaults = JSON.parse(appSettings['role_permissions_v2'] || '{}')
      return defaults[formData.role] || {}
    } catch {
      return {}
    }
  }, [selectedPerms, appSettings, formData.role])

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('name', { ascending: true })

        if (error) {
          console.error('Error loading users', error)
        } else if (isMounted && data) {
          setUsers(data)
        }
      } catch (err: any) {
        console.error('Exception loading users', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUsers()

    const channel = supabase
      .channel('users-management-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUsers((prev) => {
            if (prev.some((u) => u.id === payload.new.id)) return prev
            return [...prev, payload.new].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          })
        } else if (payload.eventType === 'UPDATE') {
          setUsers((prev) =>
            prev.map((u) => (u.id === payload.new.id ? { ...u, ...payload.new } : u)),
          )
        } else if (payload.eventType === 'DELETE') {
          setUsers((prev) => prev.filter((u) => u.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const baseFilteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())

      let matchStatus = true
      if (filterStatus === 'ativos') matchStatus = u.is_active !== false
      else if (filterStatus === 'inativos') matchStatus = u.is_active === false

      return matchSearch && matchStatus
    })
  }, [users, search, filterStatus])

  const filteredUsers = useMemo(() => {
    return baseFilteredUsers.filter((u) => {
      if (selectedCategory === 'socios') {
        return ['master', 'admin'].includes(u.role)
      }
      if (selectedCategory === 'dentists') {
        return ['dentist'].includes(u.role)
      }
      if (selectedCategory === 'staff') {
        return [
          'receptionist',
          'technical_assistant',
          'financial',
          'relationship_manager',
        ].includes(u.role)
      }
      if (selectedCategory === 'laboratorio') {
        return u.role === 'laboratory'
      }
      return true
    })
  }, [baseFilteredUsers, selectedCategory])

  const dentistsList = useMemo(() => {
    return users
      .filter((u) => u.role === 'dentist' || u.role === 'laboratory')
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [users])

  const openModal = (user?: any) => {
    setActiveTab('pessoais')
    setShowPassword(false)
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        personal_phone: user.personal_phone || '',
        clinic: user.clinic || '',
        commercial_agreement: user.commercial_agreement?.toString() || '0',
        birth_date: user.birth_date || '',
        rg: user.rg || '',
        cpf: user.cpf || '',
        cep: user.cep || '',
        address: user.address || '',
        address_number: user.address_number || '',
        address_complement: user.address_complement || '',
        city: user.city || '',
        state: user.state || '',
        has_access_schedule: user.has_access_schedule || false,
        can_move_kanban_cards: user.can_move_kanban_cards ?? true,
        role: user.role || 'dentist',
        is_active: user.is_active !== false,
        assigned_dentists: user.assigned_dentists || [],
        closing_date: user.closing_date?.toString() || '',
        payment_due_date: user.payment_due_date?.toString() || '',
        clinic_contact_name: user.clinic_contact_name || '',
        clinic_contact_role: user.clinic_contact_role || '',
        clinic_contact_phone: user.clinic_contact_phone || '',
        whatsapp_group_link: user.whatsapp_group_link || '',
      })
      let initialPerms = user.permissions
      if (Array.isArray(initialPerms) || !initialPerms || Object.keys(initialPerms).length === 0) {
        initialPerms = null
      }
      setSelectedPerms(initialPerms)
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        personal_phone: '',
        clinic: '',
        commercial_agreement: '0',
        birth_date: '',
        rg: '',
        cpf: '',
        cep: '',
        address: '',
        address_number: '',
        address_complement: '',
        city: '',
        state: '',
        has_access_schedule: false,
        can_move_kanban_cards: true,
        role: 'dentist',
        is_active: true,
        assigned_dentists: [],
        closing_date: '',
        payment_due_date: '',
        clinic_contact_name: '',
        clinic_contact_role: '',
        clinic_contact_phone: '',
        whatsapp_group_link: '',
      })
      setSelectedPerms(null)
    }
    setModalOpen(true)
  }

  const sanitizeString = (val: string | undefined | null) => {
    if (!val) return null
    const trimmed = val.trim()
    return trimmed === '' ? null : trimmed
  }

  const handleSave = async () => {
    if (!isMasterOrAdmin) return

    if (!formData.name) return toast({ title: 'O Nome é obrigatório', variant: 'destructive' })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      return toast({
        title: 'Email inválido',
        description: 'Por favor, insira um endereço de e-mail válido.',
        variant: 'destructive',
      })
    }

    if (!editingUser && (!formData.password || formData.password.length < 6))
      return toast({
        title: 'Senha inválida',
        description: 'A senha deve ter no mínimo 6 caracteres',
        variant: 'destructive',
      })

    setSaving(true)

    try {
      let payload: any = {}

      if (editingUser) {
        payload = { userId: editingUser.id }
        const currentCA = parseFloat(formData.commercial_agreement) || 0
        const oldCA = editingUser.commercial_agreement || 0

        if (formData.name !== editingUser.name) payload.name = formData.name
        if (formData.email.toLowerCase() !== (editingUser.email || '').toLowerCase())
          payload.email = formData.email.toLowerCase()
        if (formData.role !== editingUser.role) payload.role = formData.role

        const checkField = (field: string, formVal: any, userVal: any) => {
          const sanitizedForm = typeof formVal === 'string' ? sanitizeString(formVal) : formVal
          const sanitizedUser = typeof userVal === 'string' ? sanitizeString(userVal) : userVal
          if (sanitizedForm !== sanitizedUser) {
            payload[field] = sanitizedForm
          }
        }

        checkField('personal_phone', formData.personal_phone, editingUser.personal_phone)
        checkField('clinic', formData.clinic, editingUser.clinic)
        checkField('username', formData.username, editingUser.username)
        checkField('rg', formData.rg, editingUser.rg)
        checkField('cpf', formData.cpf, editingUser.cpf)
        checkField('cep', formData.cep, editingUser.cep)
        checkField('address', formData.address, editingUser.address)
        checkField('address_number', formData.address_number, editingUser.address_number)
        checkField(
          'address_complement',
          formData.address_complement,
          editingUser.address_complement,
        )
        checkField('city', formData.city, editingUser.city)
        checkField('state', formData.state, editingUser.state)
        checkField(
          'whatsapp_group_link',
          formData.whatsapp_group_link,
          editingUser.whatsapp_group_link,
        )
        checkField(
          'clinic_contact_name',
          formData.clinic_contact_name,
          editingUser.clinic_contact_name,
        )
        checkField(
          'clinic_contact_role',
          formData.clinic_contact_role,
          editingUser.clinic_contact_role,
        )
        checkField(
          'clinic_contact_phone',
          formData.clinic_contact_phone,
          editingUser.clinic_contact_phone,
        )
        checkField('closing_date', formData.closing_date, editingUser.closing_date?.toString())
        checkField(
          'payment_due_date',
          formData.payment_due_date,
          editingUser.payment_due_date?.toString(),
        )

        const currentBD = sanitizeString(formData.birth_date)
        const oldBD = sanitizeString(editingUser.birth_date)
        if (currentBD !== oldBD) payload.birth_date = currentBD

        if (currentCA !== oldCA) payload.commercial_agreement = currentCA

        if (formData.has_access_schedule !== (editingUser.has_access_schedule || false))
          payload.has_access_schedule = formData.has_access_schedule
        if (formData.can_move_kanban_cards !== (editingUser.can_move_kanban_cards ?? true))
          payload.can_move_kanban_cards = formData.can_move_kanban_cards
        if (formData.is_active !== (editingUser.is_active !== false))
          payload.is_active = formData.is_active

        let normalizedUserPerms = editingUser.permissions
        if (Array.isArray(normalizedUserPerms) || !normalizedUserPerms) {
          normalizedUserPerms = {}
        }

        if (selectedPerms !== null && !deepEqual(selectedPerms, normalizedUserPerms)) {
          payload.permissions = selectedPerms
        }

        if (
          JSON.stringify(formData.assigned_dentists) !==
          JSON.stringify(editingUser.assigned_dentists || [])
        )
          payload.assigned_dentists = formData.assigned_dentists

        if (formData.password && formData.password.trim() !== '') {
          payload.password = formData.password
        }

        if (Object.keys(payload).length === 1 && payload.userId) {
          toast({
            title: 'Aviso',
            description: 'Nenhuma alteração foi detectada nos dados do usuário.',
          })
          setSaving(false)
          setModalOpen(false)
          return
        }
      } else {
        payload = {
          name: formData.name,
          email: formData.email.toLowerCase(),
          role: formData.role,
          personal_phone: sanitizeString(formData.personal_phone),
          clinic: sanitizeString(formData.clinic),
          commercial_agreement: parseFloat(formData.commercial_agreement) || 0,
          username: sanitizeString(formData.username),
          rg: sanitizeString(formData.rg),
          cpf: sanitizeString(formData.cpf),
          birth_date: sanitizeString(formData.birth_date),
          cep: sanitizeString(formData.cep),
          address: sanitizeString(formData.address),
          address_number: sanitizeString(formData.address_number),
          address_complement: sanitizeString(formData.address_complement),
          city: sanitizeString(formData.city),
          state: sanitizeString(formData.state),
          has_access_schedule: formData.has_access_schedule,
          can_move_kanban_cards: formData.can_move_kanban_cards,
          is_active: formData.is_active,
          permissions: selectedPerms || {},
          assigned_dentists: formData.assigned_dentists,
          password: formData.password,
          requires_password_change: true,
          closing_date: sanitizeString(formData.closing_date),
          payment_due_date: sanitizeString(formData.payment_due_date),
          clinic_contact_name: sanitizeString(formData.clinic_contact_name),
          clinic_contact_role: sanitizeString(formData.clinic_contact_role),
          clinic_contact_phone: sanitizeString(formData.clinic_contact_phone),
          whatsapp_group_link: sanitizeString(formData.whatsapp_group_link),
        }
      }

      if (editingUser) {
        let normalizedUserPerms = editingUser.permissions
        if (Array.isArray(normalizedUserPerms) || !normalizedUserPerms) {
          normalizedUserPerms = {}
        }
        const dashboardsChanged =
          payload.permissions &&
          !deepEqual(normalizedUserPerms.dashboards, selectedPerms?.dashboards)

        const { error } = await updateUser(payload)

        if (error) {
          throw error
        } else {
          toast({ title: 'Usuário atualizado com sucesso!' })

          setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...payload } : u)))

          if (dashboardsChanged) {
            await logAudit('UPDATE_PERMISSIONS', 'profiles', editingUser.id, {
              reason: 'Dashboard permissions changed',
              target_user: formData.name,
              dashboards: selectedPerms?.dashboards,
            })
          }

          if (formData.role === 'laboratory' && isCurrentUserMaster && partnerPricesRef.current) {
            try {
              await partnerPricesRef.current.save()
            } catch (e) {
              console.error('Failed to save partner prices', e)
            }
          }
        }
      } else {
        const { error, data } = await createUser(payload)
        if (error) {
          throw error
        } else {
          toast({ title: 'Usuário criado com sucesso!' })

          if (data?.data?.user?.id) {
            setUsers((prev) => {
              if (prev.some((u) => u.id === data.data.user.id)) return prev
              return [
                ...prev,
                { id: data.data.user.id, ...payload, created_at: new Date().toISOString() },
              ].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            })
          }
        }
      }

      setModalOpen(false)
    } catch (err: any) {
      const errorMsg =
        typeof err === 'string'
          ? err
          : err?.message || 'Ocorreu um erro ao processar sua requisição.'

      toast({
        title: 'Atenção',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmAndResetPassword = async (user: any) => {
    if (
      !confirm(
        `Deseja redefinir a senha do usuário ${user.name} para "123456"? O usuário será forçado a trocar a senha no próximo login.`,
      )
    )
      return

    setSaving(true)
    try {
      const { error } = await updateUser({
        userId: user.id,
        password: '123456',
        requires_password_change: true,
      })

      if (error) throw error

      toast({ title: 'Senha redefinida para 123456 com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao redefinir senha',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!editingUser) return
    await confirmAndResetPassword(editingUser)
  }

  const updateAccess = (moduleId: string, checked: boolean) => {
    if (!isMasterOrAdmin) return
    setSelectedPerms((prev) => {
      const source = prev ?? effectivePerms
      const newPerms = JSON.parse(JSON.stringify(source || {}))
      if (!newPerms[moduleId]) newPerms[moduleId] = { access: false, actions: {} }
      newPerms[moduleId].access = checked
      return newPerms
    })
  }

  const updateAction = (moduleId: string, actionId: string, checked: boolean) => {
    if (!isMasterOrAdmin) return
    setSelectedPerms((prev) => {
      const source = prev ?? effectivePerms
      const newPerms = JSON.parse(JSON.stringify(source || {}))
      if (!newPerms[moduleId]) newPerms[moduleId] = { access: true, actions: {} }
      if (!newPerms[moduleId].actions) newPerms[moduleId].actions = {}
      newPerms[moduleId].actions[actionId] = checked
      return newPerms
    })
  }

  const visibleModules = useMemo(
    () => MODULES.filter((mod) => !mod.roles || mod.roles.includes(formData.role)),
    [formData.role],
  )

  const isAllPermsSelected = useMemo(() => {
    return visibleModules.every((mod) => {
      const modPerm = effectivePerms[mod.id]
      if (!modPerm?.access) return false
      if (mod.actions && mod.actions.length > 0) {
        return mod.actions.every((act) => modPerm.actions?.[act.id])
      }
      return true
    })
  }, [effectivePerms, visibleModules])

  const handleToggleAllPerms = (checked: boolean) => {
    if (!isMasterOrAdmin) return
    const allPerms: Record<string, any> = {}
    if (checked) {
      visibleModules.forEach((mod) => {
        allPerms[mod.id] = { access: true, actions: {} }
        if (mod.actions) {
          mod.actions.forEach((act) => {
            allPerms[mod.id].actions[act.id] = true
          })
        }
      })
    } else {
      visibleModules.forEach((mod) => {
        allPerms[mod.id] = { access: false, actions: {} }
        if (mod.actions) {
          mod.actions.forEach((act) => {
            allPerms[mod.id].actions[act.id] = false
          })
        }
      })
    }
    setSelectedPerms(allPerms)
  }

  const isAllDentistsSelected =
    dentistsList.length > 0 && formData.assigned_dentists.length === dentistsList.length

  const handleToggleAllDentists = (checked: boolean) => {
    if (!isMasterOrAdmin) return
    if (checked) {
      setFormData((prev) => ({ ...prev, assigned_dentists: dentistsList.map((d) => d.id) }))
    } else {
      setFormData((prev) => ({ ...prev, assigned_dentists: [] }))
    }
  }

  const toggleDentist = (dentistId: string, checked: boolean) => {
    if (!isMasterOrAdmin) return
    setFormData((prev) => {
      const current = prev.assigned_dentists || []
      if (checked) {
        return { ...prev, assigned_dentists: [...current, dentistId] }
      } else {
        return { ...prev, assigned_dentists: current.filter((id) => id !== dentistId) }
      }
    })
  }

  const handleLocalFinancialChange = (id: string, field: string, value: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)))
  }

  const handleSaveFinancial = async (id: string, field: string, value: string | null) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', id)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    }
  }

  const copyPix = (pix?: string) => {
    if (!pix) return
    navigator.clipboard.writeText(pix)
    toast({ title: 'Chave PIX copiada para a área de transferência!' })
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-xl bg-background p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold uppercase">QUADRO DE FUNCIONÁRIOS</h3>
            <p className="text-xs text-muted-foreground uppercase mt-1">
              GERENCIE A EQUIPE ATUAL DA CLÍNICA E ADICIONE NOVOS COLABORADORES.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] uppercase font-semibold text-xs border-border shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativos">Somente Ativos</SelectItem>
                <SelectItem value="inativos">Somente Inativos</SelectItem>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
            {isMasterOrAdmin && (
              <Button
                onClick={() => openModal()}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white shrink-0 uppercase text-xs font-bold tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" /> ADICIONAR COLABORADOR
              </Button>
            )}
          </div>
        </div>

        {/* Global Search inside the section */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar Colaborador"
            className="pl-9 h-10 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="bg-muted/40 p-1 rounded-lg h-auto flex flex-wrap justify-start gap-1 overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="all"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              TIME TOTAL
            </TabsTrigger>
            <TabsTrigger
              value="socios"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              SÓCIOS
            </TabsTrigger>
            <TabsTrigger
              value="dentists"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              DENTISTAS
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              COLABORADORES
            </TabsTrigger>
            <TabsTrigger
              value="laboratorio"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              LABORATÓRIO PARCEIRO
            </TabsTrigger>
            <TabsTrigger
              value="financeiro"
              className="rounded-md px-4 py-2 font-semibold uppercase text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              DADOS FINANCEIROS
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedCategory === 'financeiro' ? (
        <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
          <div className="flex items-center px-6 py-4 border-b bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="w-[35%]">COLABORADOR</div>
            <div className="w-[25%]">PIX NÚMERO</div>
            <div className="w-[20%]">PIX TIPO</div>
            <div className="w-[20%]">BANCO</div>
          </div>

          <div className="p-4 space-y-4 bg-muted/5">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="shadow-none rounded-xl border flex flex-col md:flex-row items-start md:items-center p-4 bg-background gap-4 md:gap-0"
                >
                  <div className="w-full md:w-[35%] font-bold uppercase text-sm truncate pr-4 text-foreground">
                    {user.name}
                  </div>
                  <div className="w-full md:w-[25%] flex items-center gap-2 md:pr-4">
                    <Input
                      value={user.pix_key || ''}
                      onChange={(e) =>
                        handleLocalFinancialChange(user.id, 'pix_key', e.target.value)
                      }
                      onBlur={(e) => handleSaveFinancial(user.id, 'pix_key', e.target.value)}
                      placeholder="NÚMERO DO PIX"
                      className="border-none shadow-none bg-transparent px-0 uppercase text-sm focus-visible:ring-0 placeholder:text-muted-foreground/40 font-medium h-auto py-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyPix(user.pix_key)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-md"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-full md:w-[20%] md:pr-4">
                    <Select
                      value={user.pix_type || 'none'}
                      onValueChange={(val) =>
                        handleSaveFinancial(user.id, 'pix_type', val === 'none' ? null : val)
                      }
                    >
                      <SelectTrigger className="border-none shadow-none bg-transparent px-0 uppercase text-sm focus:ring-0 text-muted-foreground font-medium h-auto py-1">
                        <SelectValue placeholder="TIPO PIX" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="none"
                          className="uppercase text-xs font-semibold text-muted-foreground"
                        >
                          Selecionar...
                        </SelectItem>
                        <SelectItem value="cpf" className="uppercase text-xs font-semibold">
                          CPF
                        </SelectItem>
                        <SelectItem value="cnpj" className="uppercase text-xs font-semibold">
                          CNPJ
                        </SelectItem>
                        <SelectItem value="email" className="uppercase text-xs font-semibold">
                          E-mail
                        </SelectItem>
                        <SelectItem value="celular" className="uppercase text-xs font-semibold">
                          Celular
                        </SelectItem>
                        <SelectItem value="aleatoria" className="uppercase text-xs font-semibold">
                          Chave Aleatória
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-[20%]">
                    <Input
                      value={user.bank_name || ''}
                      onChange={(e) =>
                        handleLocalFinancialChange(user.id, 'bank_name', e.target.value)
                      }
                      onBlur={(e) => handleSaveFinancial(user.id, 'bank_name', e.target.value)}
                      placeholder="NOME DO BANCO"
                      className="border-none shadow-none bg-transparent px-0 uppercase text-sm focus-visible:ring-0 placeholder:text-muted-foreground/40 font-medium h-auto py-1 text-muted-foreground"
                    />
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-background">
                <Users className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">
                  Nenhum colaborador encontrado
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Verifique os filtros aplicados e tente novamente.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredUsers.map((user) => {
                const roleObj = ROLES_INFO.find((r) => r.id === user.role)
                const isMaster = user.role === 'master'

                return (
                  <Card
                    key={user.id}
                    className={cn(
                      'relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-sm',
                      user.is_active === false && 'opacity-60 grayscale-[0.5]',
                      isMaster &&
                        'border-[#e76f51] shadow-sm shadow-[#e76f51]/20 ring-1 ring-[#e76f51]/50',
                    )}
                    onClick={() => {
                      if (isMaster && actualUserRole !== 'master') {
                        toast({
                          title: 'Acesso Negado',
                          description:
                            'Apenas usuários MASTER podem visualizar ou editar perfis MASTER.',
                          variant: 'destructive',
                        })
                        return
                      }
                      openModal(user)
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between p-4 pb-0">
                        <div className="flex flex-wrap gap-2">
                          {isMaster && (
                            <Badge className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#e76f51] hover:bg-[#d95f43] text-white border-transparent shadow-none">
                              MASTER
                            </Badge>
                          )}
                          {user.role === 'dentist' && (
                            <Badge
                              variant="secondary"
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border-transparent shadow-none"
                            >
                              DENTISTA
                            </Badge>
                          )}
                          {user.role === 'laboratory' && (
                            <Badge
                              variant="secondary"
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 border-transparent shadow-none"
                            >
                              LABORATÓRIO
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-none',
                              user.is_active !== false
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800'
                                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-800',
                            )}
                          >
                            {user.is_active !== false ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mr-2 -mt-2 relative z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isMaster && actualUserRole !== 'master') {
                                  toast({
                                    title: 'Acesso Negado',
                                    description:
                                      'Apenas usuários MASTER podem visualizar ou editar perfis MASTER.',
                                    variant: 'destructive',
                                  })
                                  return
                                }
                                openModal(user)
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" /> Editar Perfil
                            </DropdownMenuItem>
                            {isMasterOrAdmin && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  confirmAndResetPassword(user)
                                }}
                                className="text-amber-600 focus:text-amber-700"
                              >
                                <Key className="w-4 h-4 mr-2" /> Redefinir Senha
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-col items-center p-4 pt-2">
                        <Avatar className="w-16 h-16 border-2 border-muted/50 mb-3">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold uppercase">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-base text-center line-clamp-1">
                          {user.name}
                        </h3>
                      </div>

                      <div className="bg-muted/30 p-4 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{roleObj?.title || user.role}</span>
                        </div>
                        {(user.role === 'dentist' || user.role === 'laboratory') && user.clinic && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{user.clinic}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{user.email || 'Não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {user.personal_phone || 'Não encontrado'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 border-t text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 bg-muted/10">
                        <Clock className="w-3.5 h-3.5" />
                        {user.last_access_at
                          ? `Último acesso em: ${format(new Date(user.last_access_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
                          : 'Último acesso em: não registrado'}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 border rounded-xl bg-background shadow-sm border-dashed animate-fade-in">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">Nenhum usuário encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Verifique os filtros aplicados e tente novamente.
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col h-[90vh]">
          <DialogTitle className="sr-only">
            {formData.name ? `Editar Usuário: ${formData.name}` : 'Criar Novo Usuário'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para gerenciar dados pessoais, perfil e permissões de acesso do usuário.
          </DialogDescription>

          <div className="flex items-center justify-between p-4 border-b shrink-0 bg-muted/10">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {formData.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{formData.name || 'Novo Usuário'}</h2>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium mr-2">Status da Conta:</span>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                disabled={!isMasterOrAdmin || saving}
              />
              <span className="text-sm font-semibold uppercase w-16">
                {formData.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={(v: any) => setActiveTab(v)}
              className="flex flex-col h-full"
            >
              <div className="px-6 pt-2 border-b shrink-0 overflow-x-auto scrollbar-hide">
                <TabsList className="bg-transparent h-auto p-0 flex gap-6 min-w-max">
                  <TabsTrigger
                    value="pessoais"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-semibold text-muted-foreground"
                  >
                    Dados Pessoais
                  </TabsTrigger>
                  <TabsTrigger
                    value="perfil"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-semibold text-muted-foreground"
                  >
                    Perfil de Usuário
                  </TabsTrigger>
                  <TabsTrigger
                    value="permissoes"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-semibold text-muted-foreground"
                  >
                    Configurações de permissão
                  </TabsTrigger>
                  {formData.role === 'laboratory' && isCurrentUserMaster && (
                    <TabsTrigger
                      value="precos"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-semibold text-muted-foreground"
                    >
                      Tabela de Preços
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <ScrollArea className="flex-1 p-6 bg-muted/5">
                <TabsContent value="pessoais" className="mt-0 space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                      <User className="w-4 h-4 text-primary" /> Informações Básicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl bg-background">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Nome Completo *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Usuário *</Label>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Telefone *</Label>
                        <Input
                          value={formData.personal_phone}
                          onChange={(e) =>
                            setFormData({ ...formData, personal_phone: e.target.value })
                          }
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Clínica / Empresa</Label>
                        <Input
                          value={formData.clinic}
                          onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Desconto Padrão (%)</Label>
                        <Input
                          type="number"
                          value={formData.commercial_agreement}
                          onChange={(e) =>
                            setFormData({ ...formData, commercial_agreement: e.target.value })
                          }
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">
                          Grupo WhatsApp (Link)
                        </Label>
                        <Input
                          value={formData.whatsapp_group_link}
                          onChange={(e) =>
                            setFormData({ ...formData, whatsapp_group_link: e.target.value })
                          }
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                    </div>
                  </section>

                  {(formData.role === 'dentist' || formData.role === 'laboratory') && (
                    <>
                      <section className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                          <Building className="w-4 h-4 text-primary" /> Informações da Clínica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl bg-background">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Nome do Contato Secundário
                            </Label>
                            <Input
                              value={formData.clinic_contact_name}
                              onChange={(e) =>
                                setFormData({ ...formData, clinic_contact_name: e.target.value })
                              }
                              className="h-9"
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Cargo do Contato
                            </Label>
                            <Input
                              value={formData.clinic_contact_role}
                              onChange={(e) =>
                                setFormData({ ...formData, clinic_contact_role: e.target.value })
                              }
                              className="h-9"
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Telefone da Clínica / Contato
                            </Label>
                            <Input
                              value={formData.clinic_contact_phone}
                              onChange={(e) =>
                                setFormData({ ...formData, clinic_contact_phone: e.target.value })
                              }
                              className="h-9"
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                          <CreditCard className="w-4 h-4 text-primary" /> Faturamento & Condições
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl bg-background">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Dia de Fechamento
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="31"
                              value={formData.closing_date}
                              onChange={(e) =>
                                setFormData({ ...formData, closing_date: e.target.value })
                              }
                              className="h-9"
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Dia de Vencimento
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="31"
                              value={formData.payment_due_date}
                              onChange={(e) =>
                                setFormData({ ...formData, payment_due_date: e.target.value })
                              }
                              className="h-9"
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Acesso e Segurança
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl bg-background">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">E-mail de Login *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Nova Senha</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={
                              editingUser ? 'Preencha apenas para alterar' : 'Senha inicial'
                            }
                            className="h-9 pr-10 normal-case"
                            disabled={!isMasterOrAdmin || saving}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={!isMasterOrAdmin || saving}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {editingUser && (
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-3 w-full text-amber-600 border-amber-200 hover:bg-amber-50"
                            onClick={handleResetPassword}
                            disabled={saving}
                          >
                            <Key className="w-4 h-4 mr-2" /> Redefinir Senha (123456)
                          </Button>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                      <Briefcase className="w-4 h-4 text-primary" /> Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl bg-background">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
                        <Input
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">RG</Label>
                        <Input
                          value={formData.rg}
                          onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">CPF</Label>
                        <Input
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                      <MapPin className="w-4 h-4 text-primary" /> Endereço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-xl bg-background">
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs text-muted-foreground">CEP</Label>
                        <Input
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-3">
                        <Label className="text-xs text-muted-foreground">Endereço</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-1">
                        <Label className="text-xs text-muted-foreground">Número</Label>
                        <Input
                          value={formData.address_number}
                          onChange={(e) =>
                            setFormData({ ...formData, address_number: e.target.value })
                          }
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Complemento</Label>
                        <Input
                          value={formData.address_complement}
                          onChange={(e) =>
                            setFormData({ ...formData, address_complement: e.target.value })
                          }
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-3">
                        <Label className="text-xs text-muted-foreground">Cidade</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-1">
                        <Label className="text-xs text-muted-foreground">Estado</Label>
                        <Input
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="h-9"
                          disabled={!isMasterOrAdmin || saving}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                      <Calendar className="w-4 h-4 text-primary" /> Controle de Horário de Acesso no
                      Sistema
                    </h3>
                    <div className="p-4 border rounded-xl bg-background flex items-center gap-3">
                      <Switch
                        checked={formData.has_access_schedule}
                        onCheckedChange={(c) =>
                          setFormData({ ...formData, has_access_schedule: c })
                        }
                        disabled={!isMasterOrAdmin || saving}
                      />
                      <Label className="text-sm cursor-pointer">
                        Definir horário de acesso ao sistema
                      </Label>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="perfil" className="mt-0">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold">Perfil de Usuário</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione o perfil que melhor se enquadra às responsabilidades para este novo
                      usuário:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ROLES_INFO.filter((r) => r.id !== 'master' || isCurrentUserMaster).map(
                      (role) => {
                        const Icon = role.icon
                        const isSelected = formData.role === role.id
                        return (
                          <div
                            key={role.id}
                            className={cn(
                              'relative p-5 border rounded-xl transition-all flex gap-4 mt-3',
                              isSelected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                : 'hover:border-primary/40 bg-background',
                              isMasterOrAdmin && !saving
                                ? 'cursor-pointer'
                                : 'opacity-80 cursor-not-allowed',
                            )}
                            onClick={() => {
                              if (isMasterOrAdmin && !saving) {
                                setFormData({ ...formData, role: role.id })
                                setSelectedPerms(null)
                              }
                            }}
                          >
                            <div className="bg-[#0f172a] text-[#eab308] border-none font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full absolute -top-2.5 left-4 shadow-sm z-10">
                              {role.category}
                            </div>
                            <div className="mt-1">
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-full flex items-center justify-center',
                                  isSelected
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground',
                                )}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-base mb-1">{role.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                {role.desc}
                              </p>
                              <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                                Permissões padrão do sistema
                              </span>
                            </div>
                            <div className="flex items-center justify-center pt-2 px-2">
                              <div
                                className={cn(
                                  'w-5 h-5 rounded border flex items-center justify-center',
                                  isSelected
                                    ? 'bg-primary border-primary'
                                    : 'border-muted-foreground/30',
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                              </div>
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>

                  {[
                    'receptionist',
                    'technical_assistant',
                    'financial',
                    'relationship_manager',
                  ].includes(formData.role) && (
                    <div className="mt-8">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">Dentistas Atribuídos</h3>
                        <p className="text-sm text-muted-foreground">
                          Selecione os dentistas que este usuário poderá visualizar e gerenciar os
                          pedidos.
                        </p>
                      </div>
                      <div className="border rounded-xl bg-background overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-muted/20 border-b">
                          <span className="font-bold text-sm">
                            Lista de Dentistas ({dentistsList.length})
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-muted-foreground">
                              MARCAR TODAS
                            </span>
                            <Switch
                              checked={isAllDentistsSelected}
                              onCheckedChange={handleToggleAllDentists}
                              disabled={!isMasterOrAdmin || saving}
                            />
                          </div>
                        </div>
                        <div className="p-2 max-h-60 overflow-y-auto space-y-1">
                          {dentistsList.map((dentist) => (
                            <div
                              key={dentist.id}
                              className={cn(
                                'flex items-center gap-3 p-2 hover:bg-muted/10 rounded-lg',
                                isMasterOrAdmin && !saving ? 'cursor-pointer' : 'opacity-80',
                              )}
                              onClick={() => {
                                if (isMasterOrAdmin && !saving) {
                                  toggleDentist(
                                    dentist.id,
                                    !formData.assigned_dentists.includes(dentist.id),
                                  )
                                }
                              }}
                            >
                              <Checkbox
                                checked={formData.assigned_dentists.includes(dentist.id)}
                                onCheckedChange={(c) => toggleDentist(dentist.id, !!c)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={!isMasterOrAdmin || saving}
                              />
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={dentist.avatar_url} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {dentist.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">{dentist.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {dentist.clinic || 'Sem clínica vinculada'}
                                </p>
                              </div>
                            </div>
                          ))}
                          {dentistsList.length === 0 && (
                            <p className="text-sm text-muted-foreground p-4 text-center">
                              Nenhum dentista encontrado no sistema.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="permissoes" className="mt-0">
                  {formData.role === 'master' && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-primary">
                          Acesso Total e Irrestrito
                        </h4>
                        <p className="text-xs text-primary/80 mt-1">
                          Este usuário possui acesso MASTER. Todas as funções e visualizações estão
                          liberadas de forma irrestrita.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold">Configurações Específicas de Permissão</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalize os acessos deste usuário. Estas configurações sobrepõem as
                      permissões padrão do Perfil.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 border rounded-xl mb-6">
                    <div>
                      <h4 className="font-bold text-sm">Permissões Globais</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Conceder todas as permissões de acesso ao sistema de uma vez.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg shadow-sm border">
                      <span className="text-xs font-bold uppercase text-muted-foreground">
                        MARCAR TODAS
                      </span>
                      <Switch
                        checked={formData.role === 'master' ? true : isAllPermsSelected}
                        onCheckedChange={handleToggleAllPerms}
                        disabled={!isMasterOrAdmin || formData.role === 'master' || saving}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {visibleModules.map((mod) => {
                      const hasAccess =
                        formData.role === 'master' ? true : effectivePerms[mod.id]?.access || false
                      return (
                        <Card key={mod.id} className="shadow-none">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm uppercase">{mod.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">
                                  Permitir Acesso
                                </span>
                                <Switch
                                  checked={hasAccess}
                                  onCheckedChange={(c) => updateAccess(mod.id, c)}
                                  disabled={
                                    !isMasterOrAdmin || formData.role === 'master' || saving
                                  }
                                />
                              </div>
                            </div>
                            {mod.actions && mod.actions.length > 0 && hasAccess && (
                              <div className="mt-4 pt-4 border-t space-y-3 pl-2 border-l-2 border-primary/30 ml-1">
                                {mod.actions.length > 1 && (
                                  <div className="flex justify-between items-center pb-2 border-b border-muted/30">
                                    <span className="text-xs font-bold uppercase text-muted-foreground">
                                      MARCAR TODAS
                                    </span>
                                    <Switch
                                      checked={
                                        formData.role === 'master'
                                          ? true
                                          : mod.actions.every(
                                              (act) => effectivePerms[mod.id]?.actions?.[act.id],
                                            )
                                      }
                                      onCheckedChange={(c) => {
                                        if (!isMasterOrAdmin) return
                                        setSelectedPerms((prev) => {
                                          const source = prev ?? effectivePerms
                                          const newPerms = JSON.parse(JSON.stringify(source || {}))
                                          if (!newPerms[mod.id])
                                            newPerms[mod.id] = { access: true, actions: {} }
                                          mod.actions.forEach((act) => {
                                            if (!newPerms[mod.id].actions)
                                              newPerms[mod.id].actions = {}
                                            newPerms[mod.id].actions[act.id] = c
                                          })
                                          return newPerms
                                        })
                                      }}
                                      disabled={
                                        !isMasterOrAdmin || formData.role === 'master' || saving
                                      }
                                    />
                                  </div>
                                )}
                                {mod.actions.map((act) => (
                                  <div
                                    key={act.id}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span>{act.label}</span>
                                    <Switch
                                      checked={
                                        formData.role === 'master'
                                          ? true
                                          : effectivePerms[mod.id]?.actions?.[act.id] || false
                                      }
                                      onCheckedChange={(c) => updateAction(mod.id, act.id, c)}
                                      disabled={
                                        !isMasterOrAdmin || formData.role === 'master' || saving
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {formData.role === 'laboratory' && isCurrentUserMaster && (
                  <TabsContent value="precos" className="mt-0">
                    {!editingUser?.id ? (
                      <div className="p-6 text-center border rounded-xl bg-muted/10 mt-4">
                        <p className="text-sm text-muted-foreground">
                          Salve este novo usuário primeiro para configurar sua tabela de preços
                          personalizada.
                        </p>
                      </div>
                    ) : (
                      <PartnerPricesPanel
                        ref={partnerPricesRef}
                        partnerId={editingUser.id}
                        isReadOnly={false}
                      />
                    )}
                  </TabsContent>
                )}
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter className="p-4 border-t shrink-0 bg-background">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              {isMasterOrAdmin ? 'Cancelar' : 'Fechar'}
            </Button>
            {isMasterOrAdmin && (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
