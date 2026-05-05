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
      commercial_agreement,
      closing_date,
      payment_due_date,
      clinic_contact_name,
      clinic_contact_role,
      clinic_contact_phone,
      allowed_sectors,
      authorized_kanban_stages,
    } = await req.json()

    const isAdmin = callerProfile.role === 'admin' || callerProfile.role === 'master'
    const isMaster = callerProfile.role === 'master'
    const callerPerms = callerProfile.permissions || {}
    const canOnlyCreateDentists = callerPerms.can_only_create_dentists === true
    const canCreateUsers =
      isMaster || (isAdmin && callerPerms?.settings?.actions?.create_users !== false)

    let canAddDentist = false
    if (Array.isArray(callerPerms)) {
      canAddDentist = callerPerms.includes('add-dentist')
    } else if (typeof callerPerms === 'object') {
      canAddDentist = !!callerPerms?.settings?.access
    }

    if (!isAdmin) {
      if (role !== 'dentist' && role !== 'laboratory') {
        throw new Error('Unauthorized: Apenas administradores podem criar este tipo de usuário.')
      }
      if (!canAddDentist) {
        throw new Error(
          'Unauthorized: Você não tem permissão para adicionar novos dentistas/laboratórios.',
        )
      }
    }

    if (isAdmin && !isMaster && !canCreateUsers) {
      throw new Error('Unauthorized: Você não tem permissão para criar novos usuários.')
    }

    if (isAdmin && !isMaster && canOnlyCreateDentists) {
      if (role !== 'dentist') {
        throw new Error(
          'Unauthorized: Você tem permissão para criar apenas usuários do tipo Dentista.',
        )
      }
    }

    if (role === 'master' && callerProfile.role !== 'master') {
      throw new Error('Unauthorized: Apenas usuários MASTER podem criar um perfil MASTER.')
    }

    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    let phoneToUse: string | null = null
    if (phone !== undefined)
      phoneToUse = typeof phone === 'string' && phone.trim() === '' ? null : phone
    else if (personal_phone !== undefined)
      phoneToUse =
        typeof personal_phone === 'string' && personal_phone.trim() === '' ? null : personal_phone

    const payload: any = {
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role, clinic, phone: phoneToUse, whatsapp_group_link },
    }

    if (phoneToUse && phoneToUse.trim() !== '') {
      payload.phone = phoneToUse
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser(payload)

    if (error) {
      console.error('Auth create error:', error)
      let errorMsg = error.message
      if (errorMsg.includes('users_phone_key') || errorMsg.includes('phone')) {
        errorMsg = 'Este número de telefone já está vinculado a outra conta.'
      } else if (
        errorMsg.toLowerCase().includes('already registered') ||
        errorMsg.toLowerCase().includes('already exists') ||
        errorMsg.toLowerCase().includes('duplicate key')
      ) {
        errorMsg = 'Este e-mail já está em uso por outro perfil.'
      } else if (errorMsg.toLowerCase().includes('password')) {
        errorMsg = 'A senha informada é muito fraca ou inválida. Deve conter ao menos 6 caracteres.'
      }
      throw new Error(`Erro de autenticação: ${errorMsg}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    const updateData: any = { is_approved: true, is_active: true }
    if (permissions && Object.keys(permissions).length > 0) updateData.permissions = permissions
    if (whatsapp_group_link)
      updateData.whatsapp_group_link = whatsapp_group_link === '' ? null : whatsapp_group_link
    if (phoneToUse !== null) updateData.personal_phone = phoneToUse
    if (requires_password_change !== undefined)
      updateData.requires_password_change = requires_password_change
    if (assigned_dentists !== undefined) updateData.assigned_dentists = assigned_dentists
    if (can_move_kanban_cards !== undefined)
      updateData.can_move_kanban_cards = can_move_kanban_cards
    if (allowed_sectors !== undefined) updateData.allowed_sectors = allowed_sectors
    if (authorized_kanban_stages !== undefined)
      updateData.authorized_kanban_stages = authorized_kanban_stages

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

    if (Object.keys(updateData).length > 0) {
      const { error: dbError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', data.user.id)
      if (dbError) {
        console.error('Profile init error:', dbError)
      }
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: callerUser.id,
      action: 'CREATE_USER',
      entity_type: 'profiles',
      entity_id: data.user.id,
      details: { role, email, name },
    })

    return new Response(JSON.stringify({ data, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Create user error details:', error)

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

    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
