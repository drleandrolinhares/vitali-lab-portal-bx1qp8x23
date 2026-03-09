import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react'
import { Order, OrderStatus, KanbanStage, User, UserRole, Stage, DRECategory } from '@/lib/types'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { getOrderFinancials } from '@/lib/financial'

interface AppState {
  currentUser: User & { is_approved?: boolean }
  orders: any[]
  kanbanStages: Stage[]
  appSettings: Record<string, string>
  pendingUsers: any[]
  priceList: any[]
  dreCategories: DRECategory[]
  loading: boolean
  selectedLab: string
  setSelectedLab: (lab: string) => void
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
  updateProfile: (updates: Partial<User>) => Promise<void>
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
}

const AppContext = createContext<AppState | undefined>(undefined)

const deriveStatus = (stage: string, dbStatus: OrderStatus): OrderStatus => {
  const stg = (stage || '').toUpperCase()
  if (stg === 'TRIAGEM' || stg === 'CAIXA DE ENTRADA' || stg === 'PENDÊNCIAS') {
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
  const [currentUser, setCurrentUser] = useState<(User & { is_approved?: boolean }) | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [kanbanStages, setKanbanStages] = useState<Stage[]>([])
  const [appSettings, setAppSettings] = useState<Record<string, string>>({})
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [priceList, setPriceList] = useState<any[]>([])
  const [dreCategories, setDreCategories] = useState<DRECategory[]>([])
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  const hasFetchedOrders = useRef(false)

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
      setAppSettings([])
      setPendingUsers([])
      setPriceList([])
      setDreCategories([])
      setProfileLoading(false)
      hasFetchedOrders.current = false
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
        clinic: data.clinic,
        whatsapp_group_link: data.whatsapp_group_link,
        avatar_url: data.avatar_url,
        permissions: data.permissions || [],
        is_approved: data.is_approved,
      })
    } else {
      setCurrentUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Usuário',
        role: session.user.user_metadata?.role || 'dentist',
        clinic: session.user.user_metadata?.clinic,
        permissions: [],
        is_approved: false,
      })
    }
    setProfileLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user?.id])

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
      setAppSettings(settings)
    }
  }, [])

  const fetchPendingUsers = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') return
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
      .select('id, work_type, sector, price, price_stages(*)')
    if (data) setPriceList(data)
  }, [])

  const fetchDRECategories = useCallback(async () => {
    const { data } = await supabase
      .from('dre_categories' as any)
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setDreCategories(data as DRECategory[])
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!session?.user || !currentUser) return
    if (!hasFetchedOrders.current) setLoading(true)
    const { data: dbOrders } = await supabase
      .from('orders')
      .select(
        `*, profiles!orders_dentist_id_fkey(name, clinic, whatsapp_group_link), order_history(*)`,
      )
      .order('created_at', { ascending: false })

    if (dbOrders) {
      setOrders(
        dbOrders.map((o: any) => ({
          id: o.id,
          friendlyId: o.friendly_id,
          patientName: o.patient_name,
          patientCpf: o.patient_cpf,
          patientBirthDate: o.patient_birth_date,
          dentistId: o.dentist_id,
          dentistName: o.profiles?.name || 'Desconhecido',
          dentistClinic: o.profiles?.clinic || '',
          dentistGroupLink: o.profiles?.whatsapp_group_link || '',
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
          basePrice: o.base_price || 0,
          dre_category: o.dre_category,
          history: (o.order_history || [])
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            .map((h: any) => ({ id: h.id, status: h.status, date: h.created_at, note: h.note })),
        })),
      )
    }
    hasFetchedOrders.current = true
    setLoading(false)
  }, [session?.user, currentUser])

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
      fetchStages()
      fetchSettings()
      fetchPriceList()
      fetchDRECategories()
      if (currentUser.role === 'admin') fetchPendingUsers()

      const channel = supabase
        .channel('app-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () =>
          fetchOrders(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_stages' }, () =>
          fetchStages(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () =>
          fetchSettings(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'price_list' }, () =>
          fetchPriceList(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dre_categories' }, () =>
          fetchDRECategories(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          if (currentUser.role === 'admin') fetchPendingUsers()
          if (payload.new && payload.new.id === currentUser.id) {
            setCurrentUser((prev: any) =>
              prev ? { ...prev, is_approved: payload.new.is_approved } : prev,
            )
          }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [
    currentUser?.id,
    currentUser?.role,
    fetchOrders,
    fetchStages,
    fetchSettings,
    fetchPriceList,
    fetchPendingUsers,
    fetchDRECategories,
  ])

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
    })
  }

  const switchRole = () => {}

  const addOrder = async (orderData: any): Promise<boolean> => {
    if (!currentUser) return false
    const targetDentistId =
      (currentUser.role === 'admin' || currentUser.role === 'receptionist') && orderData.dentistId
        ? orderData.dentistId
        : currentUser.id

    const priceItem =
      priceList.find(
        (p) => p.work_type === orderData.workType && (!p.sector || p.sector === orderData.sector),
      ) || priceList.find((p) => p.work_type === orderData.workType)

    let basePrice = 0
    if (priceItem && priceItem.price) {
      const numericString = String(priceItem.price)
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
      basePrice = parseFloat(numericString) || 0
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        patient_name: orderData.patientName,
        patient_cpf: orderData.patientCpf || null,
        patient_birth_date: orderData.patientBirthDate || null,
        dentist_id: targetDentistId,
        sector: orderData.sector,
        kanban_stage: kanbanStages[0]?.name || 'TRIAGEM',
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
      })
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
    if (currentUser?.role !== 'admin') return

    const orderToDelete = orders.find((o) => o.id === dbId)

    // Cascading deletion for financial records (since constraint might be SET NULL)
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
    if (order.basePrice === 0 && financials.basePrice > 0) {
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
    if (currentUser?.role !== 'admin') return
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
    if (currentUser?.role !== 'admin') return
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
    await supabase.from('app_settings').upsert({ key, value, updated_at: new Date().toISOString() })
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return
    const { error } = await supabase.from('profiles').update(updates).eq('id', currentUser.id)
    if (!error) {
      setCurrentUser({ ...currentUser, ...updates } as any)
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
        orders,
        kanbanStages,
        appSettings,
        pendingUsers,
        priceList,
        dreCategories,
        loading,
        selectedLab,
        setSelectedLab,
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
        updateProfile,
        refreshOrders: fetchOrders,
        logAudit,
        approveUser,
        rejectUser,
        addDRECategory,
        updateDRECategory,
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
