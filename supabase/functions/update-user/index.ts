import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const {
      userId,
      email,
      password,
      name,
      role,
      clinic,
      phone,
      permissions,
      whatsapp_group_link,
      personal_phone,
      is_active,
      job_function,
    } = await req.json()

    if (!userId) throw new Error('UserId is required')

    const phoneToUse = phone || personal_phone || null

    const authPayload: any = {
      email_confirm: true,
      user_metadata: { name, role, clinic, phone: phoneToUse, whatsapp_group_link },
    }
    if (email) authPayload.email = email
    if (password) authPayload.password = password

    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      authPayload,
    )
    if (authError) throw authError

    const updateData: any = { name, role, is_active }
    if (clinic !== undefined) updateData.clinic = clinic
    if (email) updateData.email = email
    if (permissions !== undefined) updateData.permissions = permissions
    if (whatsapp_group_link !== undefined) updateData.whatsapp_group_link = whatsapp_group_link
    if (phoneToUse !== undefined) updateData.personal_phone = phoneToUse
    if (job_function !== undefined) updateData.job_function = job_function

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
    if (profileError) throw profileError

    return new Response(JSON.stringify({ data: authData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
