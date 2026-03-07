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
          color_and_considerations: string | null
          created_at: string
          dentist_id: string
          friendly_id: string
          id: string
          material: string
          observations: string | null
          patient_name: string
          scale_used: string | null
          shipping_details: string | null
          shipping_method: string
          status: string
          tooth_or_arch: Json | null
          work_type: string
        }
        Insert: {
          color_and_considerations?: string | null
          created_at?: string
          dentist_id: string
          friendly_id?: string
          id?: string
          material: string
          observations?: string | null
          patient_name: string
          scale_used?: string | null
          shipping_details?: string | null
          shipping_method: string
          status?: string
          tooth_or_arch?: Json | null
          work_type: string
        }
        Update: {
          color_and_considerations?: string | null
          created_at?: string
          dentist_id?: string
          friendly_id?: string
          id?: string
          material?: string
          observations?: string | null
          patient_name?: string
          scale_used?: string | null
          shipping_details?: string | null
          shipping_method?: string
          status?: string
          tooth_or_arch?: Json | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          clinic: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          clinic?: string | null
          email: string
          id: string
          name: string
          role?: string
        }
        Update: {
          clinic?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   role: text (not null, default: 'dentist'::text)
//   clinic: text (nullable)

// --- CONSTRAINTS ---
// Table: order_history
//   FOREIGN KEY order_history_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_history_pkey: PRIMARY KEY (id)
// Table: orders
//   FOREIGN KEY orders_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES profiles(id)
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: order_history
//   Policy "Dentists can view own order history, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text])))))))))
//   Policy "Lab can insert order history, dentists can insert for own" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM orders   WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1            FROM profiles           WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text])))))))))
// Table: orders
//   Policy "Dentists can insert own orders" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (dentist_id = auth.uid())
//   Policy "Dentists can view own orders, lab can view all" (SELECT, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text]))))))
//   Policy "Lab can update all orders, dentists can update own" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((dentist_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['receptionist'::text, 'admin'::text]))))))
// Table: profiles
//   Policy "Public profiles are viewable by authenticated users." (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Users can update own profile." (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)

// --- DATABASE FUNCTIONS ---
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
//     INSERT INTO public.profiles (id, email, name, role, clinic)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
//       COALESCE(NEW.raw_user_meta_data->>'role', 'dentist'),
//       NEW.raw_user_meta_data->>'clinic'
//     );
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: orders
//   on_order_created: CREATE TRIGGER on_order_created AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION handle_new_order()
