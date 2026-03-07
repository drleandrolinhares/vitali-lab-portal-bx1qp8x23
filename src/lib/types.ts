export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'delivered'

export type UserRole = 'dentist' | 'receptionist' | 'admin'

export interface OrderHistoryEvent {
  id: string
  status: OrderStatus
  date: string
  note?: string
}

export interface Order {
  id: string
  friendlyId: string
  patientName: string
  dentistName: string
  workType: string
  material: string
  teeth: number[]
  arches?: string[]
  shade: string
  shadeScale?: string
  shippingMethod: string
  stlDeliveryMethod?: string
  observations: string
  status: OrderStatus
  createdAt: string
  history: OrderHistoryEvent[]
}

export interface User {
  id: string
  name: string
  role: UserRole
  clinic?: string
}
