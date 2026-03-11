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
// Table: order_history
//   id: uuid (not null, default: gen_random_uuid())
//   order_id: uuid (not null)
//   status: text (not null)
//   note: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
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
// Table: settlements
//   id: uuid (not null, default: gen_random_uuid())
//   dentist_id: uuid (not null)
//   amount: numeric (not null)
//   orders_snapshot: jsonb (not null)
//   created_at: timestamp with time zone (not null, default: now())

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
//   UNIQUE kanban_stages_name_key: UNIQUE (name)
//   PRIMARY KEY kanban_stages_pkey: PRIMARY KEY (id)
// Table: order_history
//   FOREIGN KEY order_history_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_history_pkey: PRIMARY KEY (id)
// Table: orders
//   FOREIGN KEY orders_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY orders_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id) ON DELETE CASCADE
//   FOREIGN KEY orders_dre_category_fkey: FOREIGN KEY (dre_category) REFERENCES dre_categories(name) ON UPDATE CASCADE
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
// Table: price_list
//   PRIMARY KEY price_list_pkey: PRIMARY KEY (id)
// Table: price_stages
//   PRIMARY KEY price_stages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_stages_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
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
//   Policy "Admin delete inventory_items" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin/Reception insert inventory_items" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception update inventory_items" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception view inventory_items" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
// Table: inventory_transactions
//   Policy "Admin/Reception insert inventory_transactions" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin/Reception view inventory_transactions" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
// Table: kanban_stages
//   Policy "Admin kanban_stages all" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public kanban_stages view" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: order_history
//   Policy "Dentists can view own order history, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text, 'master'::text])))))))))
//   Policy "Lab can insert order history, dentists can insert for own" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text, 'master'::text])))))))))
// Table: orders
//   Policy "Admin can delete orders" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Dentists can insert own orders" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))))))
//   Policy "Dentists can view own orders, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))))))
//   Policy "Lab can update all orders, dentists can update own" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))))))
// Table: price_list
//   Policy "Admin price_list delete" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_list insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Admin price_list update" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text])))))
//   Policy "Public price_list view" (SELECT, PERMISSIVE) roles={public}
//     USING: true
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
//   Policy "Lab users can update profiles." (UPDATE, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles_1.role    FROM profiles profiles_1   WHERE (profiles_1.id = auth.uid())) = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))
//   Policy "Public profiles are viewable by authenticated users." (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Users can insert own profile." (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own profile." (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
// Table: settlements
//   Policy "Admin insert settlements" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text])))))
//   Policy "Admin view all settlements, dentists view own" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text]))))))

// --- DATABASE FUNCTIONS ---
// FUNCTION delete_user(uuid)
//   CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF EXISTS (
//       SELECT 1 FROM public.profiles
//       WHERE id = auth.uid() AND role IN ('admin', 'master')
//     ) THEN
//       DELETE FROM auth.users WHERE id = target_user_id;
//     ELSE
//       RAISE EXCEPTION 'Unauthorized';
//     END IF;
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
// FUNCTION protect_is_approved()
//   CREATE OR REPLACE FUNCTION public.protect_is_approved()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
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

// --- INDEXES ---
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC)
//   CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id)
// Table: billing_controls
//   CREATE UNIQUE INDEX billing_controls_dentist_id_month_key ON public.billing_controls USING btree (dentist_id, month)
// Table: kanban_stages
//   CREATE UNIQUE INDEX kanban_stages_name_key ON public.kanban_stages USING btree (name)
