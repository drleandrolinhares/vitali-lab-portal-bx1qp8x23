export interface Booking {
  id: string
  dentist_id: string
  patient_name: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  notes: string
  profiles?: { name: string }
}

export interface ScanSetting {
  id: string
  day_of_week: number
  is_available: boolean
  start_time: string
  end_time: string
  slot_duration_minutes: number
}

export interface ScanBlock {
  id: string
  start_time: string
  end_time: string
  block_date: string | null
  day_of_week?: number | null
  recurrence: 'unique' | 'daily' | 'weekly' | 'monthly'
}

export type ViewType = 'day' | 'week' | 'month'

export interface ScanFilters {
  showBookings: boolean
  showBlocks: boolean
  dentistId?: string
}

export type ScanTab = 'VISÃO GERAL' | 'AGENDAMENTOS MARCADOS' | 'HISTÓRICO TOTAL'
