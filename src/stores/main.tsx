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
  currentUser: User
  orders: Order[]
  kanbanStages: Stage[]
  loading: boolean
  switchRole: (role: UserRole) => void
  addOrder: (order: any) => Promise<void>
  updateOrderStatus: (dbId: string, status: OrderStatus, note?: string) => Promise<void>
  updateOrderKanbanStage: (dbId: string, stage: KanbanStage) => Promise<void>
  updateOrderObservations: (dbId: string, observations: string) => Promise<void>
  addKanbanStage: (name: string) => Promise<void>
  updateKanbanStage: (id: string, oldName: string, newName: string) => Promise<void>
  deleteKanbanStage: (id: string, oldName: string, fallbackName?: string) => Promise<void>
  refreshOrders: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [kanbanStages, setKanbanStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  const fetchProfile = async () => {
    if (!session?.user) {
      setCurrentUser(null)
      setOrders([])
      setKanbanStages([])
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    const { data } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data)
      setCurrentUser({
        id: data.id,
        name: data.name,
        role: data.role as UserRole,
        clinic: data.clinic,
      })
    else
      setCurrentUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Usuário',
        role: session.user.user_metadata?.role || 'dentist',
        clinic: session.user.user_metadata?.clinic,
      })
    setProfileLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user])

  const fetchStages = useCallback(async () => {
    const { data } = await supabase
      .from('kanban_stages' as any)
      .select('*')
      .order('order_index', { ascending: true })
    if (data)
      setKanbanStages(data.map((s: any) => ({ id: s.id, name: s.name, orderIndex: s.order_index })))
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!session?.user || !currentUser) return
    setLoading(true)
    const { data: dbOrders } = await supabase
      .from('orders' as any)
      .select(`*, profiles!orders_dentist_id_fkey(name), order_history(*)`)
      .order('created_at', { ascending: false })
    if (dbOrders) {
      setOrders(
        dbOrders.map((o: any) => ({
          id: o.id,
          friendlyId: o.friendly_id,
          patientName: o.patient_name,
          dentistName: o.profiles?.name || 'Desconhecido',
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

      const channel = supabase
        .channel('app-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () =>
          fetchOrders(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_stages' }, () =>
          fetchStages(),
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [currentUser, fetchOrders, fetchStages])

  const switchRole = () => toast({ title: 'Aviso', description: 'Modo demonstração desativado.' })

  const addOrder = async (orderData: any) => {
    if (!currentUser) return
    const defaultStage = kanbanStages.length > 0 ? kanbanStages[0].name : 'TRIAGEM'
    const { error } = await supabase.from('orders' as any).insert({
      patient_name: orderData.patientName,
      dentist_id: currentUser.id,
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
    if (error)
      return toast({
        title: 'Erro',
        description: 'Não foi possível salvar.',
        variant: 'destructive',
      })
    toast({ title: 'Pedido enviado!' })
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
    toast({ title: 'Status atualizado' })
  }

  const updateOrderKanbanStage = async (dbId: string, stage: KanbanStage) => {
    if (!currentUser) return
    let newStatus: OrderStatus = 'in_production'
    if (stage === 'TRIAGEM' || stage === 'PENDÊNCIAS') newStatus = 'pending'
    else if (stage === 'PRONTO PARA ENVIO') newStatus = 'completed'

    const { error } = await supabase
      .from('orders' as any)
      .update({ kanban_stage: stage, status: newStatus })
      .eq('id', dbId)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao mover cartão', variant: 'destructive' })
    await supabase
      .from('order_history' as any)
      .insert({
        order_id: dbId,
        status: newStatus,
        note: `${currentUser.name} moveu o cartão para ${stage}`,
      })
    toast({ title: 'Cartão Movido' })
  }

  const updateOrderObservations = async (dbId: string, observations: string) => {
    const { error } = await supabase
      .from('orders' as any)
      .update({ observations })
      .eq('id', dbId)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao atualizar', variant: 'destructive' })
    toast({ title: 'Observações salvas' })
  }

  const addKanbanStage = async (name: string) => {
    const upperName = name.trim().toUpperCase()
    if (kanbanStages.some((s) => s.name === upperName))
      return toast({ title: 'Erro', description: 'Coluna já existe.', variant: 'destructive' })
    const nextIndex =
      kanbanStages.length > 0 ? Math.max(...kanbanStages.map((s) => s.orderIndex)) + 1 : 1
    const { error } = await supabase
      .from('kanban_stages' as any)
      .insert({ name: upperName, order_index: nextIndex })
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao adicionar.', variant: 'destructive' })
    toast({ title: 'Coluna adicionada' })
  }

  const updateKanbanStage = async (id: string, oldName: string, newName: string) => {
    const upperNewName = newName.trim().toUpperCase()
    if (kanbanStages.some((s) => s.name === upperNewName && s.id !== id))
      return toast({ title: 'Erro', description: 'Coluna já existe.', variant: 'destructive' })
    const { error } = await supabase
      .from('kanban_stages' as any)
      .update({ name: upperNewName })
      .eq('id', id)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao renomear.', variant: 'destructive' })
    await supabase
      .from('orders' as any)
      .update({ kanban_stage: upperNewName })
      .eq('kanban_stage', oldName)
    toast({ title: 'Coluna renomeada' })
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
    toast({ title: 'Coluna removida' })
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
        currentUser: currentUser as User,
        orders,
        kanbanStages,
        loading,
        switchRole,
        addOrder,
        updateOrderStatus,
        updateOrderKanbanStage,
        updateOrderObservations,
        addKanbanStage,
        updateKanbanStage,
        deleteKanbanStage,
        refreshOrders: fetchOrders,
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
