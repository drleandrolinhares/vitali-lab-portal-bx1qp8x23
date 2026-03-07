export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'delivered'

export type UserRole = 'dentist' | 'lab'

export interface OrderHistoryEvent {
  id: string
  status: OrderStatus
  date: string
  note?: string
}

export interface Order {
  id: string
  patientName: string
  dentistName: string
  workType: string
  material: string
  teeth: number[]
  shade: string
  shippingMethod: string
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
