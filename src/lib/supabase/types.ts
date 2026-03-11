// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      billing_controls: {
        Row: {
          created_at: string
          dentist_id: string
          id: string
          month: string
          status: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          id?: string
          month: string
          status?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          id?: string
          month?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'billing_controls_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      dre_categories: {
        Row: {
          category_type: string
          created_at: string
          name: string
        }
        Insert: {
          category_type?: string
          created_at?: string
          name: string
        }
        Update: {
          category_type?: string
          created_at?: string
          name?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          classification: string | null
          cost_center: string
          created_at: string
          dentist_id: string | null
          description: string
          dre_category: string
          due_date: string
          id: string
          installment_current: number | null
          installment_total: number | null
          is_recurring: boolean | null
          order_id: string | null
          payment_method: string | null
          purchase_date: string | null
          recurring_day: number | null
          sector: string
          status: string
        }
        Insert: {
          amount: number
          category?: string | null
          classification?: string | null
          cost_center: string
          created_at?: string
          dentist_id?: string | null
          description: string
          dre_category?: string
          due_date: string
          id?: string
          installment_current?: number | null
          installment_total?: number | null
          is_recurring?: boolean | null
          order_id?: string | null
          payment_method?: string | null
          purchase_date?: string | null
          recurring_day?: number | null
          sector?: string
          status?: string
        }
        Update: {
          amount?: number
          category?: string | null
          classification?: string | null
          cost_center?: string
          created_at?: string
          dentist_id?: string | null
          description?: string
          dre_category?: string
          due_date?: string
          id?: string
          installment_current?: number | null
          installment_total?: number | null
          is_recurring?: boolean | null
          order_id?: string | null
          payment_method?: string | null
          purchase_date?: string | null
          recurring_day?: number | null
          sector?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'expenses_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_dre_category_fkey'
            columns: ['dre_category']
            isOneToOne: false
            referencedRelation: 'dre_categories'
            referencedColumns: ['name']
          },
          {
            foreignKeyName: 'expenses_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      inventory_items: {
        Row: {
          created_at: string
          id: string
          items_per_box: number | null
          last_purchase_brand: string | null
          last_purchase_value: number | null
          minimum_stock_level: number
          name: string
          observations: string | null
          packaging_type: string | null
          packaging_types: Json | null
          purchase_cost: number | null
          quantity: number
          sector: string
          storage_location: string | null
          unit_price: number
          usage_factor: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          items_per_box?: number | null
          last_purchase_brand?: string | null
          last_purchase_value?: number | null
          minimum_stock_level?: number
          name: string
          observations?: string | null
          packaging_type?: string | null
          packaging_types?: Json | null
          purchase_cost?: number | null
          quantity?: number
          sector?: string
          storage_location?: string | null
          unit_price?: number
          usage_factor?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          items_per_box?: number | null
          last_purchase_brand?: string | null
          last_purchase_value?: number | null
          minimum_stock_level?: number
          name?: string
          observations?: string | null
          packaging_type?: string | null
          packaging_types?: Json | null
          purchase_cost?: number | null
          quantity?: number
          sector?: string
          storage_location?: string | null
          unit_price?: number
          usage_factor?: number | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          id: string
          item_id: string
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          quantity: number
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          quantity?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_transactions_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'inventory_items'
            referencedColumns: ['id']
          },
        ]
      }
      kanban_stages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      order_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_history_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          base_price: number
          cleared_balance: number
          color_and_considerations: string | null
          created_at: string
          created_by: string | null
          dentist_id: string
          dre_category: string
          estrutura_fixacao: string
          file_urls: Json | null
          friendly_id: string
          id: string
          implant_brand: string | null
          implant_type: string | null
          is_acknowledged: boolean
          kanban_stage: string
          material: string
          observations: string | null
          patient_birth_date: string | null
          patient_cpf: string | null
          patient_name: string
          scale_used: string | null
          sector: string
          shipping_details: string | null
          shipping_method: string
          status: string
          tooth_or_arch: Json | null
          work_type: string
        }
        Insert: {
          base_price?: number
          cleared_balance?: number
          color_and_considerations?: string | null
          created_at?: string
          created_by?: string | null
          dentist_id: string
          dre_category?: string
          estrutura_fixacao?: string
          file_urls?: Json | null
          friendly_id?: string
          id?: string
          implant_brand?: string | null
          implant_type?: string | null
          is_acknowledged?: boolean
          kanban_stage?: string
          material: string
          observations?: string | null
          patient_birth_date?: string | null
          patient_cpf?: string | null
          patient_name: string
          scale_used?: string | null
          sector?: string
          shipping_details?: string | null
          shipping_method: string
          status?: string
          tooth_or_arch?: Json | null
          work_type: string
        }
        Update: {
          base_price?: number
          cleared_balance?: number
          color_and_considerations?: string | null
          created_at?: string
          created_by?: string | null
          dentist_id?: string
          dre_category?: string
          estrutura_fixacao?: string
          file_urls?: Json | null
          friendly_id?: string
          id?: string
          implant_brand?: string | null
          implant_type?: string | null
          is_acknowledged?: boolean
          kanban_stage?: string
          material?: string
          observations?: string | null
          patient_birth_date?: string | null
          patient_cpf?: string | null
          patient_name?: string
          scale_used?: string | null
          sector?: string
          shipping_details?: string | null
          shipping_method?: string
          status?: string
          tooth_or_arch?: Json | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_dre_category_fkey'
            columns: ['dre_category']
            isOneToOne: false
            referencedRelation: 'dre_categories'
            referencedColumns: ['name']
          },
        ]
      }
      price_list: {
        Row: {
          cadista_cost: number | null
          category: string
          created_at: string
          estrutura_fixacao: string
          execution_time: number | null
          fixed_cost: number | null
          id: string
          material: string
          material_cost: number | null
          notes: string | null
          price: string
          sector: string
          work_type: string
        }
        Insert: {
          cadista_cost?: number | null
          category: string
          created_at?: string
          estrutura_fixacao?: string
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          material?: string
          material_cost?: number | null
          notes?: string | null
          price: string
          sector?: string
          work_type: string
        }
        Update: {
          cadista_cost?: number | null
          category?: string
          created_at?: string
          estrutura_fixacao?: string
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          material?: string
          material_cost?: number | null
          notes?: string | null
          price?: string
          sector?: string
          work_type?: string
        }
        Relationships: []
      }
      price_stages: {
        Row: {
          created_at: string
          id: string
          kanban_stage: string
          name: string
          price: number
          price_list_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kanban_stage: string
          name: string
          price?: number
          price_list_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kanban_stage?: string
          name?: string
          price?: number
          price_list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'price_stages_price_list_id_fkey'
            columns: ['price_list_id']
            isOneToOne: false
            referencedRelation: 'price_list'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          assigned_dentists: Json | null
          avatar_url: string | null
          can_move_kanban_cards: boolean | null
          clinic: string | null
          clinic_contact_name: string | null
          clinic_contact_phone: string | null
          clinic_contact_role: string | null
          closing_date: number | null
          commercial_agreement: number
          created_at: string
          email: string
          id: string
          is_active: boolean
          is_approved: boolean
          job_function: string | null
          lunch_end: string | null
          lunch_start: string | null
          name: string
          payment_due_date: number | null
          permissions: Json | null
          personal_phone: string | null
          requires_password_change: boolean
          role: string
          whatsapp_group_link: string | null
          work_end: string | null
          work_start: string | null
          username: string | null
          rg: string | null
          cpf: string | null
          birth_date: string | null
          cep: string | null
          address: string | null
          address_number: string | null
          address_complement: string | null
          city: string | null
          state: string | null
          has_access_schedule: boolean | null
          last_access_at: string | null
        }
        Insert: {
          assigned_dentists?: Json | null
          avatar_url?: string | null
          can_move_kanban_cards?: boolean | null
          clinic?: string | null
          clinic_contact_name?: string | null
          clinic_contact_phone?: string | null
          clinic_contact_role?: string | null
          closing_date?: number | null
          commercial_agreement?: number
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          is_approved?: boolean
          job_function?: string | null
          lunch_end?: string | null
          lunch_start?: string | null
          name: string
          payment_due_date?: number | null
          permissions?: Json | null
          personal_phone?: string | null
          requires_password_change?: boolean
          role?: string
          whatsapp_group_link?: string | null
          work_end?: string | null
          work_start?: string | null
          username?: string | null
          rg?: string | null
          cpf?: string | null
          birth_date?: string | null
          cep?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          has_access_schedule?: boolean | null
          last_access_at?: string | null
        }
        Update: {
          assigned_dentists?: Json | null
          avatar_url?: string | null
          can_move_kanban_cards?: boolean | null
          clinic?: string | null
          clinic_contact_name?: string | null
          clinic_contact_phone?: string | null
          clinic_contact_role?: string | null
          closing_date?: number | null
          commercial_agreement?: number
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          is_approved?: boolean
          job_function?: string | null
          lunch_end?: string | null
          lunch_start?: string | null
          name?: string
          payment_due_date?: number | null
          permissions?: Json | null
          personal_phone?: string | null
          requires_password_change?: boolean
          role?: string
          whatsapp_group_link?: string | null
          work_end?: string | null
          work_start?: string | null
          username?: string | null
          rg?: string | null
          cpf?: string | null
          birth_date?: string | null
          cep?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          has_access_schedule?: boolean | null
          last_access_at?: string | null
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          dentist_id: string
          id: string
          orders_snapshot: Json
        }
        Insert: {
          amount: number
          created_at?: string
          dentist_id: string
          id?: string
          orders_snapshot: Json
        }
        Update: {
          amount?: number
          created_at?: string
          dentist_id?: string
          id?: string
          orders_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'settlements_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: { Args: { target_user_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
