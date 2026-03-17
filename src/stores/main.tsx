import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import { Order, OrderStatus, KanbanStage, User, UserRole, Stage, DRECategory } from '@/lib/types'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { getOrderFinancials } from '@/lib/financial'

interface AppState {
  currentUser:
    | (User & {
        is_approved?: boolean
        job_function?: string
        is_active?: boolean
        requires_password_change?: boolean
      })
    | null
  orders: any[]
  kanbanStages: Stage[]
  appSettings: Record<string, string>
  pendingUsers: any[]
  priceList: any[]
  dreCategories: DRECategory[]
  loading: boolean
  fetchError: string | null
  selectedLab: string
  Visualizando_Como_ID: string | null
  Visualizando_Como_Name: string | null
  effectiveUserId: string | undefined
  effectiveRole: UserRole | undefined
  setSelectedLab: (lab: string) => void
  setVisualizando_Como: (id: string | null, name: string | null) => void
  switchRole: (role: UserRole) => void
  addOrder: (order: any) => Promise<boolean>
  deleteOrder: (dbId: string, reason: string) => Promise<void>
  updateOrderStatus: (dbId: string, status: OrderStatus, note?: string) => Promise<void>
  updateOrderKanbanStage: (dbId: string, stage: KanbanStage) => Promise<void>
  updateOrderObservations: (dbId: string, observations: string) => Promise<void>
  acknowledgeOrder: (id: string) => Promise<void>
  addKanbanStage: (name: string) => Promise<boolean>
  updateKanbanStage: (id: string, oldName: string, newName: string) => Promise<void>
  updateKanbanStageDescription: (id: string, description: string) => Promise<void>
  deleteKanbanStage: (id: string, oldName: string, fallbackName?: string) => Promise<void>
  reorderKanbanStages: (reorderedStages: Stage[]) => Promise<void>
  updateSetting: (key: string, value: string) => Promise<void>
  updateSettings: (updates: Record<string, string>) => Promise<void>
  updateProfile: (updates: Partial<User & { requires_password_change?: boolean }>) => Promise<void>
  refreshOrders: () => void
  logAudit: (action: string, entityType: string, entityId: string, details?: any) => Promise<void>
  approveUser: (userId: string) => Promise<void>
  rejectUser: (userId: string) => Promise<void>
  addDRECategory: (name: string, type: 'revenue' | 'variable' | 'fixed') => Promise<boolean>
  updateDRECategory: (
    oldName: string,
    newName: string,
    type: 'revenue' | 'variable' | 'fixed',
  ) => Promise<boolean>
  checkPermission: (module: string, action?: string) => boolean
}

const AppContext = createContext<AppState | undefined>(undefined)

