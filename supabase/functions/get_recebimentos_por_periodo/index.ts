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

    const body = await req.json().catch(() => ({}))
    const { data_inicio, data_fim } = body

    let query = supabaseAdmin
      .from('recebimentos')
      .select('*')
      .order('data_recebimento', { ascending: false })

    if (data_inicio) {
      query = query.gte('data_recebimento', data_inicio)
    }
    if (data_fim) {
      query = query.lte('data_recebimento', data_fim)
    }

    const { data, error } = await query

    if (error) throw error

    const recebimentos = data || []
    const quantidade_casos = recebimentos.length
    const valor_total = recebimentos.reduce(
      (acc, curr) => acc + Number(curr.valor_recebido || 0),
      0,
    )
    const ticket_medio = quantidade_casos > 0 ? valor_total / quantidade_casos : 0

    return new Response(
      JSON.stringify({
        data: {
          quantidade_casos,
          valor_total,
          ticket_medio,
          recebimentos,
        },
        success: true,
      }),
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
