export type UserRole = 'admin' | 'receptionist' | 'dentist'

export interface User {
  id: string
  name: string
  role: UserRole
  clinic?: string | null
  whatsapp_group_link?: string | null
  avatar_url?: string | null
}

export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'delivered' | 'cancelled'

export type KanbanStage = string

export interface Stage {
  id: string
  name: string
  orderIndex: number
}

export interface OrderHistory {
  id: string
  status: OrderStatus
  date: string
  note?: string
}

export interface Order {
  id: string
  friendlyId: string
  patientName: string
  dentistId: string
  dentistName: string
  dentistGroupLink: string
  sector: string
  kanbanStage: KanbanStage
  workType: string
  material: string
  teeth: string[]
  arches: string[]
  shade?: string
  shadeScale?: string
  shippingMethod: string
  stlDeliveryMethod?: string
  observations?: string
  status: OrderStatus
  createdAt: string
  clearedBalance: number
  history: OrderHistory[]
}
