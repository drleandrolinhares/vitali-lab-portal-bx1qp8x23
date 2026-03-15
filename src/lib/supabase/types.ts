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
          id: string
          installment_value: number
          remaining_installments: number
          status: string
          total_amount: number
          total_installments: number
        }
        Insert: {
          created_at?: string
          dentist_id: string
          id?: string
          installment_value: number
          remaining_installments: number
          status?: string
          total_amount: number
          total_installments: number
        }
        Update: {
          created_at?: string
          dentist_id?: string
          id?: string
          installment_value?: number
          remaining_installments?: number
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
          address: string | null
          address_complement: string | null
          address_number: string | null
          assigned_dentists: Json | null
          avatar_url: string | null
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
          assigned_dentists?: Json | null
          avatar_url?: string | null
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
          assigned_dentists?: Json | null
          avatar_url?: string | null
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
      get_public_order_full_details: {
        Args: { target_order_id: string }
        Returns: Json
      }
      get_public_order_guide: {
        Args: { target_order_id: string }
        Returns: Json
      }
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
