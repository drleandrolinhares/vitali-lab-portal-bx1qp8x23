// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
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
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "billing_controls_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "billing_installments_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_installments_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      cadista_services: {
        Row: {
          cadista_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          price: number
        }
        Insert: {
          cadista_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
        }
        Update: {
          cadista_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "cadista_services_cadista_id_fkey"
            columns: ["cadista_id"]
            isOneToOne: false
            referencedRelation: "cadistas"
            referencedColumns: ["id"]
          },
        ]
      }
      cadistas: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
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
            foreignKeyName: "dentist_boxes_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dentist_boxes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
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
            foreignKeyName: "expenses_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_dre_category_fkey"
            columns: ["dre_category"]
            isOneToOne: false
            referencedRelation: "dre_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "expenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
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
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
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
            foreignKeyName: "order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
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
            foreignKeyName: "order_repetitions_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_repetitions_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_repetitions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          base_price: number
          cadista_id: string | null
          cadista_price: number | null
          cadista_service_id: string | null
          cleared_balance: number
          color_and_considerations: string | null
          created_at: string
          created_by: string | null
          custo_adicional_descricao: string | null
          custo_adicional_valor: number | null
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
          cadista_id?: string | null
          cadista_price?: number | null
          cadista_service_id?: string | null
          cleared_balance?: number
          color_and_considerations?: string | null
          created_at?: string
          created_by?: string | null
          custo_adicional_descricao?: string | null
          custo_adicional_valor?: number | null
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
          cadista_id?: string | null
          cadista_price?: number | null
          cadista_service_id?: string | null
          cleared_balance?: number
          color_and_considerations?: string | null
          created_at?: string
          created_by?: string | null
          custo_adicional_descricao?: string | null
          custo_adicional_valor?: number | null
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
            foreignKeyName: "orders_cadista_id_fkey"
            columns: ["cadista_id"]
            isOneToOne: false
            referencedRelation: "cadistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_cadista_service_id_fkey"
            columns: ["cadista_service_id"]
            isOneToOne: false
            referencedRelation: "cadista_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_dre_category_fkey"
            columns: ["dre_category"]
            isOneToOne: false
            referencedRelation: "dre_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "orders_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
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
            foreignKeyName: "partner_prices_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_prices_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_list"
            referencedColumns: ["id"]
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
            foreignKeyName: "price_list_exclusive_dentist_id_fkey"
            columns: ["exclusive_dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "price_stages_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_list"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          address_complement: string | null
          address_number: string | null
          allowed_sectors: string[] | null
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
          allowed_sectors?: string[] | null
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
          allowed_sectors?: string[] | null
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
            foreignKeyName: "scan_service_bookings_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "settlements_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "scan_service_bookings_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: app_settings
//   key: text (not null)
//   value: text (not null)
//   updated_at: timestamp with time zone (not null, default: now())
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   action: text (not null)
//   entity_type: text (not null)
//   entity_id: text (nullable)
//   details: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: billing_controls
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   month: text (not null)
//   status: text (not null, default: 'sent'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: billing_installments
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   total_amount: numeric (not null)
//   installment_value: numeric (not null)
//   total_installments: integer (not null)
//   remaining_installments: integer (not null)
//   status: text (not null, default: 'active'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   settlement_id: uuid (nullable)
//   start_month: text (nullable)
//   due_date: date (nullable)
//   paid_at: timestamp with time zone (nullable)
//   installment_number: integer (nullable, default: 1)
//   note: text (nullable)
//   payment_method: text (nullable)
// Table: cadista_services
//   id: uuid (not null, default: gen_random_uuid())
//   cadista_id: uuid (not null)
//   name: text (not null)
//   price: numeric (not null, default: 0)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: cadistas
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: dentist_boxes
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   box_number: text (not null)
//   order_id: uuid (nullable)
//   status: text (not null, default: 'with_dentist'::text)
//   sent_at: timestamp with time zone (not null, default: now())
//   returned_at: timestamp with time zone (nullable)
// Table: dre_categories
//   name: text (not null)
//   category_type: text (not null, default: 'fixed'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: expenses
//   id: uuid (not null, default: gen_random_uuid())
//   description: text (not null)
//   cost_center: text (not null)
//   due_date: date (not null)
//   amount: numeric (not null)
//   status: text (not null, default: 'pending'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   sector: text (not null, default: 'Soluções Cerâmicas'::text)
//   category: text (nullable, default: 'Geral'::text)
//   classification: text (nullable)
//   purchase_date: date (nullable)
//   payment_method: text (nullable)
//   is_recurring: boolean (nullable, default: false)
//   recurring_day: integer (nullable)
//   installment_current: integer (nullable)
//   installment_total: integer (nullable)
//   dre_category: text (not null, default: 'Outros'::text)
//   dentist_id: uuid (nullable)
//   order_id: uuid (nullable)
// Table: inventory_items
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   unit_price: numeric (not null, default: 0)
//   quantity: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   sector: text (not null, default: 'Soluções Cerâmicas'::text)
//   purchase_cost: numeric (nullable, default: 0)
//   packaging_type: text (nullable, default: ''::text)
//   usage_factor: numeric (nullable, default: 1)
//   storage_location: text (nullable, default: ''::text)
//   last_purchase_brand: text (nullable)
//   last_purchase_value: numeric (nullable)
//   observations: text (nullable)
//   items_per_box: numeric (nullable, default: 1)
//   packaging_types: jsonb (nullable, default: '[]'::jsonb)
//   minimum_stock_level: numeric (not null, default: 0)
//   brand: text (nullable)
//   specification: text (nullable)
//   color: text (nullable)
//   do_not_buy: boolean (nullable, default: false)
//   do_not_buy_reason: text (nullable)
//   specificity: text (nullable)
// Table: inventory_transactions
//   id: uuid (not null, default: gen_random_uuid())
//   item_id: uuid (not null)
//   type: text (not null)
//   quantity: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: kanban_stages
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   order_index: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   description: text (nullable)
//   sector: text (not null, default: 'SOLUÇÕES CERÂMICAS'::text)
// Table: order_history
//   id: uuid (not null, default: gen_random_uuid())
//   order_id: uuid (not null)
//   status: text (not null)
//   note: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: order_repetitions
//   id: uuid (not null, default: gen_random_uuid())
//   order_id: uuid (not null)
//   dentist_id: uuid (nullable)
//   work_type: text (not null)
//   reason: text (not null)
//   details: text (nullable)
//   estimated_loss: numeric (not null, default: 0)
//   logged_at: timestamp with time zone (not null, default: now())
//   logged_by: uuid (nullable)
// Table: orders
//   id: uuid (not null, default: gen_random_uuid())
//   friendly_id: text (not null, default: ('ORD-'::text || to_char(nextval('order_seq'::regclass), 'FM0000'::text)))
//   patient_name: text (not null)
//   dentist_id: uuid (not null)
//   work_type: text (not null)
//   material: text (not null)
//   tooth_or_arch: jsonb (nullable, default: '[]'::jsonb)
//   color_and_considerations: text (nullable)
//   scale_used: text (nullable)
//   shipping_method: text (not null)
//   shipping_details: text (nullable)
//   observations: text (nullable)
//   status: text (not null, default: 'pending'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   sector: text (not null, default: 'SOLUÇÕES CERÂMICAS'::text)
//   kanban_stage: text (not null, default: 'TRIAGEM'::text)
//   cleared_balance: numeric (not null, default: 0)
//   patient_cpf: text (nullable)
//   patient_birth_date: date (nullable)
//   dre_category: text (not null, default: 'Receita'::text)
//   is_acknowledged: boolean (not null, default: false)
//   base_price: numeric (not null, default: 0)
//   file_urls: jsonb (nullable, default: '[]'::jsonb)
//   implant_brand: text (nullable)
//   implant_type: text (nullable)
//   estrutura_fixacao: text (not null, default: 'SOBRE DENTE'::text)
//   created_by: uuid (nullable)
//   settlement_id: uuid (nullable)
//   is_adjustment_return: boolean (nullable, default: false)
//   cadista_id: uuid (nullable)
//   cadista_service_id: uuid (nullable)
//   cadista_price: numeric (nullable)
//   custo_adicional_descricao: text (nullable)
//   custo_adicional_valor: numeric (nullable, default: 0)
// Table: partner_prices
//   id: uuid (not null, default: gen_random_uuid())
//   partner_id: uuid (not null)
//   price_list_id: uuid (not null)
//   custom_price: numeric (not null)
//   is_enabled: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: price_list
//   id: uuid (not null, default: gen_random_uuid())
//   category: text (not null)
//   work_type: text (not null)
//   price: text (not null)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   sector: text (not null, default: 'Soluções Cerâmicas'::text)
//   material: text (not null, default: ''::text)
//   execution_time: numeric (nullable, default: 0)
//   cadista_cost: numeric (nullable, default: 0)
//   material_cost: numeric (nullable, default: 0)
//   fixed_cost: numeric (nullable, default: 0)
//   estrutura_fixacao: text (not null, default: 'SOBRE DENTE'::text)
//   is_hidden: boolean (not null, default: false)
//   exclusive_dentist_id: uuid (nullable)
// Table: price_stages
//   id: uuid (not null, default: gen_random_uuid())
//   price_list_id: uuid (not null)
//   name: text (not null)
//   price: numeric (not null, default: 0)
//   kanban_stage: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   role: text (not null, default: 'dentist'::text)
//   clinic: text (nullable)
//   closing_date: integer (nullable)
//   payment_due_date: integer (nullable)
//   personal_phone: text (nullable)
//   clinic_contact_name: text (nullable)
//   clinic_contact_role: text (nullable)
//   clinic_contact_phone: text (nullable)
//   whatsapp_group_link: text (nullable)
//   avatar_url: text (nullable)
//   permissions: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   is_approved: boolean (not null, default: false)
//   commercial_agreement: numeric (not null, default: 0)
//   job_function: text (nullable)
//   is_active: boolean (not null, default: true)
//   work_start: text (nullable)
//   lunch_start: text (nullable)
//   lunch_end: text (nullable)
//   work_end: text (nullable)
//   requires_password_change: boolean (not null, default: false)
//   assigned_dentists: jsonb (nullable)
//   can_move_kanban_cards: boolean (nullable, default: true)
//   username: text (nullable)
//   rg: text (nullable)
//   cpf: text (nullable)
//   birth_date: date (nullable)
//   cep: text (nullable)
//   address: text (nullable)
//   address_number: text (nullable)
//   address_complement: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   has_access_schedule: boolean (nullable, default: false)
//   last_access_at: timestamp with time zone (nullable)
//   is_billing_paused: boolean (not null, default: false)
//   pix_key: text (nullable)
//   pix_type: text (nullable)
//   bank_name: text (nullable)
//   allowed_sectors: _text (nullable, default: ARRAY['SOLUÇÕES CERÂMICAS'::text, 'STÚDIO ACRÍLICO'::text])
// Table: scan_service_blocks
//   id: uuid (not null, default: gen_random_uuid())
//   start_time: time without time zone (not null)
//   end_time: time without time zone (not null)
//   block_date: date (nullable)
//   recurrence: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   day_of_week: integer (nullable)
// Table: scan_service_bookings
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   patient_name: text (not null)
//   booking_date: date (not null)
//   start_time: time without time zone (not null)
//   end_time: time without time zone (not null)
//   status: text (nullable, default: 'confirmed'::text)
//   notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: scan_service_settings
//   id: uuid (not null, default: gen_random_uuid())
//   day_of_week: integer (not null)
//   is_available: boolean (nullable, default: true)
//   start_time: time without time zone (nullable, default: '08:00:00'::time without time zone)
//   end_time: time without time zone (nullable, default: '18:00:00'::time without time zone)
//   slot_duration_minutes: integer (nullable, default: 60)
// Table: settlements
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   amount: numeric (not null)
//   orders_snapshot: jsonb (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   discount: numeric (nullable, default: 0)
//   payment_method: text (nullable)
//   total_installments: integer (nullable, default: 1)
//   status: text (not null, default: 'pending'::text)
//   due_date: date (nullable)
//   paid_at: timestamp with time zone (nullable)
//   note: text (nullable)
// Table: vw_secure_scan_bookings
//   id: uuid (nullable)
//   dentist_id: uuid (nullable)
//   booking_date: date (nullable)
//   start_time: time without time zone (nullable)
//   end_time: time without time zone (nullable)
//   status: text (nullable)
//   created_at: timestamp with time zone (nullable)
//   patient_name: text (nullable)
//   notes: text (nullable)
//   dentist_name: text (nullable)

// --- CONSTRAINTS ---
// Table: app_settings
//   PRIMARY KEY app_settings_pkey: PRIMARY KEY (key)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY audit_logs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: billing_controls
//   FOREIGN KEY billing_controls_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE billing_controls_dentist_id_month_key: UNIQUE (dentist_id, month)
//   PRIMARY KEY billing_controls_pkey: PRIMARY KEY (id)
// Table: billing_installments
//   FOREIGN KEY billing_installments_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   PRIMARY KEY billing_installments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY billing_installments_settlement_id_fkey: FOREIGN KEY (settlement_id) REFERENCES settlements(id) ON DELETE CASCADE
// Table: cadista_services
//   FOREIGN KEY cadista_services_cadista_id_fkey: FOREIGN KEY (cadista_id) REFERENCES cadistas(id) ON DELETE CASCADE
//   PRIMARY KEY cadista_services_pkey: PRIMARY KEY (id)
// Table: cadistas
//   PRIMARY KEY cadistas_pkey: PRIMARY KEY (id)
// Table: dentist_boxes
//   FOREIGN KEY dentist_boxes_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   FOREIGN KEY dentist_boxes_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
//   PRIMARY KEY dentist_boxes_pkey: PRIMARY KEY (id)
// Table: dre_categories
//   PRIMARY KEY dre_categories_pkey: PRIMARY KEY (name)
// Table: expenses
//   FOREIGN KEY expenses_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY expenses_dre_category_fkey: FOREIGN KEY (dre_category) REFERENCES dre_categories(name) ON UPDATE CASCADE
//   FOREIGN KEY expenses_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
//   PRIMARY KEY expenses_pkey: PRIMARY KEY (id)
// Table: inventory_items
//   PRIMARY KEY inventory_items_pkey: PRIMARY KEY (id)
// Table: inventory_transactions
//   FOREIGN KEY inventory_transactions_item_id_fkey: FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_transactions_pkey: PRIMARY KEY (id)
// Table: kanban_stages
//   UNIQUE kanban_stages_name_sector_key: UNIQUE (name, sector)
//   PRIMARY KEY kanban_stages_pkey: PRIMARY KEY (id)
// Table: order_history
//   FOREIGN KEY order_history_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_history_pkey: PRIMARY KEY (id)
// Table: order_repetitions
//   FOREIGN KEY order_repetitions_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY order_repetitions_logged_by_fkey: FOREIGN KEY (logged_by) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY order_repetitions_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_repetitions_pkey: PRIMARY KEY (id)
// Table: orders
//   FOREIGN KEY orders_cadista_id_fkey: FOREIGN KEY (cadista_id) REFERENCES cadistas(id) ON DELETE SET NULL
//   FOREIGN KEY orders_cadista_service_id_fkey: FOREIGN KEY (cadista_service_id) REFERENCES cadista_services(id) ON DELETE SET NULL
//   FOREIGN KEY orders_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY orders_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   FOREIGN KEY orders_dre_category_fkey: FOREIGN KEY (dre_category) REFERENCES dre_categories(name) ON UPDATE CASCADE
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
//   FOREIGN KEY orders_settlement_id_fkey: FOREIGN KEY (settlement_id) REFERENCES settlements(id) ON DELETE SET NULL
// Table: partner_prices
//   FOREIGN KEY partner_prices_partner_id_fkey: FOREIGN KEY (partner_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE partner_prices_partner_id_price_list_id_key: UNIQUE (partner_id, price_list_id)
//   PRIMARY KEY partner_prices_pkey: PRIMARY KEY (id)
//   FOREIGN KEY partner_prices_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: price_list
//   FOREIGN KEY price_list_exclusive_dentist_id_fkey: FOREIGN KEY (exclusive_dentist_id) REFERENCES profiles(id) ON DELETE SET NULL
//   PRIMARY KEY price_list_pkey: PRIMARY KEY (id)
// Table: price_stages
//   PRIMARY KEY price_stages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_stages_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: scan_service_blocks
//   PRIMARY KEY scan_service_blocks_pkey: PRIMARY KEY (id)
//   CHECK scan_service_blocks_recurrence_check: CHECK ((recurrence = ANY (ARRAY['unique'::text, 'daily'::text, 'weekly'::text, 'monthly'::text])))
// Table: scan_service_bookings
//   FOREIGN KEY scan_service_bookings_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id)
//   PRIMARY KEY scan_service_bookings_pkey: PRIMARY KEY (id)
// Table: scan_service_settings
//   CHECK scan_service_settings_day_of_week_check: CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
//   PRIMARY KEY scan_service_settings_pkey: PRIMARY KEY (id)
// Table: settlements
//   FOREIGN KEY settlements_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   PRIMARY KEY settlements_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: app_settings
//   Policy "Admin app_settings all" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public app_settings view" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: audit_logs
//   Policy "Admin select audit logs" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Authenticated insert audit logs" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
// Table: billing_controls
//   Policy "Admin access billing_controls" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Public read billing_controls" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: billing_installments
//   Policy "Admin access billing_installments" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'financial'::text])))))
//   Policy "Dentist read own billing_installments" (SELECT, PERMISSIVE) roles={public}
//     USING: (dentist_id = auth.uid())
// Table: cadista_services
//   Policy "Admin cadista_services all" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Staff cadista_services read" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
// Table: cadistas
//   Policy "Admin cadistas all" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Staff cadistas read" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
// Table: dentist_boxes
//   Policy "Admin access dentist_boxes" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text])))))
//   Policy "Dentist view own boxes" (SELECT, PERMISSIVE) roles={public}
//     USING: (dentist_id = auth.uid())
// Table: dre_categories
//   Policy "Admin write dre_categories" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public read dre_categories" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: expenses
//   Policy "Admin/Reception delete expenses" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception insert expenses" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception update expenses" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception view expenses" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
// Table: inventory_items
//   Policy "Staff delete inventory_items" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
//   Policy "Staff insert inventory_items" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
//   Policy "Staff update inventory_items" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
//   Policy "Staff view inventory_items" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
// Table: inventory_transactions
//   Policy "Staff insert inventory_transactions" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
//   Policy "Staff view inventory_transactions" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
// Table: kanban_stages
//   Policy "Admin kanban_stages all" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public kanban_stages view" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: order_history
//   Policy "Dentists can view own order history, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: (is_current_user_active() AND (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))))))
//   Policy "Lab can insert order history, dentists can insert for own" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (is_current_user_active() AND (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))))))
// Table: order_repetitions
//   Policy "Admin access order_repetitions" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text])))))
// Table: orders
//   Policy "Admin can delete orders" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Dentists can insert own orders" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (is_current_user_active() AND ((EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text]))))) OR ((dentist_id = auth.uid()) AND (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['dentist'::text, 'laboratory'::text])))))) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])) AND ((profiles.assigned_dentists IS NULL) OR (jsonb_typeof(profiles.assigned_dentists) <> 'array'::text) OR (jsonb_array_length(profiles.assigned_dentists) = 0) OR (profiles.assigned_dentists @> jsonb_build_array(orders.dentist_id))))))))
//   Policy "Dentists can view own orders, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: (is_current_user_active() AND ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))))
//   Policy "Lab can update all orders, dentists can update own" (UPDATE, PERMISSIVE) roles={public}
//     USING: (is_current_user_active() AND ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))))
// Table: partner_prices
//   Policy "Admin and master can manage partner prices" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Laboratories can read own partner prices" (SELECT, PERMISSIVE) roles={public}
//     USING: (partner_id = auth.uid())
// Table: price_list
//   Policy "Admin price_list delete" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_list insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_list update" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public price_list view" (SELECT, PERMISSIVE) roles={public}
//     USING: ((EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['master'::text, 'admin'::text]))))) OR ((is_hidden = false) AND ((exclusive_dentist_id IS NULL) OR (exclusive_dentist_id = auth.uid()))))
// Table: price_stages
//   Policy "Admin price_stages delete" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_stages insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_stages update" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public price_stages view" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: profiles
//   Policy "Admin can update any profile." (UPDATE, PERMISSIVE) roles={public}
//     USING: (get_current_user_role() = ANY (ARRAY['admin'::text, 'master'::text]))
//   Policy "Profiles are viewable by authorized users." (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = id) OR (get_current_user_role() = ANY (ARRAY['admin'::text, 'master'::text])) OR ((get_current_user_role() = ANY (ARRAY['receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])) AND (role = ANY (ARRAY['dentist'::text, 'laboratory'::text]))))
//   Policy "Users can insert own profile." (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own profile." (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: ((auth.uid() = id) AND (role = get_current_user_role()))
// Table: scan_service_blocks
//   Policy "Admin manage blocks" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Auth read blocks" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: scan_service_bookings
//   Policy "Admin and staff can do all on scan bookings" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
//   Policy "Authenticated users can select all scan bookings" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Dentists can delete their own bookings" (DELETE, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))
//   Policy "Dentists can insert their own bookings" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))
//   Policy "Dentists can update their own bookings" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))
// Table: scan_service_settings
//   Policy "Admin and master can update scan settings" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Authenticated users can select scan settings" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: settlements
//   Policy "Admin delete settlements" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin insert settlements" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'financial'::text])))))
//   Policy "Admin update settlements" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'financial'::text])))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'financial'::text])))))
//   Policy "Admin view all settlements, dentists view own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))))))

// --- DATABASE FUNCTIONS ---
// FUNCTION delete_user(uuid)
//   CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     caller_role text;
//     target_role text;
//   BEGIN
//     -- Get the caller's role
//     SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
//     
//     IF caller_role NOT IN ('admin', 'master') THEN
//       RAISE EXCEPTION 'Unauthorized: Apenas administradores ou masters podem excluir usuários.';
//     END IF;
//   
//     -- Get the target user's role
//     SELECT role INTO target_role FROM public.profiles WHERE id = target_user_id;
//   
//     -- Prevent admin from deleting master
//     IF target_role = 'master' AND caller_role != 'master' THEN
//       RAISE EXCEPTION 'Unauthorized: Apenas usuários MASTER podem excluir outro usuário MASTER.';
//     END IF;
//   
//     DELETE FROM auth.users WHERE id = target_user_id;
//   END;
//   $function$
//   
// FUNCTION get_current_user_role()
//   CREATE OR REPLACE FUNCTION public.get_current_user_role()
//    RETURNS text
//    LANGUAGE sql
//    STABLE SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT role FROM public.profiles WHERE id = auth.uid();
//   $function$
//   
// FUNCTION get_public_order_full_details(uuid)
//   CREATE OR REPLACE FUNCTION public.get_public_order_full_details(target_order_id uuid)
//    RETURNS json
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     result json;
//   BEGIN
//     SELECT json_build_object(
//       'id', o.id,
//       'friendly_id', o.friendly_id,
//       'patient_name', o.patient_name,
//       'dentist_name', p.name,
//       'work_type', o.work_type,
//       'material', o.material,
//       'implant_brand', o.implant_brand,
//       'implant_type', o.implant_type,
//       'color_and_considerations', o.color_and_considerations,
//       'shipping_method', o.shipping_method,
//       'tooth_or_arch', o.tooth_or_arch,
//       'observations', o.observations,
//       'status', o.status,
//       'kanban_stage', o.kanban_stage,
//       'created_at', o.created_at,
//       'base_price', o.base_price,
//       'quantity', GREATEST(1, COALESCE(jsonb_array_length(o.tooth_or_arch->'teeth'), 0) + COALESCE(jsonb_array_length(o.tooth_or_arch->'arches'), 0)),
//       'discount', COALESCE(p.commercial_agreement, 0),
//       'creator_name', creator.name,
//       'history', (
//         SELECT COALESCE(json_agg(json_build_object(
//           'id', h.id,
//           'status', h.status,
//           'date', h.created_at,
//           'note', h.note
//         ) ORDER BY h.created_at DESC), '[]'::json)
//         FROM public.order_history h
//         WHERE h.order_id = o.id
//       ),
//       'kanban_stages', (
//         SELECT COALESCE(json_agg(json_build_object(
//           'id', ks.id,
//           'name', ks.name,
//           'orderIndex', ks.order_index
//         ) ORDER BY ks.order_index ASC), '[]'::json)
//         FROM public.kanban_stages ks
//       )
//     )
//     INTO result
//     FROM public.orders o
//     LEFT JOIN public.profiles p ON o.dentist_id = p.id
//     LEFT JOIN public.profiles creator ON o.created_by = creator.id
//     WHERE o.id = target_order_id;
//     
//     RETURN result;
//   END;
//   $function$
//   
// FUNCTION get_public_order_guide(uuid)
//   CREATE OR REPLACE FUNCTION public.get_public_order_guide(target_order_id uuid)
//    RETURNS json
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     result json;
//   BEGIN
//     SELECT json_build_object(
//       'friendly_id', o.friendly_id,
//       'patient_name', o.patient_name,
//       'dentist_name', p.name
//     )
//     INTO result
//     FROM public.orders o
//     LEFT JOIN public.profiles p ON o.dentist_id = p.id
//     WHERE o.id = target_order_id;
//     
//     RETURN result;
//   END;
//   $function$
//   
// FUNCTION handle_new_order()
//   CREATE OR REPLACE FUNCTION public.handle_new_order()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.order_history (order_id, status)
//     VALUES (NEW.id, NEW.status);
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name, role, clinic, personal_phone)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
//       COALESCE(NEW.raw_user_meta_data->>'role', 'dentist'),
//       NEW.raw_user_meta_data->>'clinic',
//       NEW.raw_user_meta_data->>'phone'
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email,
//       name = EXCLUDED.name,
//       role = EXCLUDED.role,
//       clinic = EXCLUDED.clinic,
//       personal_phone = EXCLUDED.personal_phone;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION is_current_user_active()
//   CREATE OR REPLACE FUNCTION public.is_current_user_active()
//    RETURNS boolean
//    LANGUAGE sql
//    STABLE SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT COALESCE(
//       (SELECT is_active FROM public.profiles WHERE id = auth.uid()),
//       false
//     );
//   $function$
//   
// FUNCTION protect_is_approved()
//   CREATE OR REPLACE FUNCTION public.protect_is_approved()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     -- Only execute logic if is_approved is actually changing
//     IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
//       IF auth.uid() IS NOT NULL THEN
//         IF NOT EXISTS (
//           SELECT 1 FROM public.profiles
//           WHERE id = auth.uid() AND role IN ('admin', 'master', 'receptionist')
//         ) THEN
//           NEW.is_approved = OLD.is_approved;
//         END IF;
//       END IF;
//     END IF;
//     
//     -- Ensure other fields like is_active remain untouched by this trigger
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION protect_profile_permissions()
//   CREATE OR REPLACE FUNCTION public.protect_profile_permissions()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     caller_role text;
//   BEGIN
//     IF NEW.permissions IS DISTINCT FROM OLD.permissions THEN
//       IF auth.uid() IS NOT NULL THEN
//         SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
//         
//         IF caller_role NOT IN ('admin', 'master') THEN
//            -- Revert to old permissions to prevent unauthorized escalation
//            NEW.permissions = OLD.permissions;
//         END IF;
//       END IF;
//     END IF;
//     
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION protect_profile_role()
//   CREATE OR REPLACE FUNCTION public.protect_profile_role()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     caller_role text;
//   BEGIN
//     IF NEW.role IS DISTINCT FROM OLD.role THEN
//       IF auth.uid() IS NOT NULL THEN
//         SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
//         
//         -- Only master can assign or remove master
//         IF caller_role != 'master' AND (NEW.role = 'master' OR OLD.role = 'master') THEN
//           RAISE EXCEPTION 'Unauthorized: Apenas usuários MASTER podem modificar a função MASTER.';
//         END IF;
//   
//         -- Only admin or master can change roles
//         IF caller_role NOT IN ('admin', 'master') THEN
//           RAISE EXCEPTION 'Unauthorized: Apenas administradores podem alterar funções.';
//         END IF;
//       END IF;
//     END IF;
//     
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_inventory_quantity()
//   CREATE OR REPLACE FUNCTION public.update_inventory_quantity()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.type = 'in' THEN
//           UPDATE inventory_items SET quantity = quantity + NEW.quantity WHERE id = NEW.item_id;
//       ELSIF NEW.type = 'out' THEN
//           UPDATE inventory_items SET quantity = quantity - NEW.quantity WHERE id = NEW.item_id;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: inventory_transactions
//   on_inventory_transaction: CREATE TRIGGER on_inventory_transaction AFTER INSERT ON public.inventory_transactions FOR EACH ROW EXECUTE FUNCTION update_inventory_quantity()
// Table: orders
//   on_order_created: CREATE TRIGGER on_order_created AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION handle_new_order()
// Table: profiles
//   protect_is_approved_trigger: CREATE TRIGGER protect_is_approved_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION protect_is_approved()
//   protect_profile_permissions_trigger: CREATE TRIGGER protect_profile_permissions_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION protect_profile_permissions()
//   protect_profile_role_trigger: CREATE TRIGGER protect_profile_role_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION protect_profile_role()

