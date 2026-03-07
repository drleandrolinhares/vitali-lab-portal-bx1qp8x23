import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Order, OrderStatus, KanbanStage, User, UserRole } from '@/lib/types'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface AppState {
  currentUser: User
  orders: Order[]
  loading: boolean
  switchRole: (role: UserRole) => void
  addOrder: (order: any) => Promise<void>
  updateOrderStatus: (dbId: string, status: OrderStatus, note?: string) => Promise<void>
  updateOrderKanbanStage: (dbId: string, stage: KanbanStage) => Promise<void>
  refreshOrders: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  const fetchProfile = async () => {
    if (!session?.user) {
      setCurrentUser(null)
      setOrders([])
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    const { data } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data) {
      setCurrentUser({
        id: data.id,
        name: data.name,
        role: data.role as UserRole,
        clinic: data.clinic,
      })
    } else {
      setCurrentUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Usuário',
        role: session.user.user_metadata?.role || 'dentist',
        clinic: session.user.user_metadata?.clinic,
      })
    }
    setProfileLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user])

  const fetchOrders = async () => {
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
  }

  useEffect(() => {
    if (currentUser) fetchOrders()
  }, [currentUser])

  const switchRole = () => toast({ title: 'Aviso', description: 'Modo demonstração desativado.' })

  const addOrder = async (orderData: any) => {
    if (!currentUser) return
    const { error } = await supabase.from('orders' as any).insert({
      patient_name: orderData.patientName,
      dentist_id: currentUser.id,
      sector: orderData.sector,
      kanban_stage: 'TRIAGEM',
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
        description: 'Não foi possível salvar o pedido.',
        variant: 'destructive',
      })
    toast({ title: 'Pedido enviado!', description: `O pedido foi registrado com sucesso.` })
    fetchOrders()
  }

  const updateOrderStatus = async (dbId: string, status: OrderStatus, note?: string) => {
    const { error: err1 } = await supabase
      .from('orders' as any)
      .update({ status })
      .eq('id', dbId)
    if (err1)
      return toast({
        title: 'Erro',
        description: 'Erro ao atualizar status',
        variant: 'destructive',
      })
    await supabase.from('order_history' as any).insert({ order_id: dbId, status, note })
    toast({ title: 'Status atualizado', description: `O pedido agora está: ${status}.` })
    fetchOrders()
  }

  const updateOrderKanbanStage = async (dbId: string, stage: KanbanStage) => {
    const { error } = await supabase
      .from('orders' as any)
      .update({ kanban_stage: stage })
      .eq('id', dbId)
    if (error)
      return toast({ title: 'Erro', description: 'Erro ao mover cartão', variant: 'destructive' })
    toast({ title: 'Cartão Movido', description: `Avançado para: ${stage}.` })
    fetchOrders()
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
        loading,
        switchRole,
        addOrder,
        updateOrderStatus,
        updateOrderKanbanStage,
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
