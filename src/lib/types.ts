export type UserRole = 'dentist' | 'admin' | 'master' | 'receptionist'
export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'delivered'
export type KanbanStage = string // Dynamic now

export interface User {
  id: string
  name: string
  role: UserRole
  clinic?: string
  job_function?: string
  whatsapp_group_link?: string
  avatar_url?: string
  permissions?: any // Updated to support new JSONB format
  assigned_dentists?: string[] | null
  can_move_kanban_cards?: boolean
}

export interface Stage {
  id: string
  name: KanbanStage
  orderIndex: number
  description?: string
}

export interface DRECategory {
  name: string
  category_type: 'revenue' | 'variable' | 'fixed'
  created_at: string
}

export interface OrderHistory {
  id: string
  status: OrderStatus | 'pending'
  date: string
  note?: string
}

export interface Order {
  id: string
  friendlyId: string
  patientName: string
  patientCpf?: string
  patientBirthDate?: string
  dentistId: string
  dentistName?: string
  dentistClinic?: string
  dentistGroupLink?: string
  dentistDiscount?: number
  sector: string
  kanbanStage: KanbanStage
  workType: string
  material: string
  teeth: number[]
  arches: string[]
  shade?: string
  shadeScale?: string
  shippingMethod: string
  stlDeliveryMethod?: string
  observations?: string
  status: OrderStatus
  isAcknowledged?: boolean
  createdAt: string
  history: OrderHistory[]
  clearedBalance: number
  basePrice: number
  unitPrice?: number
  quantity: number
  dre_category?: string
  fileUrls?: string[]
  implantBrand?: string
  implantType?: string
  estruturaFixacao?: string
  createdBy?: {
    id: string
    name: string
    role: UserRole
  }
}
