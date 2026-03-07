import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Order, OrderStatus, User, UserRole } from '@/lib/types'
import { toast } from '@/hooks/use-toast'

interface AppState {
  currentUser: User
  orders: Order[]
  switchRole: (role: UserRole) => void
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'history'>) => void
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    patientName: 'Carlos Silva',
    dentistName: 'Dra. Ana Souza',
    workType: 'Coroa',
    material: 'Zircônia',
    teeth: [11, 21],
    shade: 'A2',
    shippingMethod: 'lab_pickup',
    observations: 'Atenção ao ponto de contato.',
    status: 'in_production',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    history: [
      { id: 'h1', status: 'pending', date: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  },
  {
    id: 'ORD-002',
    patientName: 'Maria Oliveira',
    dentistName: 'Dr. João Pedro',
    workType: 'Faceta',
    material: 'Porcelana',
    teeth: [13, 12, 11, 21, 22, 23],
    shade: 'BL2',
    shippingMethod: 'dentist_send',
    observations: 'Textura de superfície leve.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    history: [{ id: 'h2', status: 'pending', date: new Date(Date.now() - 3600000).toISOString() }],
  },
  {
    id: 'ORD-003',
    patientName: 'José Santos',
    dentistName: 'Dra. Ana Souza',
    workType: 'Protocolo',
    material: 'Resina/Acrílico',
    teeth: [],
    shade: 'A3',
    shippingMethod: 'lab_pickup',
    observations: 'Barra metálica reforçada.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    history: [
      { id: 'h3', status: 'pending', date: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
  },
]

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u1',
    name: 'Dra. Ana Souza',
    role: 'dentist',
    clinic: 'Sorriso Clínica',
  })
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: role === 'dentist' ? 'Dra. Ana Souza' : 'Vitali Administrativo',
    }))
    toast({
      title: 'Perfil alterado',
      description: `Visualizando como ${role === 'dentist' ? 'Dentista' : 'Laboratório'}.`,
    })
  }

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'history'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      history: [{ id: Date.now().toString(), status: 'pending', date: new Date().toISOString() }],
    }
    setOrders([newOrder, ...orders])
    toast({
      title: 'Pedido enviado!',
      description: `O pedido ${newOrder.id} foi registrado com sucesso.`,
    })
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            history: [
              { id: Date.now().toString(), status, date: new Date().toISOString(), note },
              ...o.history,
            ],
          }
        }
        return o
      }),
    )
    toast({ title: 'Status atualizado', description: `O pedido ${orderId} agora está: ${status}.` })
  }

  return React.createElement(
    AppContext.Provider,
    { value: { currentUser, orders, switchRole, addOrder, updateOrderStatus } },
    children,
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
