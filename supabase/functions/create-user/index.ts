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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    const token = authHeader.replace('Bearer ', '')
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

    const {
      data: { user: callerUser },
      error: callerError,
    } = await supabaseAdmin.auth.getUser(token)
    if (callerError || !callerUser) throw new Error('Invalid or expired token')

    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permissions')
      .eq('id', callerUser.id)
      .single()

    if (profileError || !callerProfile) throw new Error('Caller profile not found')

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
      assigned_dentists,
      can_move_kanban_cards,
      username,
      rg,
      cpf,
      birth_date,
      cep,
      address,
      address_number,
      address_complement,
      city,
      state,
      has_access_schedule,
    } = await req.json()

    const isAdmin = callerProfile.role === 'admin' || callerProfile.role === 'master'
    const callerPerms = callerProfile.permissions || {}
    let canAddDentist = false
    if (Array.isArray(callerPerms)) {
      canAddDentist = callerPerms.includes('add-dentist')
    } else if (typeof callerPerms === 'object') {
      canAddDentist = !!callerPerms?.settings?.access
    }

    if (!isAdmin) {
      if (role !== 'dentist') {
        throw new Error('Unauthorized: Apenas administradores podem criar este tipo de usuário.')
      }
      if (!canAddDentist) {
        throw new Error('Unauthorized: Você não tem permissão para adicionar novos dentistas.')
      }
    }

    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    const phoneToUse = phone || personal_phone || null

    const payload: any = {
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role, clinic, phone: phoneToUse, whatsapp_group_link },
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser(payload)

    if (error) throw error

    await new Promise((resolve) => setTimeout(resolve, 500))

    const updateData: any = { is_approved: true, is_active: true }
    if (permissions && Object.keys(permissions).length > 0) updateData.permissions = permissions
    if (whatsapp_group_link) updateData.whatsapp_group_link = whatsapp_group_link
    if (phoneToUse) updateData.personal_phone = phoneToUse
    if (requires_password_change !== undefined)
      updateData.requires_password_change = requires_password_change
    if (assigned_dentists !== undefined) updateData.assigned_dentists = assigned_dentists
    if (can_move_kanban_cards !== undefined)
      updateData.can_move_kanban_cards = can_move_kanban_cards

    if (username !== undefined) updateData.username = username
    if (rg !== undefined) updateData.rg = rg
    if (cpf !== undefined) updateData.cpf = cpf
    if (birth_date !== undefined) updateData.birth_date = birth_date
    if (cep !== undefined) updateData.cep = cep
    if (address !== undefined) updateData.address = address
    if (address_number !== undefined) updateData.address_number = address_number
    if (address_complement !== undefined) updateData.address_complement = address_complement
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (has_access_schedule !== undefined) updateData.has_access_schedule = has_access_schedule

    if (Object.keys(updateData).length > 0) {
      await supabaseAdmin.from('profiles').update(updateData).eq('id', data.user.id)
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
