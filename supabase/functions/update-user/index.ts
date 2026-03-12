import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    const token = authHeader.replace('Bearer ', '')

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    })

    const {
      data: { user: callerUser },
      error: callerError,
    } = await authClient.auth.getUser(token)
    if (callerError || !callerUser)
      throw new Error(`Invalid or expired token: ${callerError?.message || 'User not found'}`)

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permissions')
      .eq('id', callerUser.id)
      .single()

    if (profileError || !callerProfile) throw new Error('Caller profile not found')

    const isAdmin = callerProfile.role === 'admin' || callerProfile.role === 'master'
    const isMaster = callerProfile.role === 'master'

    const callerPerms = callerProfile.permissions || {}
    let canAddDentist = false
    if (Array.isArray(callerPerms)) {
      canAddDentist = callerPerms.includes('add-dentist')
    } else if (typeof callerPerms === 'object') {
      canAddDentist = !!callerPerms?.settings?.access
    }

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

    if (!userId) throw new Error('UserId is required')

    const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (targetProfileError || !targetProfile) throw new Error('Target profile not found')

    // Prevent non-master from editing a master
    if (targetProfile.role === 'master' && !isMaster && callerUser.id !== userId) {
      throw new Error('Unauthorized: Apenas usuários MASTER podem editar perfis MASTER.')
    }

    // Prevent non-master from elevating to master
    if (role === 'master' && !isMaster) {
      throw new Error('Unauthorized: Apenas usuários MASTER podem atribuir a função MASTER.')
    }

    const isUpdatingDentist =
      canAddDentist && (targetProfile.role === 'dentist' || targetProfile.role === undefined)

    if (!isAdmin && callerUser.id !== userId && !isUpdatingDentist) {
      throw new Error('Unauthorized: You can only update your own profile')
    }

    if (!isAdmin && role !== undefined && role !== 'dentist' && callerUser.id !== userId) {
      throw new Error('Unauthorized: Only admins can change roles to non-dentist')
    }

    const { data: targetAuthUser, error: authFetchError } =
      await supabaseAdmin.auth.admin.getUserById(userId)
    if (authFetchError || !targetAuthUser?.user) throw new Error('Target auth user not found')

    let phoneToUse: string | null | undefined = undefined
    if (phone !== undefined) phoneToUse = phone === '' ? null : phone
    if (personal_phone !== undefined) phoneToUse = personal_phone === '' ? null : personal_phone

    const authPayload: any = {
      email_confirm: true,
      user_metadata: {},
    }

    if (name !== undefined) authPayload.user_metadata.name = name
    if (clinic !== undefined) authPayload.user_metadata.clinic = clinic
    if (whatsapp_group_link !== undefined)
      authPayload.user_metadata.whatsapp_group_link = whatsapp_group_link
    if (phoneToUse !== undefined) {
      authPayload.phone = phoneToUse
      authPayload.user_metadata.phone = phoneToUse
    }
    if (role !== undefined) {
      authPayload.user_metadata.role = role
    }

    if (email && email !== targetAuthUser.user.email) {
      authPayload.email = email
    }
    if (password) {
      authPayload.password = password
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      authPayload,
    )
    if (authError) throw authError

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (clinic !== undefined) updateData.clinic = clinic
    if (email !== undefined) updateData.email = email
    if (whatsapp_group_link !== undefined) updateData.whatsapp_group_link = whatsapp_group_link
    if (phoneToUse !== undefined) updateData.personal_phone = phoneToUse
    if (job_function !== undefined) updateData.job_function = job_function

    if (username !== undefined) updateData.username = username === '' ? null : username
    if (rg !== undefined) updateData.rg = rg === '' ? null : rg
    if (cpf !== undefined) updateData.cpf = cpf === '' ? null : cpf
    if (birth_date !== undefined) updateData.birth_date = birth_date === '' ? null : birth_date
    if (cep !== undefined) updateData.cep = cep
    if (address !== undefined) updateData.address = address
    if (address_number !== undefined) updateData.address_number = address_number
    if (address_complement !== undefined)
      updateData.address_complement = address_complement === '' ? null : address_complement
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (has_access_schedule !== undefined) updateData.has_access_schedule = has_access_schedule

    if (password && callerUser.id !== userId) {
      updateData.requires_password_change = true
    }

    if (isAdmin || isUpdatingDentist || isMaster) {
      if (role !== undefined) updateData.role = role
      if (is_active !== undefined) updateData.is_active = is_active
      if (permissions !== undefined) updateData.permissions = permissions
      if (assigned_dentists !== undefined) updateData.assigned_dentists = assigned_dentists
      if (can_move_kanban_cards !== undefined)
        updateData.can_move_kanban_cards = can_move_kanban_cards
    }

    const { error: dbProfileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
    if (dbProfileError) throw dbProfileError

    return new Response(JSON.stringify({ data: authData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
