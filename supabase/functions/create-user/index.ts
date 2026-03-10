import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js'

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
    const supabase = createClient(supabaseUrl, supabaseKey)

    const {
      email,
      password,
      name,
      role,
      clinic,
      phone,
      permissions,
      whatsapp_group_link,
      personal_phone,
      requires_password_change,
    } = await req.json()

    // Generate dummy email if not provided
    const finalEmail = email || `staff-${Date.now()}@vitalilab.local`
    const finalPassword = password || `vitali${Math.floor(Math.random() * 1000000)}`
    const phoneToUse = phone || personal_phone || null

    const payload: any = {
      email: finalEmail,
      password: finalPassword,
      email_confirm: true,
      user_metadata: { name, role, clinic, phone: phoneToUse, whatsapp_group_link },
    }

    const cleanPhone = phoneToUse ? phoneToUse.replace(/\D/g, '') : null
    if (cleanPhone) {
      payload.phone = cleanPhone
      payload.phone_confirm = true
    }

    let { data, error } = await supabase.auth.admin.createUser(payload)

    // If it fails because phone is already in use, try without phone
    if (error && error.message.toLowerCase().includes('phone')) {
      delete payload.phone
      delete payload.phone_confirm
      const fallback = await supabase.auth.admin.createUser(payload)
      data = fallback.data
      error = fallback.error
    }

    if (error) throw error

    await new Promise((resolve) => setTimeout(resolve, 500))

    const updateData: any = { is_approved: true, is_active: true }
    if (permissions && permissions.length > 0) updateData.permissions = permissions
    if (whatsapp_group_link) updateData.whatsapp_group_link = whatsapp_group_link
    if (phoneToUse) updateData.personal_phone = phoneToUse
    if (requires_password_change !== undefined)
      updateData.requires_password_change = requires_password_change

    if (Object.keys(updateData).length > 0) {
      await supabase.from('profiles').update(updateData).eq('id', data.user.id)
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
