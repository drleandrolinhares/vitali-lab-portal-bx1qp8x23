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
    if (!authHeader) {
      throw new Error('Auth session missing! No authorization header provided.')
    }

    const token = authHeader.replace('Bearer ', '').trim()

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const {
      data: { user: callerUser },
      error: callerError,
    } = await authClient.auth.getUser(token)

    if (callerError || !callerUser) {
      throw new Error(
        `Auth session missing! Invalid or expired token: ${callerError?.message || 'User not found'}`,
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permissions')
      .eq('id', callerUser.id)
      .single()

    if (profileError || !callerProfile) {
      throw new Error(`Caller profile not found: ${profileError?.message || 'Unknown error'}`)
    }

    const isAdmin = callerProfile.role === 'admin' || callerProfile.role === 'master'
    const isMaster = callerProfile.role === 'master'

    const callerPerms = callerProfile.permissions || {}
    const canOnlyCreateDentists = callerPerms.can_only_create_dentists === true

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
      closing_date,
      payment_due_date,
      clinic_contact_name,
      clinic_contact_role,
      clinic_contact_phone,
      requires_password_change,
      allowed_sectors,
    } = body

    if (!userId) throw new Error('UserId is required in payload')

    const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permissions')
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

    if (isAdmin && !isMaster && canOnlyCreateDentists) {
      if (role !== undefined && role !== 'dentist' && role !== targetProfile.role) {
        throw new Error('Unauthorized: Você está restrito a atribuir apenas a função de Dentista.')
      }
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
    if (phone !== undefined)
      phoneToUse = typeof phone === 'string' && phone.trim() === '' ? null : phone
    if (personal_phone !== undefined)
      phoneToUse =
        typeof personal_phone === 'string' && personal_phone.trim() === '' ? null : personal_phone

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
        let errorMsg = authError.message
        if (errorMsg.includes('users_phone_key') || errorMsg.includes('phone')) {
          errorMsg = 'Este número de telefone já está vinculado a outra conta.'
        } else if (
          errorMsg.toLowerCase().includes('already registered') ||
          errorMsg.toLowerCase().includes('already exists') ||
          errorMsg.toLowerCase().includes('duplicate key')
        ) {
          errorMsg = 'Este e-mail já está em uso por outro perfil.'
        } else if (errorMsg.toLowerCase().includes('password')) {
          errorMsg =
            'A senha informada é muito fraca ou inválida. Deve conter ao menos 6 caracteres.'
        } else if (errorMsg.toLowerCase().includes('error updating user')) {
          errorMsg = 'Falha ao atualizar credenciais (verifique se o e-mail não está duplicado).'
        }
        throw new Error(`Erro de autenticação: ${errorMsg}`)
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
      if (birth_date === null || birth_date === '') {
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
    if (closing_date !== undefined)
      updateData.closing_date = closing_date === '' ? null : parseInt(closing_date, 10)
    if (payment_due_date !== undefined)
      updateData.payment_due_date = payment_due_date === '' ? null : parseInt(payment_due_date, 10)
    if (clinic_contact_name !== undefined)
      updateData.clinic_contact_name = clinic_contact_name === '' ? null : clinic_contact_name
    if (clinic_contact_role !== undefined)
      updateData.clinic_contact_role = clinic_contact_role === '' ? null : clinic_contact_role
    if (clinic_contact_phone !== undefined)
      updateData.clinic_contact_phone = clinic_contact_phone === '' ? null : clinic_contact_phone

    if (requires_password_change !== undefined) {
      updateData.requires_password_change = requires_password_change
    } else if (password && password.trim() !== '' && callerUser.id !== userId) {
      updateData.requires_password_change = true
    }

    if (isAdmin || isUpdatingDentist || isMaster) {
      if (role !== undefined) updateData.role = role
      if (is_active !== undefined) updateData.is_active = is_active
      if (permissions !== undefined) updateData.permissions = permissions
      if (assigned_dentists !== undefined) updateData.assigned_dentists = assigned_dentists
      if (can_move_kanban_cards !== undefined)
        updateData.can_move_kanban_cards = can_move_kanban_cards
      if (allowed_sectors !== undefined) updateData.allowed_sectors = allowed_sectors
    }

    if (Object.keys(updateData).length > 0) {
      const { error: dbProfileError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
      if (dbProfileError) {
        console.error('Profile update error:', dbProfileError)
        let errorMsg = dbProfileError.message
        if (dbProfileError.code === '23505') {
          if (dbProfileError.message.includes('cpf'))
            errorMsg = 'O CPF informado já está cadastrado em outro perfil.'
          else if (dbProfileError.message.includes('rg'))
            errorMsg = 'O RG informado já está cadastrado em outro perfil.'
          else errorMsg = 'Um dos dados informados já está em uso (conflito de duplicidade).'
        }
        throw new Error(`Erro ao atualizar o perfil do usuário: ${errorMsg}`)
      }

      if (updateData.permissions !== undefined) {
        const oldPerms = targetProfile.permissions || {}
        const newPerms = updateData.permissions || {}

        if (JSON.stringify(oldPerms) !== JSON.stringify(newPerms)) {
          await supabaseAdmin.from('audit_logs').insert({
            user_id: callerUser.id,
            action: 'UPDATE_PERMISSIONS',
            entity_type: 'profiles',
            entity_id: userId,
            details: { old: oldPerms, new: newPerms },
          })
        }
      }

      if (role !== undefined && role !== targetProfile.role) {
        await supabaseAdmin.from('audit_logs').insert({
          user_id: callerUser.id,
          action: 'CHANGE_USER_ROLE',
          entity_type: 'profiles',
          entity_id: userId,
          details: { old_role: targetProfile.role, new_role: role },
        })
      }
    }

    return new Response(JSON.stringify({ data: authData, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Update user error details:', error)

    let status = 400
    let errorMsg = error.message || 'Erro interno no servidor.'

    if (errorMsg.includes('Auth session missing!')) {
      status = 401
    } else if (
      errorMsg.includes('users_phone_key') ||
      errorMsg.includes('telefone já está vinculado') ||
      errorMsg.includes('phone')
    ) {
      errorMsg = 'Este número de telefone já está vinculado a outra conta.'
      status = 409
    } else if (
      errorMsg.includes('já está em uso') ||
      errorMsg.includes('duplicate key') ||
      errorMsg.includes('already registered')
    ) {
      errorMsg = 'Este e-mail já está em uso por outro perfil.'
      status = 409
    }

    if (errorMsg.startsWith('Erro de autenticação: ')) {
      errorMsg = errorMsg.replace('Erro de autenticação: ', '')
    }
    if (errorMsg.startsWith('Erro ao atualizar o perfil do usuário: ')) {
      errorMsg = errorMsg.replace('Erro ao atualizar o perfil do usuário: ', '')
    }

    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