const deriveStatus = (stage: string, dbStatus: OrderStatus): OrderStatus => {
  const stg = (stage || '').toUpperCase()
  if (
    stg === 'EM TRIAGEM' ||
    stg === 'TRIAGEM' ||
    stg === 'CAIXA DE ENTRADA' ||
    stg === 'AGUARDANDO RETORNO DO DENTISTA' ||
    stg === 'PENDÊNCIAS' ||
    stg === 'PENDENCIAS'
  ) {
    return 'pending'
  }
  if (stg === 'PRONTO PARA ENVIO' || stg.includes('FINALIZADO') || stg.includes('ENTREGUE')) {
    return dbStatus === 'delivered' ? 'delivered' : 'completed'
  }
  if (dbStatus === 'pending' || dbStatus === 'completed') return 'in_production'
  return dbStatus
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()

  const [currentUser, setCurrentUser] = useState<
    | (User & {
        is_approved?: boolean
        job_function?: string
        is_active?: boolean
        requires_password_change?: boolean
      })
    | null
  >(null)

  const [orders, setOrders] = useState<any[]>([])
  const [kanbanStages, setKanbanStages] = useState<Stage[]>([])
  const [appSettings, setAppSettings] = useState<Record<string, string>>({})
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [priceList, setPriceList] = useState<any[]>([])
  const [dreCategories, setDreCategories] = useState<DRECategory[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const [Visualizando_Como_ID, setVisualizando_Como_ID] = useState<string | null>(() =>
    sessionStorage.getItem('vitali_visualizando_como_id'),
  )
  const [Visualizando_Como_Name, setVisualizando_Como_Name] = useState<string | null>(() =>
    sessionStorage.getItem('vitali_visualizando_como_name'),
  )

  const setVisualizando_Como = useCallback((id: string | null, name: string | null) => {
    if (id && name) {
      sessionStorage.setItem('vitali_visualizando_como_id', id)
      sessionStorage.setItem('vitali_visualizando_como_name', name)
    } else {
      sessionStorage.removeItem('vitali_visualizando_como_id')
      sessionStorage.removeItem('vitali_visualizando_como_name')
    }
    setVisualizando_Como_ID(id)
    setVisualizando_Como_Name(name)
  }, [])

  const effectiveUserId =
    (currentUser?.role === 'master' || currentUser?.role === 'admin') && Visualizando_Como_ID
      ? Visualizando_Como_ID
      : currentUser?.id
  const effectiveRole =
    (currentUser?.role === 'master' || currentUser?.role === 'admin') && Visualizando_Como_ID
      ? 'dentist'
      : currentUser?.role

  const hasFetchedOrders = useRef(false)

  const fetchOrdersRef = useRef<() => void>(() => {})
  const fetchStagesRef = useRef<() => void>(() => {})
  const fetchSettingsRef = useRef<() => void>(() => {})
  const fetchPriceListRef = useRef<() => void>(() => {})
  const fetchDRECategoriesRef = useRef<() => void>(() => {})
  const fetchPendingUsersRef = useRef<() => void>(() => {})

  const roleRef = useRef<string | undefined>(undefined)
  const idRef = useRef<string | undefined>(undefined)

  roleRef.current = currentUser?.role
  idRef.current = currentUser?.id

  const [selectedLab, setSelectedLab] = useState<string>(
    () => localStorage.getItem('vitali_selected_lab') || 'Soluções Cerâmicas',
  )

  useEffect(() => {
    localStorage.setItem('vitali_selected_lab', selectedLab)
  }, [selectedLab])

  const fetchProfile = async () => {
    if (!session?.user) {
      setCurrentUser(null)
      setOrders([])
      setKanbanStages([])
      setAppSettings({})
      setPendingUsers([])
      setPriceList([])
      setDreCategories([])
      setProfileLoading(false)
      hasFetchedOrders.current = false
      setVisualizando_Como(null, null)
      return
    }
    if (currentUser?.id !== session.user.id) setProfileLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
    if (data) {
      setCurrentUser({
        id: data.id,
        name: data.name,
        role: data.role as UserRole,
        job_function: data.job_function,
        clinic: data.clinic,
        whatsapp_group_link: data.whatsapp_group_link,
        avatar_url: data.avatar_url,
        permissions: data.permissions || {},
        is_approved: data.is_approved,
        is_active: data.is_active !== false,
        requires_password_change: data.requires_password_change,
        assigned_dentists: data.assigned_dentists,
        can_move_kanban_cards: data.can_move_kanban_cards,
      })

      const now = new Date()
      const lastAccess = data.last_access_at ? new Date(data.last_access_at) : null
      if (!lastAccess || now.getTime() - lastAccess.getTime() > 1000 * 60 * 60) {
        supabase
          .from('profiles')
          .update({ last_access_at: now.toISOString() })
          .eq('id', session.user.id)
          .then()
      }
    } else {
      setCurrentUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Usuário',
        role: session.user.user_metadata?.role || 'dentist',
        clinic: session.user.user_metadata?.clinic,
        permissions: {},
        is_approved: false,
        is_active: true,
        requires_password_change: false,
      })
    }
    setProfileLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user?.id])

  const checkPermission = useCallback(
    (module: string, action?: string) => {
      if (!currentUser) return false

      const roleToUse =
        (currentUser.role === 'master' || currentUser.role === 'admin') && Visualizando_Como_ID
          ? 'dentist'
          : currentUser.role

      if (roleToUse === 'master') return true

      let perms: any = currentUser.permissions

      if (
        roleToUse !== currentUser.role ||
        !perms ||
        Array.isArray(perms) ||
        Object.keys(perms).length === 0
      ) {
        try {
          const defaults = JSON.parse(appSettings['role_permissions_v2'] || '{}')
          perms = defaults[roleToUse] || {}
        } catch (e) {
          perms = {}
        }
      }

      const modPerms = perms[module]
      if (!modPerms) return false

      if (action) {
        return modPerms.actions?.[action] === true
      }
      return modPerms.access === true
    },
    [currentUser, appSettings, Visualizando_Como_ID],
  )

  const fetchStages = useCallback(async () => {
    const { data } = await supabase
      .from('kanban_stages')
      .select('*')
      .order('order_index', { ascending: true })
    if (data)
      setKanbanStages(
        data.map((s: any) => ({
          id: s.id,
          name: s.name,
          orderIndex: s.order_index,
          description: s.description,
        })),
      )
  }, [])

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('app_settings').select('*')
    if (data) {
      const settings = data.reduce((acc: any, row: any) => {
        acc[row.key] = row.value
        return acc
      }, {})
      setAppSettings((prev) =>
        JSON.stringify(prev) === JSON.stringify(settings) ? prev : settings,
      )
    }
  }, [])

  const fetchPendingUsers = useCallback(async () => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'master')) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
    if (data) setPendingUsers(data)
  }, [currentUser])

  const fetchPriceList = useCallback(async () => {
    const { data } = await supabase
      .from('price_list')
      .select('id, work_type, sector, price, material, price_stages(*)')
      .order('work_type', { ascending: true })
    if (data) {
      const sorted = data.sort((a, b) =>
        (a.work_type || '').localeCompare(b.work_type || '', 'pt-BR'),
      )
      setPriceList(sorted)
    }
  }, [])

  const fetchDRECategories = useCallback(async () => {
    const { data } = await supabase
      .from('dre_categories' as any)
      .select('*')
      .order('name', { ascending: true })
    if (data) {
      const sorted = data.sort((a: any, b: any) =>
        (a.name || '').localeCompare(b.name || '', 'pt-BR'),
      )
      setDreCategories(sorted as DRECategory[])
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!session?.user || !currentUser) return
    if (!hasFetchedOrders.current) setLoading(true)

    const canViewAll =
      currentUser.role === 'admin' ||
      currentUser.role === 'master' ||
      checkPermission('inbox', 'view_all') ||
      checkPermission('kanban', 'view_all') ||
      ['receptionist', 'technical_assistant', 'financial', 'relationship_manager'].includes(
        currentUser.role,
      )

    let query = supabase
      .from('orders')
      .select(
        `*, profiles!orders_dentist_id_fkey(name, clinic, whatsapp_group_link, commercial_agreement, role), creator:profiles!orders_created_by_fkey(name, role), order_history(*)`,
      )
      .order('created_at', { ascending: false })

    if (!canViewAll) {
      if (currentUser.role === 'dentist' || currentUser.role === 'laboratory') {
        query = query.eq('dentist_id', currentUser.id)
      } else if (currentUser.assigned_dentists && currentUser.assigned_dentists.length > 0) {
        query = query.in('dentist_id', currentUser.assigned_dentists)
      } else {
        setOrders([])
        hasFetchedOrders.current = true
        setLoading(false)
        return
      }
    }

    const { data: dbOrders, error } = await query

    let finalOrders = dbOrders
    if (error) {
      console.warn('Orders fetch error (might be missing creator relation), falling back:', error)
      let fallbackQuery = supabase
        .from('orders')
        .select(
          `*, profiles!orders_dentist_id_fkey(name, clinic, whatsapp_group_link, commercial_agreement, role), order_history(*)`,
        )
        .order('created_at', { ascending: false })

      if (!canViewAll) {
        if (currentUser.role === 'dentist' || currentUser.role === 'laboratory') {
          fallbackQuery = fallbackQuery.eq('dentist_id', currentUser.id)
        } else if (currentUser.assigned_dentists && currentUser.assigned_dentists.length > 0) {
          fallbackQuery = fallbackQuery.in('dentist_id', currentUser.assigned_dentists)
        }
      }

      const { data: fallbackOrders, error: fallbackError } = await fallbackQuery
      if (fallbackError) {
        setFetchError(
          'Problema de comunicação com o servidor ao carregar os pedidos. Verifique sua conexão e tente novamente.',
        )
      } else {
        setFetchError(null)
      }
      finalOrders = fallbackOrders
    } else {
      setFetchError(null)
    }

    if (finalOrders) {
      setOrders(
        finalOrders.map((o: any) => {
          const teethCount = o.tooth_or_arch?.teeth?.length || 0
          const archesCount = o.tooth_or_arch?.arches?.length || 0
          const quantity = Math.max(1, teethCount + archesCount)
          const basePrice = o.base_price || 0
          const discount = o.profiles?.commercial_agreement || 0
          const unitPrice =
            quantity > 0 && discount < 100 ? basePrice / (1 - discount / 100) / quantity : 0

          return {
            id: o.id,
            friendlyId: o.friendly_id,
            patientName: o.patient_name,
            patientCpf: o.patient_cpf,
            patientBirthDate: o.patient_birth_date,
            dentistId: o.dentist_id,
            dentistName: o.profiles?.name || 'Desconhecido',
            dentistClinic: o.profiles?.clinic || '',
            dentistGroupLink: o.profiles?.whatsapp_group_link || '',
            dentistDiscount: discount,
            dentistRole: o.profiles?.role || 'dentist',
            sector: o.sector,
            kanbanStage: o.kanban_stage,
            workType: o.work_type,
            material: o.material,
            teeth: o.tooth_or_arch?.teeth || [],
            arches: o.tooth_or_arch?.arches || [],
            shade: o.color_and_considerations,
            shadeScale: o.scale_used,
            shippingMethod: o.shipping_method,
            stlDeliveryMethod: o.shipping_details,
            observations: o.observations,
            status: deriveStatus(o.kanban_stage, o.status),
            isAcknowledged: o.is_acknowledged || false,
            createdAt: o.created_at,
            clearedBalance: o.cleared_balance || 0,
            basePrice,
            unitPrice,
            quantity,
            dre_category: o.dre_category,
            fileUrls: o.file_urls || [],
            implantBrand: o.implant_brand,
            implantType: o.implant_type,
            estruturaFixacao: o.estrutura_fixacao || 'SOBRE DENTE',
            settlementId: o.settlement_id,
            isAdjustmentReturn: o.is_adjustment_return || false,
            createdBy: o.creator
              ? { id: o.created_by, name: o.creator.name, role: o.creator.role }
              : undefined,
            history: (o.order_history || [])
              .sort(
                (a: any, b: any) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              )
              .map((h: any) => ({ id: h.id, status: h.status, date: h.created_at, note: h.note })),
          }
        }),
      )
    }
    hasFetchedOrders.current = true
    setLoading(false)
  }, [session?.user, currentUser, checkPermission])

  fetchOrdersRef.current = fetchOrders
  fetchStagesRef.current = fetchStages
  fetchSettingsRef.current = fetchSettings
  fetchPriceListRef.current = fetchPriceList
  fetchDRECategoriesRef.current = fetchDRECategories
  fetchPendingUsersRef.current = fetchPendingUsers

  useEffect(() => {
    if (!currentUser?.id) return

    fetchOrdersRef.current()
    fetchStagesRef.current()
    fetchSettingsRef.current()
    fetchPriceListRef.current()
    fetchDRECategoriesRef.current()
    if (roleRef.current === 'admin' || roleRef.current === 'master') {
      fetchPendingUsersRef.current()
    }

    const channel = supabase
      .channel('app-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () =>
        fetchOrdersRef.current(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_stages' }, () =>
        fetchStagesRef.current(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () =>
        fetchSettingsRef.current(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'price_list' }, () =>
        fetchPriceListRef.current(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dre_categories' }, () =>
        fetchDRECategoriesRef.current(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (roleRef.current === 'admin' || roleRef.current === 'master') {
          fetchPendingUsersRef.current()
        }

        if (payload.new && idRef.current && payload.new.id === idRef.current) {
          setCurrentUser((prev: any) =>
            prev
              ? {
                  ...prev,
                  is_approved: payload.new.is_approved,
                  is_active: payload.new.is_active,
                  requires_password_change: payload.new.requires_password_change,
                  permissions: payload.new.permissions || {},
                  role: payload.new.role,
                  assigned_dentists: payload.new.assigned_dentists,
                  can_move_kanban_cards: payload.new.can_move_kanban_cards,
                }
              : prev,
          )
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser?.id])

  const computedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []

    let baseOrders = orders

    const roleToUse =
      (currentUser?.role === 'master' || currentUser?.role === 'admin') && Visualizando_Como_ID
        ? 'dentist'
        : currentUser?.role

    const canViewAll =
      currentUser &&
      (roleToUse === 'admin' ||
        roleToUse === 'master' ||
        checkPermission('inbox', 'view_all') ||
        checkPermission('kanban', 'view_all') ||
        ['receptionist', 'technical_assistant', 'financial', 'relationship_manager'].includes(
          roleToUse || '',
        ))

    if ((currentUser?.role === 'master' || currentUser?.role === 'admin') && Visualizando_Como_ID) {
      baseOrders = baseOrders.filter((o) => o.dentistId === Visualizando_Como_ID)
    } else if (!canViewAll && currentUser) {
      if (roleToUse !== 'dentist' && roleToUse !== 'laboratory') {
        if (!currentUser.assigned_dentists || currentUser.assigned_dentists.length === 0) {
          return []
        } else {
          baseOrders = baseOrders.filter((o) =>
            currentUser.assigned_dentists!.includes(o.dentistId),
          )
        }
      }
    }

    return baseOrders.map((o) => {
      let unitPrice = o.unitPrice || 0
      let basePrice = o.basePrice || 0
      const discount = o.dentistDiscount || 0

      if (
        !o.isAdjustmentReturn &&
        o.dentistRole !== 'laboratory' &&
        priceList &&
        priceList.length > 0
      ) {
        const priceItem =
          priceList.find(
            (p) => p.work_type === o.workType && (!p.sector || p.sector === o.sector),
          ) || priceList.find((p) => p.work_type === o.workType)

        if (priceItem && priceItem.price != null) {
          const numericString = String(priceItem.price)
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
          const parsed = parseFloat(numericString)
          if (!isNaN(parsed) && parsed > 0) {
            unitPrice = parsed
            basePrice = unitPrice * o.quantity * (1 - discount / 100)
          }
        }
      }

      if (unitPrice === 0 && o.quantity > 0 && !o.isAdjustmentReturn) {
        unitPrice = discount < 100 ? basePrice / (1 - discount / 100) / o.quantity : 0
      }

      if (o.isAdjustmentReturn) {
        unitPrice = 0
        basePrice = 0
      }

      const effectiveUnitPrice = unitPrice * (1 - discount / 100)

      return {
        ...o,
        unitPrice,
        effectiveUnitPrice,
        basePrice,
      }
    })
  }, [orders, priceList, currentUser, checkPermission, Visualizando_Como_ID])

  const addDRECategory = async (name: string, type: 'revenue' | 'variable' | 'fixed') => {
    const { error } = await supabase
      .from('dre_categories' as any)
      .insert({ name, category_type: type })
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      return false
    }
    toast({ title: 'Categoria adicionada com sucesso!' })
    fetchDRECategories()
    return true
  }

  const updateDRECategory = async (
    oldName: string,
    newName: string,
    type: 'revenue' | 'variable' | 'fixed',
  ) => {
    const { error } = await supabase
      .from('dre_categories' as any)
      .update({ name: newName, category_type: type })
      .eq('name', oldName)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a categoria. ' + error.message,
        variant: 'destructive',
      })
      return false
    }
    toast({ title: 'Categoria atualizada com sucesso!' })
    fetchDRECategories()
    return true
  }

  const approveUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('id', userId)
    if (!error) {
      toast({ title: 'Usuário aprovado!' })
      setPendingUsers((p) => p.filter((u) => u.id !== userId))
    }
  }

  const rejectUser = async (userId: string) => {
    const { error } = await supabase.rpc('delete_user', { target_user_id: userId })
    if (!error) {
      toast({ title: 'Usuário rejeitado!' })
      setPendingUsers((p) => p.filter((u) => u.id !== userId))
    }
  }

  const logAudit = async (
    action: string,
    entityType: string,
    entityId: string,
    details: any = {},
  ) => {
    if (!currentUser) return
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    } as any)
  }

  const switchRole = () => {}

  const addOrder = async (orderData: any): Promise<boolean> => {
    if (!currentUser) return false

    let targetDentistId = currentUser.id
    if ((currentUser.role === 'master' || currentUser.role === 'admin') && Visualizando_Como_ID) {
      targetDentistId = Visualizando_Como_ID
    } else if (
      (currentUser.role === 'admin' ||
        currentUser.role === 'master' ||
        ['receptionist', 'technical_assistant', 'financial', 'relationship_manager'].includes(
          currentUser.role,
        )) &&
      orderData.dentistId
    ) {
      targetDentistId = orderData.dentistId
    }

    const { data: dentistProfile } = await supabase
      .from('profiles' as any)
      .select('commercial_agreement, role')
      .eq('id', targetDentistId)
      .maybeSingle()

    const discountPercent = dentistProfile?.commercial_agreement || 0

    const priceItem =
      priceList.find(
        (p) => p.work_type === orderData.workType && (!p.sector || p.sector === orderData.sector),
      ) || priceList.find((p) => p.work_type === orderData.workType)

    let unitPrice = 0

    if (priceItem) {
      const { data: customPrice } = await supabase
        .from('partner_prices')
        .select('custom_price, is_enabled')
        .eq('partner_id', targetDentistId)
        .eq('price_list_id', priceItem.id)
        .maybeSingle()

      if (customPrice && customPrice.is_enabled) {
        unitPrice = Number(customPrice.custom_price)
      } else if (customPrice && !customPrice.is_enabled) {
        toast({
          title: 'Erro',
          description: 'Procedimento desabilitado para este parceiro.',
          variant: 'destructive',
        })
        return false
      } else if (priceItem.price != null) {
        const numericString = String(priceItem.price)
          .replace(/[^\d,.-]/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
        unitPrice = !isNaN(parseFloat(numericString)) ? parseFloat(numericString) : 0
      }
    }

    const teethCount = orderData.teeth?.length || 0
    const archesCount = orderData.arches?.length || 0
    const quantity = Math.max(1, teethCount + archesCount)
    const basePrice = orderData.isAdjustmentReturn
      ? 0
      : unitPrice * quantity * (1 - discountPercent / 100)

    const { data, error } = await supabase
      .from('orders')
      .insert({
        patient_name: orderData.patientName,
        patient_cpf: orderData.patientCpf || null,
        patient_birth_date: orderData.patientBirthDate || null,
        dentist_id: targetDentistId,
        created_by: currentUser.id,
        sector: orderData.sector,
        kanban_stage: kanbanStages[0]?.name || 'EM TRIAGEM',
        work_type: orderData.workType,
        material: orderData.material,
        tooth_or_arch: { teeth: orderData.teeth, arches: orderData.arches },
        color_and_considerations: orderData.shade,
        scale_used: orderData.shadeScale,
        shipping_method: orderData.shippingMethod,
        shipping_details: orderData.stlDeliveryMethod,
        observations: orderData.observations,
        status: 'pending',
        base_price: basePrice,
        file_urls: orderData.fileUrls || [],
        implant_brand: orderData.implantBrand || null,
        implant_type: orderData.implantType || null,
        estrutura_fixacao: orderData.estruturaFixacao || 'SOBRE DENTE',
        is_adjustment_return: orderData.isAdjustmentReturn || false,
      } as any)
      .select()
      .single()

    if (error) {
      toast({ title: 'Erro ao criar pedido', description: error.message, variant: 'destructive' })
      return false
    }

    if (data) {
      await logAudit('CREATE', 'order', data.id, {
        friendlyId: data.friendly_id,
        patientName: orderData.patientName,
        basePrice,
      })
      await fetchOrders()
      toast({ title: 'Pedido enviado!' })
      return true
    }

    return false
  }

  const deleteOrder = async (dbId: string, reason: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'master') return

    const orderToDelete = orders.find((o) => o.id === dbId)

    await supabase.from('expenses').delete().eq('order_id', dbId)

    const { error } = await supabase.from('orders').delete().eq('id', dbId)
    if (!error) {
      if (orderToDelete) {
        await logAudit('DELETE', 'order', dbId, {
          reason,
          friendlyId: orderToDelete.friendlyId,
          patientName: orderToDelete.patientName,
        })
      }
      toast({
        title: 'Pedido Excluído',
        description: 'O pedido e seus dados associados foram removidos.',
      })
      fetchOrders()
    } else {
      toast({
        title: 'Erro ao excluir pedido',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const updateOrderStatus = async (dbId: string, status: OrderStatus, note?: string) => {
    const newHistoryEntry = {
      id: crypto.randomUUID(),
      status,
      date: new Date().toISOString(),
      note,
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === dbId ? { ...o, status, history: [newHistoryEntry, ...o.history] } : o,
      ),
    )

    await supabase.from('order_history').insert({ order_id: dbId, status, note })
    await supabase.from('orders').update({ status }).eq('id', dbId)
  }

  const acknowledgeOrder = async (dbId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === dbId ? { ...o, isAcknowledged: true } : o)))
    await supabase.from('orders').update({ is_acknowledged: true }).eq('id', dbId)
  }

  const updateOrderKanbanStage = async (dbId: string, stage: KanbanStage) => {
    if (!currentUser) return
    const order = orders.find((o) => o.id === dbId)
    if (!order) return

    const newStatus = deriveStatus(stage, order.status)
    const shouldAcknowledge =
      !order.isAcknowledged && (newStatus === 'in_production' || newStatus === 'completed')

    const newHistoryEntry = {
      id: crypto.randomUUID(),
      status: newStatus,
      date: new Date().toISOString(),
      note: `Movido para ${stage}`,
    }

    const updatedOrder = { ...order, kanbanStage: stage, status: newStatus }
    const financials = getOrderFinancials(updatedOrder, priceList)

    setOrders((prev) =>
      prev.map((o) =>
        o.id === dbId
          ? {
              ...o,
              kanbanStage: stage,
              status: newStatus,
              basePrice: financials.basePrice,
              isAcknowledged: shouldAcknowledge ? true : o.isAcknowledged,
              history: [newHistoryEntry, ...o.history],
            }
          : o,
      ),
    )

    await supabase.from('order_history').insert({
      order_id: dbId,
      status: newStatus,
      note: `Movido para ${stage}`,
    })

    const updates: any = { kanban_stage: stage, status: newStatus }
    if (shouldAcknowledge) updates.is_acknowledged = true
    if (order.basePrice === 0 && financials.basePrice > 0 && !order.isAdjustmentReturn) {
      updates.base_price = financials.basePrice
    }

    await supabase.from('orders').update(updates).eq('id', dbId)

    if (newStatus === 'completed' && order.status !== 'completed' && order.status !== 'delivered') {
      if (financials.totalCost > 0) {
        await supabase.from('expenses').insert({
          description: `Serviço Concluído: Pedido ${order.friendlyId} - ${order.patientName}`,
          cost_center: order.dentistName || 'Dentista',
          dentist_id: order.dentistId,
          order_id: dbId,
          amount: financials.totalCost,
          due_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          sector: order.sector,
          category: 'Serviços Realizados',
          dre_category: order.dre_category || 'Receita',
        } as any)
      }
    }
  }

  const updateOrderObservations = async (dbId: string, observations: string) => {
    await supabase.from('orders').update({ observations }).eq('id', dbId)
  }

  const addKanbanStage = async (name: string): Promise<boolean> => {
    const nextIndex =
      kanbanStages.length > 0 ? Math.max(...kanbanStages.map((s) => s.orderIndex)) + 1 : 1
    const { error } = await supabase
      .from('kanban_stages')
      .insert({ name: name.trim().toUpperCase(), order_index: nextIndex })
    return !error
  }

  const updateKanbanStage = async (id: string, oldName: string, newName: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'master') return
    await supabase.from('kanban_stages').update({ name: newName.trim().toUpperCase() }).eq('id', id)
  }

  const updateKanbanStageDescription = async (id: string, description: string) => {
    await supabase.from('kanban_stages').update({ description }).eq('id', id)
  }

  const deleteKanbanStage = async (id: string, oldName: string, fallbackName?: string) => {
    if (fallbackName)
      await supabase
        .from('orders')
        .update({ kanban_stage: fallbackName })
        .eq('kanban_stage', oldName)
    await supabase.from('kanban_stages').delete().eq('id', id)
  }

  const reorderKanbanStages = async (reorderedStages: Stage[]) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'master') return
    setKanbanStages(reorderedStages)
    const updates = reorderedStages.map((stage, index) =>
      supabase
        .from('kanban_stages')
        .update({ order_index: index + 1 })
        .eq('id', stage.id),
    )
    await Promise.all(updates)
  }

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (!error) {
      setAppSettings((prev) => ({ ...prev, [key]: value }))
    }
  }

  const updateSettings = async (updates: Record<string, string>) => {
    const rows = Object.entries(updates).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('app_settings').upsert(rows)
    if (!error) {
      setAppSettings((prev) => ({ ...prev, ...updates }))
    }
  }

  const updateProfile = async (updates: Partial<User & { requires_password_change?: boolean }>) => {
    if (!currentUser) return
    const { error } = await supabase.from('profiles').update(updates).eq('id', currentUser.id)
    if (!error) {
      setCurrentUser((prev) => (prev ? ({ ...prev, ...updates } as any) : prev))
      toast({ title: 'Perfil atualizado' })
    }
  }

  if (session && profileLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium">Carregando...</div>
    )

  return (
    <AppContext.Provider
      value={{
        currentUser: currentUser as any,
        orders: computedOrders,
        kanbanStages,
        appSettings,
        pendingUsers,
        priceList,
        dreCategories,
        loading,
        fetchError,
        selectedLab,
        setSelectedLab,
        Visualizando_Como_ID,
        Visualizando_Como_Name,
        effectiveUserId,
        effectiveRole,
        setVisualizando_Como,
        switchRole,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        updateOrderKanbanStage,
        updateOrderObservations,
        acknowledgeOrder,
        addKanbanStage,
        updateKanbanStage,
        updateKanbanStageDescription,
        deleteKanbanStage,
        reorderKanbanStages,
        updateSetting,
        updateSettings,
        updateProfile,
        refreshOrders: fetchOrders,
        logAudit,
        approveUser,
        rejectUser,
        addDRECategory,
        updateDRECategory,
        checkPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
