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

    if (profileError || !callerProfile)
      throw new Error(`Caller profile not found: ${profileError?.message}`)

    const isAdmin = callerProfile.role === 'admin' || callerProfile.role === 'master'
    const isMaster = callerProfile.role === 'master'

    const callerPerms = callerProfile.permissions || {}
    let canAddDentist = false
    if (Array.isArray(callerPerms)) {
      canAddDentist = callerPerms.includes('add-dentist')
    } else if (typeof callerPerms === 'object') {
      canAddDentist = !!callerPerms?.settings?.access
    }

    const body = await req.json()
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
      commercial_agreement,
    } = body

    if (!userId) throw new Error('UserId is required')

    const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (targetProfileError || !targetProfile)
      throw new Error(`Target profile not found: ${targetProfileError?.message}`)

    if (targetProfile.role === 'master' && !isMaster && callerUser.id !== userId) {
      throw new Error('Unauthorized: Apenas usuários MASTER podem editar perfis MASTER.')
    }

    if (role === 'master' && !isMaster) {
      throw new Error('Unauthorized: Apenas usuários MASTER podem atribuir a função MASTER.')
    }

    const isUpdatingDentist =
      canAddDentist &&
      (targetProfile.role === 'dentist' ||
        targetProfile.role === 'laboratory' ||
        !targetProfile.role)

    if (!isAdmin && callerUser.id !== userId && !isUpdatingDentist) {
      throw new Error('Unauthorized: You can only update your own profile')
    }

    if (
      !isAdmin &&
      role !== undefined &&
      role !== 'dentist' &&
      role !== 'laboratory' &&
      callerUser.id !== userId
    ) {
      throw new Error('Unauthorized: Only admins can change roles to non-dentist')
    }

    const { data: targetAuthUser, error: authFetchError } =
      await supabaseAdmin.auth.admin.getUserById(userId)
    if (authFetchError || !targetAuthUser?.user)
      throw new Error(`Target auth user not found: ${authFetchError?.message}`)

    let phoneToUse: string | null | undefined = undefined
    if (phone !== undefined) phoneToUse = phone === '' ? null : phone
    if (personal_phone !== undefined) phoneToUse = personal_phone === '' ? null : personal_phone

    const authPayload: any = {
      user_metadata: {},
    }

    if (name !== undefined) authPayload.user_metadata.name = name
    if (clinic !== undefined) authPayload.user_metadata.clinic = clinic === '' ? null : clinic
    if (whatsapp_group_link !== undefined)
      authPayload.user_metadata.whatsapp_group_link =
        whatsapp_group_link === '' ? null : whatsapp_group_link

    if (phoneToUse !== undefined) {
      authPayload.user_metadata.phone = phoneToUse
      authPayload.phone = phoneToUse
    }

    if (role !== undefined) {
      authPayload.user_metadata.role = role
    }

    let shouldUpdateAuth = false
    if (Object.keys(authPayload.user_metadata).length > 0 || authPayload.phone !== undefined) {
      shouldUpdateAuth = true
    }

    if (email && email.trim() !== '' && email !== targetAuthUser.user.email) {
      authPayload.email = email.trim()
      authPayload.email_confirm = true
      shouldUpdateAuth = true
    }

    if (password && password.trim() !== '') {
      authPayload.password = password
      shouldUpdateAuth = true
    }

    let authData = null
    if (shouldUpdateAuth) {
      if (Object.keys(authPayload.user_metadata).length === 0) {
        delete authPayload.user_metadata
      }

      const { data: updatedAuthData, error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, authPayload)
      if (authError) {
        console.error('Auth update error:', authError)
        throw new Error(
          `Erro ao atualizar usuário no sistema de autenticação: ${authError.message}`,
        )
      }
      authData = updatedAuthData
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (clinic !== undefined) updateData.clinic = clinic === '' ? null : clinic
    if (email !== undefined && email.trim() !== '') updateData.email = email.trim()
    if (whatsapp_group_link !== undefined)
      updateData.whatsapp_group_link = whatsapp_group_link === '' ? null : whatsapp_group_link
    if (phoneToUse !== undefined) updateData.personal_phone = phoneToUse
    if (job_function !== undefined)
      updateData.job_function = job_function === '' ? null : job_function

    if (username !== undefined) updateData.username = username === '' ? null : username
    if (rg !== undefined) updateData.rg = rg === '' ? null : rg
    if (cpf !== undefined) updateData.cpf = cpf === '' ? null : cpf

    if (birth_date !== undefined) {
      if (birth_date === '') {
        updateData.birth_date = null
      } else {
        const parsedDate = new Date(birth_date)
        if (!isNaN(parsedDate.getTime())) {
          updateData.birth_date = birth_date
        } else {
          updateData.birth_date = null
        }
      }
    }

    if (cep !== undefined) updateData.cep = cep === '' ? null : cep
    if (address !== undefined) updateData.address = address === '' ? null : address
    if (address_number !== undefined)
      updateData.address_number = address_number === '' ? null : address_number
    if (address_complement !== undefined)
      updateData.address_complement = address_complement === '' ? null : address_complement
    if (city !== undefined) updateData.city = city === '' ? null : city
    if (state !== undefined) updateData.state = state === '' ? null : state
    if (has_access_schedule !== undefined) updateData.has_access_schedule = has_access_schedule

    if (commercial_agreement !== undefined) {
      const caVal = parseFloat(commercial_agreement)
      updateData.commercial_agreement = isNaN(caVal) ? 0 : caVal
    }

    if (password && password.trim() !== '' && callerUser.id !== userId) {
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

    if (Object.keys(updateData).length > 0) {
      const { error: dbProfileError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
      if (dbProfileError) {
        console.error('Profile update error:', dbProfileError)
        throw new Error(`Erro ao atualizar o perfil do usuário: ${dbProfileError.message}`)
      }
    }

    return new Response(JSON.stringify({ data: authData, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Update user error details:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
