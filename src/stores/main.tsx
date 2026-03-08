import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { Order, OrderStatus, KanbanStage, User, UserRole, Stage } from '@/lib/types'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface AppState {
  currentUser: User & { is_approved?: boolean }
  orders: any[]
  kanbanStages: Stage[]
  appSettings: Record<string, string>
  pendingUsers: any[]
  priceList: any[]
  loading: boolean
  selectedLab: string
  setSelectedLab: (lab: string) => void
  switchRole: (role: UserRole) => void
  addOrder: (order: any) => Promise<void>
  deleteOrder: (dbId: string, reason: string) => Promise<void>
  updateOrderStatus: (dbId: string, status: OrderStatus, note?: string) => Promise<void>
  updateOrderKanbanStage: (dbId: string, stage: KanbanStage) => Promise<void>
  updateOrderObservations: (dbId: string, observations: string) => Promise<void>
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
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [currentUser, setCurrentUser] = useState<(User & { is_approved?: boolean }) | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [kanbanStages, setKanbanStages] = useState<Stage[]>([])
  const [appSettings, setAppSettings] = useState<Record<string, string>>({})
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [priceList, setPriceList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

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
      setProfileLoading(false)
      return
    }

    if (currentUser?.id !== session.user.id) {
      setProfileLoading(true)
    }

    const { data } = await supabase
      .from('profiles' as any)
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
      } as any)
    } else {
      setCurrentUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Usuário',
        role: session.user.user_metadata?.role || 'dentist',
        clinic: session.user.user_metadata?.clinic,
        permissions: [],
        is_approved: false,
      } as any)
    }
    setProfileLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user?.id])

  const fetchStages = useCallback(async () => {
    const { data } = await supabase
      .from('kanban_stages' as any)
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
    const { data } = await supabase.from('app_settings' as any).select('*')
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
      .from('profiles' as any)
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
    if (data) setPendingUsers(data)
  }, [currentUser])

  const fetchPriceList = useCallback(async () => {
    const { data } = await supabase
      .from('price_list' as any)
      .select('id, work_type, sector, price_stages(*)')
    if (data) setPriceList(data)
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!session?.user || !currentUser) return
    setLoading(true)
    const { data: dbOrders } = await supabase
      .from('orders' as any)
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
          status: o.status,
          createdAt: o.created_at,
          clearedBalance: o.cleared_balance || 0,
          history: (o.order_history || [])
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            .map((h: any) => ({
              id: h.id,
              status: h.status,
              date: h.created_at,
              note: h.note,
            })),
        })),
      )
    }
    setLoading(false)
  }, [session?.user, currentUser])

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
      fetchStages()
      fetchSettings()
      fetchPriceList()
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'price_stages' }, () =>
          fetchPriceList(),
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
  ])

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles' as any)
      .update({ is_approved: true })
      .eq('id', userId)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar o usuário.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Usuário aprovado com sucesso!' })
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  const rejectUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles' as any)
      .delete()
      .eq('id', userId)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível rejeitar o usuário.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Usuário rejeitado e removido do sistema.' })
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  const logAudit = async (
    action: string,
    entityType: string,
    entityId: string,
    details: any = {},
  ) => {
    if (!currentUser) return
    await supabase.from('audit_logs' as any).insert({
      user_id: currentUser.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    })
  }

  const switchRole = () => toast({ title: 'Aviso', description: 'Modo demonstração desativado.' })

  const addOrder = async (orderData: any) => {
    if (!currentUser) return
    const defaultStage = kanbanStages.length > 0 ? kanbanStages[0].name : 'TRIAGEM'

    const targetDentistId =
      (currentUser.role === 'admin' || currentUser.role === 'receptionist') && orderData.dentistId
        ? orderData.dentistId
        : currentUser.id

    const { data, error } = await supabase
      .from('orders' as any)
      .insert({
        patient_name: orderData.patientName,
        patient_cpf: orderData.patientCpf || null,
        patient_birth_date: orderData.patientBirthDate || null,
        dentist_id: targetDentistId,
        sector: orderData.sector,
        kanban_stage: defaultStage,
        work_type: orderData.workType,
        material: orderData.material,
        tooth_or_arch: { teeth: orderData.teeth, arches: orderData.arches },
        color_and_considerations: orderData.shade,
        scale_used: orderData.shadeScale,
        shipping_method: orderData.shippingMethod,
        shipping_details: orderData.stlDeliveryMethod,
        observations: orderData.observations,
        status: 'pending',
      })
      .select()
      .single()

    if (error)
      return toast({
        title: 'Erro',
        description: 'Não foi possível salvar.',
        variant: 'destructive',
      })
    if (data)
      await logAudit('CREATE', 'order', data.id, {
        friendlyId: data.friendly_id,
        patientName: orderData.patientName,
      })

    toast({ title: 'Pedido enviado!' })
  }

  const deleteOrder = async (dbId: string, reason: string) => {
    if (currentUser?.role !== 'admin') return
    const order = orders.find((o) => o.id === dbId)
    if (!order) return

    setOrders((prev) => prev.filter((o) => o.id !== dbId))

    const { error } = await supabase
      .from('orders' as any)
      .delete()
      .eq('id', dbId)

    if (error) {
      fetchOrders()
      return toast({
        title: 'Erro',
        description: 'Não foi possível excluir o pedido.',
        variant: 'destructive',
      })
    }

    await logAudit('DELETE_ORDER', 'order', dbId, {
      friendlyId: order.friendlyId,
      reason,
      patientName: order.patientName,
    })
    toast({ title: 'Pedido Excluído', description: 'O caso foi removido com sucesso do sistema.' })
    fetchOrders()
  }

  const updateOrderStatus = async (dbId: string, status: OrderStatus, note?: string) => {
    const { error } = await supabase
      .from('orders' as any)
      .update({ status })
      .eq('id', dbId)
    if (error)
      return toast({
        title: 'Erro',
        description: 'Erro ao atualizar status',
        variant: 'destructive',
      })
    await supabase.from('order_history' as any).insert({ order_id: dbId, status, note })
    await logAudit('UPDATE_STATUS', 'order', dbId, { status, note })
    toast({ title: 'Status atualizado' })
  }

  const updateOrderKanbanStage = async (dbId: string, stage: KanbanStage) => {
    if (!currentUser) return

    if (!kanbanStages.some((s) => s.name === stage)) {
      toast({ title: 'Erro', description: 'Fase do Kanban inválida.', variant: 'destructive' })
      return
    }

    let newStatus: OrderStatus = 'in_production'
    if (stage === 'TRIAGEM' || stage === 'PENDÊNCIAS') newStatus = 'pending'
    else if (stage === 'PRONTO PARA ENVIO') newStatus = 'completed'

    let originalStage: string | null = null
    let originalStatus: OrderStatus | null = null

    setOrders((prev) => {
      const orderIndex = prev.findIndex((o) => o.id === dbId)
      if (orderIndex === -1) return prev
      const newOrders = [...prev]
      originalStage = newOrders[orderIndex].kanbanStage
      originalStatus = newOrders[orderIndex].status

      if (originalStage === stage) return prev

      newOrders[orderIndex] = { ...newOrders[orderIndex], kanbanStage: stage, status: newStatus }
      return newOrders
    })

    if (!originalStage || originalStage === stage) return

    try {
      const { error } = await supabase
        .from('orders' as any)
        .update({ kanban_stage: stage, status: newStatus })
        .eq('id', dbId)
      if (error) throw error
      await supabase.from('order_history' as any).insert({
        order_id: dbId,
        status: newStatus,
        note: `${currentUser.name} moveu o cartão para ${stage}`,
      })
      await logAudit('MOVE_STAGE', 'order', dbId, { from: originalStage, to: stage })
      toast({ title: 'Cartão Movido' })
    } catch (error) {
      console.error(error)
      setOrders((prev) => {
        const orderIndex = prev.findIndex((o) => o.id === dbId)
        if (orderIndex === -1) return prev
        const revertedOrders = [...prev]
        revertedOrders[orderIndex] = {
          ...revertedOrders[orderIndex],
          kanbanStage: originalStage!,
          status: originalStatus!,
        }
        return revertedOrders
      })
      toast({ title: 'Erro', description: 'Erro ao mover cartão.', variant: 'destructive' })
    }
  }

  const updateOrderObservations = async (dbId: string, observations: string) => {
    const { error } = await supabase
      .from('orders' as any)
      .update({ observations })
      .eq('id', dbId)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao atualizar', variant: 'destructive' })
    await logAudit('UPDATE_OBSERVATIONS', 'order', dbId, {})
    toast({ title: 'Observações salvas' })
  }

  const addKanbanStage = async (name: string): Promise<boolean> => {
    const upperName = name.trim().toUpperCase()

    const { data: existing } = await supabase
      .from('kanban_stages' as any)
      .select('id')
      .eq('name', upperName)

    if (existing && existing.length > 0) {
      toast({
        title: 'Erro',
        description: `A coluna "${upperName}" já existe.`,
        variant: 'destructive',
      })
      return false
    }

    if (kanbanStages.some((s) => s.name.toUpperCase() === upperName)) {
      toast({
        title: 'Erro',
        description: `A coluna "${upperName}" já existe.`,
        variant: 'destructive',
      })
      return false
    }

    const nextIndex =
      kanbanStages.length > 0 ? Math.max(...kanbanStages.map((s) => s.orderIndex)) + 1 : 1
    const { error } = await supabase
      .from('kanban_stages' as any)
      .insert({ name: upperName, order_index: nextIndex })

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Erro',
          description: `A coluna "${upperName}" já existe.`,
          variant: 'destructive',
        })
        return false
      }
      toast({ title: 'Erro', description: 'Erro ao adicionar.', variant: 'destructive' })
      return false
    }

    await logAudit('CREATE_STAGE', 'kanban_stage', upperName, { name: upperName })
    toast({ title: 'Coluna adicionada' })
    return true
  }

  const updateKanbanStage = async (id: string, oldName: string, newName: string) => {
    if (currentUser?.role !== 'admin') throw new Error('Unauthorized')
    const upperNewName = newName.trim().toUpperCase()

    const { data: existing } = await supabase
      .from('kanban_stages' as any)
      .select('id')
      .eq('name', upperNewName)
      .neq('id', id)

    if (existing && existing.length > 0) {
      toast({
        title: 'Erro',
        description: `A coluna "${upperNewName}" já existe.`,
        variant: 'destructive',
      })
      throw new Error('Duplicate column')
    }

    if (kanbanStages.some((s) => s.name.toUpperCase() === upperNewName && s.id !== id)) {
      toast({
        title: 'Erro',
        description: `A coluna "${upperNewName}" já existe.`,
        variant: 'destructive',
      })
      throw new Error('Duplicate column')
    }

    const { error } = await supabase
      .from('kanban_stages' as any)
      .update({ name: upperNewName })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Erro',
          description: `A coluna "${upperNewName}" já existe.`,
          variant: 'destructive',
        })
        throw new Error('Duplicate column')
      }
      throw error
    }

    await supabase
      .from('orders' as any)
      .update({ kanban_stage: upperNewName })
      .eq('kanban_stage', oldName)

    await logAudit('RENAME_STAGE', 'kanban_stage', id, { oldName, newName: upperNewName })
    toast({ title: 'Coluna renomeada' })
  }

  const updateKanbanStageDescription = async (id: string, description: string) => {
    if (currentUser?.role !== 'admin') throw new Error('Unauthorized')
    const { error } = await supabase
      .from('kanban_stages' as any)
      .update({ description })
      .eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao atualizar descrição.', variant: 'destructive' })
      throw error
    }
    setKanbanStages((prev) => prev.map((s) => (s.id === id ? { ...s, description } : s)))
    await logAudit('UPDATE_STAGE_DESC', 'kanban_stage', id, { description })
    toast({ title: 'Descrição atualizada' })
  }

  const deleteKanbanStage = async (id: string, oldName: string, fallbackName?: string) => {
    if (fallbackName)
      await supabase
        .from('orders' as any)
        .update({ kanban_stage: fallbackName })
        .eq('kanban_stage', oldName)
    const { error } = await supabase
      .from('kanban_stages' as any)
      .delete()
      .eq('id', id)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao remover.', variant: 'destructive' })
    await logAudit('DELETE_STAGE', 'kanban_stage', id, { oldName, fallbackName })
    toast({ title: 'Coluna removida' })
  }

  const reorderKanbanStages = async (reorderedStages: Stage[]) => {
    if (currentUser?.role !== 'admin') return
    setKanbanStages(reorderedStages)
    const updates = reorderedStages.map((stage, index) =>
      supabase
        .from('kanban_stages' as any)
        .update({ order_index: index + 1 })
        .eq('id', stage.id),
    )
    try {
      await Promise.all(updates)
      await logAudit('REORDER_STAGES', 'kanban_stage', 'all', {})
    } catch (e) {
      toast({ title: 'Erro', description: 'Erro ao reordenar colunas.', variant: 'destructive' })
      fetchStages()
    }
  }

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('app_settings' as any)
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar configuração.', variant: 'destructive' })
      return
    }
    await logAudit('UPDATE_SETTING', 'setting', key, { value })
    toast({ title: 'Configuração atualizada' })
    fetchSettings()
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return
    const { error } = await supabase
      .from('profiles' as any)
      .update(updates)
      .eq('id', currentUser.id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      })
      return
    }
    await logAudit('UPDATE_PROFILE', 'profile', currentUser.id, { updates })
    setCurrentUser({ ...currentUser, ...updates } as any)
    toast({ title: 'Perfil atualizado com sucesso' })
  }

  if (session && profileLoading)
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center font-medium' },
      'Carregando...',
    )

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        currentUser: currentUser as any,
        orders,
        kanbanStages,
        appSettings,
        pendingUsers,
        priceList,
        loading,
        selectedLab,
        setSelectedLab,
        switchRole,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        updateOrderKanbanStage,
        updateOrderObservations,
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
      },
    },
    children,
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