// --- INDEXES ---
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC)
//   CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id)
// Table: billing_controls
//   CREATE UNIQUE INDEX billing_controls_dentist_id_month_key ON public.billing_controls USING btree (dentist_id, month)
// Table: billing_installments
//   CREATE INDEX idx_billing_inst_due_date ON public.billing_installments USING btree (due_date)
//   CREATE INDEX idx_billing_inst_status ON public.billing_installments USING btree (status)
// Table: expenses
//   CREATE INDEX idx_expenses_status_due_date ON public.expenses USING btree (status, due_date)
// Table: kanban_stages
//   CREATE UNIQUE INDEX kanban_stages_name_sector_key ON public.kanban_stages USING btree (name, sector)
// Table: orders
//   CREATE INDEX idx_orders_dentist_id ON public.orders USING btree (dentist_id)
//   CREATE INDEX idx_orders_kanban_stage ON public.orders USING btree (kanban_stage)
//   CREATE INDEX idx_orders_settlement_id ON public.orders USING btree (settlement_id)
//   CREATE INDEX idx_orders_status ON public.orders USING btree (status)
// Table: partner_prices
//   CREATE UNIQUE INDEX partner_prices_partner_id_price_list_id_key ON public.partner_prices USING btree (partner_id, price_list_id)
// Table: price_list
//   CREATE INDEX idx_price_list_exclusive_dentist_id ON public.price_list USING btree (exclusive_dentist_id)
// Table: profiles
//   CREATE INDEX idx_profiles_active_approved ON public.profiles USING btree (is_active, is_approved)
//   CREATE INDEX idx_profiles_role ON public.profiles USING btree (role)
// Table: settlements
//   CREATE INDEX idx_settlements_due_date ON public.settlements USING btree (due_date)
//   CREATE INDEX idx_settlements_status ON public.settlements USING btree (status)

