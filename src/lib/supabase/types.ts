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
      billing_installments: {
        Row: {
          created_at: string
          dentist_id: string
          due_date: string | null
          id: string
          installment_number: number | null
          installment_value: number
          note: string | null
          paid_at: string | null
          payment_method: string | null
          remaining_installments: number
          settlement_id: string | null
          start_month: string | null
          status: string
          total_amount: number
          total_installments: number
        }
        Insert: {
          created_at?: string
          dentist_id: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          installment_value: number
          note?: string | null
          paid_at?: string | null
          payment_method?: string | null
          remaining_installments: number
          settlement_id?: string | null
          start_month?: string | null
          status?: string
          total_amount: number
          total_installments: number
        }
        Update: {
          created_at?: string
          dentist_id?: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          installment_value?: number
          note?: string | null
          paid_at?: string | null
          payment_method?: string | null
          remaining_installments?: number
          settlement_id?: string | null
          start_month?: string | null
          status?: string
          total_amount?: number
          total_installments?: number
        }
        Relationships: [
          {
            foreignKeyName: 'billing_installments_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'billing_installments_settlement_id_fkey'
            columns: ['settlement_id']
            isOneToOne: false
            referencedRelation: 'settlements'
            referencedColumns: ['id']
          },
        ]
      }
      dentist_boxes: {
        Row: {
          box_number: string
          dentist_id: string
          id: string
          order_id: string | null
          returned_at: string | null
          sent_at: string
          status: string
        }
        Insert: {
          box_number: string
          dentist_id: string
          id?: string
          order_id?: string | null
          returned_at?: string | null
          sent_at?: string
          status?: string
        }
        Update: {
          box_number?: string
          dentist_id?: string
          id?: string
          order_id?: string | null
          returned_at?: string | null
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dentist_boxes_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'dentist_boxes_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
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
          brand: string | null
          color: string | null
          created_at: string
          do_not_buy: boolean | null
          do_not_buy_reason: string | null
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
          specification: string | null
          specificity: string | null
          storage_location: string | null
          unit_price: number
          usage_factor: number | null
        }
        Insert: {
          brand?: string | null
          color?: string | null
          created_at?: string
          do_not_buy?: boolean | null
          do_not_buy_reason?: string | null
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
          specification?: string | null
          specificity?: string | null
          storage_location?: string | null
          unit_price?: number
          usage_factor?: number | null
        }
        Update: {
          brand?: string | null
          color?: string | null
          created_at?: string
          do_not_buy?: boolean | null
          do_not_buy_reason?: string | null
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
          specification?: string | null
          specificity?: string | null
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
          sector: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index: number
          sector?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          sector?: string
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
      order_repetitions: {
        Row: {
          dentist_id: string | null
          details: string | null
          estimated_loss: number
          id: string
          logged_at: string
          logged_by: string | null
          order_id: string
          reason: string
          work_type: string
        }
        Insert: {
          dentist_id?: string | null
          details?: string | null
          estimated_loss?: number
          id?: string
          logged_at?: string
          logged_by?: string | null
          order_id: string
          reason: string
          work_type: string
        }
        Update: {
          dentist_id?: string | null
          details?: string | null
          estimated_loss?: number
          id?: string
          logged_at?: string
          logged_by?: string | null
          order_id?: string
          reason?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_repetitions_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_repetitions_logged_by_fkey'
            columns: ['logged_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_repetitions_order_id_fkey'
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
          is_adjustment_return: boolean | null
          kanban_stage: string
          material: string
          observations: string | null
          patient_birth_date: string | null
          patient_cpf: string | null
          patient_name: string
          scale_used: string | null
          sector: string
          settlement_id: string | null
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
          is_adjustment_return?: boolean | null
          kanban_stage?: string
          material: string
          observations?: string | null
          patient_birth_date?: string | null
          patient_cpf?: string | null
          patient_name: string
          scale_used?: string | null
          sector?: string
          settlement_id?: string | null
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
          is_adjustment_return?: boolean | null
          kanban_stage?: string
          material?: string
          observations?: string | null
          patient_birth_date?: string | null
          patient_cpf?: string | null
          patient_name?: string
          scale_used?: string | null
          sector?: string
          settlement_id?: string | null
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
          {
            foreignKeyName: 'orders_settlement_id_fkey'
            columns: ['settlement_id']
            isOneToOne: false
            referencedRelation: 'settlements'
            referencedColumns: ['id']
          },
        ]
      }
      partner_prices: {
        Row: {
          created_at: string
          custom_price: number
          id: string
          is_enabled: boolean
          partner_id: string
          price_list_id: string
        }
        Insert: {
          created_at?: string
          custom_price: number
          id?: string
          is_enabled?: boolean
          partner_id: string
          price_list_id: string
        }
        Update: {
          created_at?: string
          custom_price?: number
          id?: string
          is_enabled?: boolean
          partner_id?: string
          price_list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'partner_prices_partner_id_fkey'
            columns: ['partner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partner_prices_price_list_id_fkey'
            columns: ['price_list_id']
            isOneToOne: false
            referencedRelation: 'price_list'
            referencedColumns: ['id']
          },
        ]
      }
      price_list: {
        Row: {
          cadista_cost: number | null
          category: string
          created_at: string
          estrutura_fixacao: string
          exclusive_dentist_id: string | null
          execution_time: number | null
          fixed_cost: number | null
          id: string
          is_hidden: boolean
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
          exclusive_dentist_id?: string | null
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          is_hidden?: boolean
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
          exclusive_dentist_id?: string | null
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          is_hidden?: boolean
          material?: string
          material_cost?: number | null
          notes?: string | null
          price?: string
          sector?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'price_list_exclusive_dentist_id_fkey'
            columns: ['exclusive_dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
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
          address: string | null
          address_complement: string | null
          address_number: string | null
          allowed_sectors: Json | null
          assigned_dentists: Json | null
          avatar_url: string | null
          bank_name: string | null
          birth_date: string | null
          can_move_kanban_cards: boolean | null
          cep: string | null
          city: string | null
          clinic: string | null
          clinic_contact_name: string | null
          clinic_contact_phone: string | null
          clinic_contact_role: string | null
          closing_date: number | null
          commercial_agreement: number
          cpf: string | null
          created_at: string
          email: string
          has_access_schedule: boolean | null
          id: string
          is_active: boolean
          is_approved: boolean
          is_billing_paused: boolean
          job_function: string | null
          last_access_at: string | null
          lunch_end: string | null
          lunch_start: string | null
          name: string
          payment_due_date: number | null
          permissions: Json | null
          personal_phone: string | null
          pix_key: string | null
          pix_type: string | null
          requires_password_change: boolean
          rg: string | null
          role: string
          state: string | null
          username: string | null
          whatsapp_group_link: string | null
          work_end: string | null
          work_start: string | null
        }
        Insert: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          allowed_sectors?: Json | null
          assigned_dentists?: Json | null
          avatar_url?: string | null
          bank_name?: string | null
          birth_date?: string | null
          can_move_kanban_cards?: boolean | null
          cep?: string | null
          city?: string | null
          clinic?: string | null
          clinic_contact_name?: string | null
          clinic_contact_phone?: string | null
          clinic_contact_role?: string | null
          closing_date?: number | null
          commercial_agreement?: number
          cpf?: string | null
          created_at?: string
          email: string
          has_access_schedule?: boolean | null
          id: string
          is_active?: boolean
          is_approved?: boolean
          is_billing_paused?: boolean
          job_function?: string | null
          last_access_at?: string | null
          lunch_end?: string | null
          lunch_start?: string | null
          name: string
          payment_due_date?: number | null
          permissions?: Json | null
          personal_phone?: string | null
          pix_key?: string | null
          pix_type?: string | null
          requires_password_change?: boolean
          rg?: string | null
          role?: string
          state?: string | null
          username?: string | null
          whatsapp_group_link?: string | null
          work_end?: string | null
          work_start?: string | null
        }
        Update: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          allowed_sectors?: Json | null
          assigned_dentists?: Json | null
          avatar_url?: string | null
          bank_name?: string | null
          birth_date?: string | null
          can_move_kanban_cards?: boolean | null
          cep?: string | null
          city?: string | null
          clinic?: string | null
          clinic_contact_name?: string | null
          clinic_contact_phone?: string | null
          clinic_contact_role?: string | null
          closing_date?: number | null
          commercial_agreement?: number
          cpf?: string | null
          created_at?: string
          email?: string
          has_access_schedule?: boolean | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          is_billing_paused?: boolean
          job_function?: string | null
          last_access_at?: string | null
          lunch_end?: string | null
          lunch_start?: string | null
          name?: string
          payment_due_date?: number | null
          permissions?: Json | null
          personal_phone?: string | null
          pix_key?: string | null
          pix_type?: string | null
          requires_password_change?: boolean
          rg?: string | null
          role?: string
          state?: string | null
          username?: string | null
          whatsapp_group_link?: string | null
          work_end?: string | null
          work_start?: string | null
        }
        Relationships: []
      }
      scan_service_blocks: {
        Row: {
          block_date: string | null
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          recurrence: string
          start_time: string
        }
        Insert: {
          block_date?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          recurrence: string
          start_time: string
        }
        Update: {
          block_date?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          recurrence?: string
          start_time?: string
        }
        Relationships: []
      }
      scan_service_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          dentist_id: string
          end_time: string
          id: string
          notes: string | null
          patient_name: string
          start_time: string
          status: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          dentist_id: string
          end_time: string
          id?: string
          notes?: string | null
          patient_name: string
          start_time: string
          status?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          dentist_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_name?: string
          start_time?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'scan_service_bookings_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      scan_service_settings: {
        Row: {
          day_of_week: number
          end_time: string | null
          id: string
          is_available: boolean | null
          slot_duration_minutes: number | null
          start_time: string | null
        }
        Insert: {
          day_of_week: number
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          slot_duration_minutes?: number | null
          start_time?: string | null
        }
        Update: {
          day_of_week?: number
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          slot_duration_minutes?: number | null
          start_time?: string | null
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          dentist_id: string
          discount: number | null
          due_date: string | null
          id: string
          note: string | null
          orders_snapshot: Json
          paid_at: string | null
          payment_method: string | null
          status: string
          total_installments: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          dentist_id: string
          discount?: number | null
          due_date?: string | null
          id?: string
          note?: string | null
          orders_snapshot: Json
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          total_installments?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          dentist_id?: string
          discount?: number | null
          due_date?: string | null
          id?: string
          note?: string | null
          orders_snapshot?: Json
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          total_installments?: number | null
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
      vw_secure_scan_bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          dentist_id: string | null
          dentist_name: string | null
          end_time: string | null
          id: string | null
          notes: string | null
          patient_name: string | null
          start_time: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'scan_service_bookings_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      delete_user: { Args: { target_user_id: string }; Returns: undefined }
      get_current_user_role: { Args: never; Returns: string }
      get_public_order_full_details: {
        Args: { target_order_id: string }
        Returns: Json
      }
      get_public_order_guide: {
        Args: { target_order_id: string }
        Returns: Json
      }
      is_current_user_active: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
