export type UserRole =
  | 'dentist'
  | 'laboratory'
  | 'admin'
  | 'master'
  | 'receptionist'
  | 'technical_assistant'
  | 'financial'
  | 'relationship_manager'
export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'delivered'
export type KanbanStage = string

export interface User {
  id: string
  name: string
  role: UserRole
  clinic?: string
  job_function?: string
  whatsapp_group_link?: string
  avatar_url?: string
  permissions?: any
  assigned_dentists?: string[] | null
  can_move_kanban_cards?: boolean
  is_billing_paused?: boolean
  pix_key?: string
  pix_type?: string
  bank_name?: string
  allowed_sectors?: string[]
}

export interface Stage {
  id: string
  name: KanbanStage
  orderIndex: number
  description?: string
  sector?: string
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
  dentistRole?: string
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
  dbStatus: OrderStatus
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
  settlementId?: string | null
  isAdjustmentReturn?: boolean
  custo_adicional_descricao?: string | null
  custo_adicional_valor?: number | null
  createdBy?: {
    id: string
    name: string
    role: UserRole
  }
}
