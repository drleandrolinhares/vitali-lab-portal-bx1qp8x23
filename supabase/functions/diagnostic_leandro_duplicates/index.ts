import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    // Consultando a tabela de perfis (que funciona como users/dentists)
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, role, created_at, is_active, clinic')
      .ilike('name', '%Leandro%')

    if (profilesError) throw profilesError

    const profileIds = profilesData.map((p) => p.id)

    let ordersData: any[] = []

    // Contagem de pedidos por dentista
    if (profileIds.length > 0) {
      const { data: orders, error: ordersError } = await supabaseAdmin
        .from('orders')
        .select('id, dentist_id')
        .in('dentist_id', profileIds)

      if (ordersError) throw ordersError
      ordersData = orders || []
    }

    const orderCounts = ordersData.reduce((acc: Record<string, number>, order: any) => {
      acc[order.dentist_id] = (acc[order.dentist_id] || 0) + 1
      return acc
    }, {})

    // 1. Tabela "users" (Mapeada dos perfis)
    const users = profilesData.map((p) => ({
      id: p.id,
      email: p.email,
      name: p.name,
      role: p.role,
      created_at: p.created_at,
      is_active: p.is_active,
    }))

    // 2. Tabela "dentists" (Mapeada dos perfis com clínicas/funções específicas)
    const dentists = profilesData.map((p) => ({
      id: p.id,
      user_id: p.id,
      name: p.name,
      clinic_name: p.clinic,
      is_active: p.is_active,
    }))

    // 3. Vínculo com orders
    const orders_summary = profilesData.map((p) => ({
      dentist_id: p.id,
      dentist_name: p.name,
      order_count: orderCounts[p.id] || 0,
    }))

    return new Response(
      JSON.stringify(
        {
          success: true,
          data: {
            diagnostic_info: 'Diagnostic report for Leandro duplicates',
            users: users,
            dentists: dentists,
            orders_by_dentist: orders_summary,
          },
        },
        null,
        2,
      ),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
