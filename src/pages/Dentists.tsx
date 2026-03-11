import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Mail,
  Briefcase,
  Settings,
  Phone,
  UserCircle,
  MessageCircle,
  Trash2,
  Tag,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { createUser } from '@/services/users'

export default function DentistsPage() {
  const { currentUser } = useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDentist, setEditingDentist] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createData, setCreateData] = useState({
    name: '',
    email: '',
    clinic: '',
    phone: '',
    password: '',
  })
  const [formData, setFormData] = useState({
    closing_date: '',
    payment_due_date: '',
    personal_phone: '',
    clinic_contact_name: '',
    clinic_contact_role: '',
    clinic_contact_phone: '',
    whatsapp_group_link: '',
    commercial_agreement: '',
  })

  const hasAccess =
    currentUser?.role === 'admin' ||
    currentUser?.role === ('master' as any) ||
    currentUser?.role === 'receptionist' ||
    (currentUser?.permissions || []).includes('dentists')

  const canAddDentist =
    currentUser?.role === 'admin' ||
    currentUser?.role === ('master' as any) ||
    (currentUser?.permissions || []).includes('add-dentist')

  const fetchDentists = async () => {
    setLoading(true)
    const { data: profiles } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('role', 'dentist')
    const { data: orders } = await supabase
      .from('orders' as any)
      .select('dentist_id')
      .neq('status', 'delivered')

    if (profiles) {
      const mapped = profiles.map((p: any) => ({
        id: p.id,
        name: p.name,
        clinic: p.clinic || 'CLÍNICA NÃO INFORMADA',
        email: p.email,
        avatar_url: p.avatar_url,
        closing_date: p.closing_date,
        payment_due_date: p.payment_due_date,
        personal_phone: p.personal_phone,
        clinic_contact_name: p.clinic_contact_name,
        clinic_contact_role: p.clinic_contact_role,
        clinic_contact_phone: p.clinic_contact_phone,
        whatsapp_group_link: p.whatsapp_group_link,
        commercial_agreement: p.commercial_agreement || 0,
        activeCases: orders ? orders.filter((o: any) => o.dentist_id === p.id).length : 0,
      }))

      mapped.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'))

      setDentists(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (hasAccess) fetchDentists()
  }, [hasAccess])

  const handleEditClick = (dentist: any) => {
    setEditingDentist(dentist)
    setFormData({
      closing_date: dentist.closing_date?.toString() || '',
      payment_due_date: dentist.payment_due_date?.toString() || '',
      personal_phone: dentist.personal_phone || '',
      clinic_contact_name: dentist.clinic_contact_name || '',
      clinic_contact_role: dentist.clinic_contact_role || '',
      clinic_contact_phone: dentist.clinic_contact_phone || '',
      whatsapp_group_link: dentist.whatsapp_group_link || '',
      commercial_agreement: dentist.commercial_agreement?.toString() || '0',
    })
  }

  const handleCreateDentist = async () => {
    if (!createData.name || !createData.email || !createData.password) {
      toast({ title: 'PREENCHA OS CAMPOS OBRIGATÓRIOS', variant: 'destructive' })
      return
    }

    setLoading(true)
    const payload = {
      name: createData.name,
      email: createData.email.toLowerCase(),
      password: createData.password,
      clinic: createData.clinic,
      phone: createData.phone,
      role: 'dentist',
      requires_password_change: true,
    }

    const { error } = await createUser(payload)
    if (error) {
      toast({
        title: 'ERRO AO CRIAR DENTISTA',
        description: error.message,
        variant: 'destructive',
      })
      setLoading(false)
    } else {
      toast({ title: 'DENTISTA CRIADO COM SUCESSO!' })
      setIsCreating(false)
      setCreateData({ name: '', email: '', clinic: '', phone: '', password: '' })
      fetchDentists()
    }
  }

  const handleDeleteDentist = async (id: string) => {
    if (
      !confirm(
        'Tem certeza que deseja excluir este dentista permanentemente? Todo o histórico de pedidos e faturamento dele também será excluído.',
      )
    )
      return

    const { error } = await supabase.rpc('delete_user', { target_user_id: id })
    if (error) {
      toast({ title: 'ERRO AO EXCLUIR', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'DENTISTA EXCLUÍDO COM SUCESSO.' })
      fetchDentists()
    }
  }

  const handleSave = async () => {
    if (!editingDentist) return
    const closing_date = formData.closing_date ? parseInt(formData.closing_date) : null
    const payment_due_date = formData.payment_due_date ? parseInt(formData.payment_due_date) : null
    const commercial_agreement = parseFloat(formData.commercial_agreement) || 0

    const { data, error } = await supabase
      .from('profiles' as any)
      .update({
        closing_date,
        payment_due_date,
        personal_phone: formData.personal_phone,
        clinic_contact_name: formData.clinic_contact_name,
        clinic_contact_role: formData.clinic_contact_role,
        clinic_contact_phone: formData.clinic_contact_phone,
        whatsapp_group_link: formData.whatsapp_group_link,
        commercial_agreement,
      })
      .eq('id', editingDentist.id)
      .select()

    if (error || !data || data.length === 0) {
      toast({
        title: 'ERRO',
        description: 'Não foi possível salvar as configurações. Verifique suas permissões.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'CONFIGURAÇÕES SALVAS COM SUCESSO!' })
      setEditingDentist(null)
      fetchDentists()
    }
  }

  if (!hasAccess)
    return (
      <div className="p-8 text-center text-destructive font-medium uppercase">
        ACESSO NEGADO. APENAS RECEPÇÃO E ADMINISTRAÇÃO.
      </div>
    )
  if (loading && dentists.length === 0)
    return (
      <div className="p-8 text-center text-muted-foreground uppercase text-xs font-bold">
        CARREGANDO DIRETÓRIO DE DENTISTAS...
      </div>
    )

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase">DIRETÓRIO DE DENTISTAS</h2>
          <p className="text-muted-foreground uppercase text-xs font-bold mt-1">
            GERENCIE SEUS CLIENTES, CLÍNICAS PARCEIRAS E INFORMAÇÕES DE CONTATO.
          </p>
        </div>
        {canAddDentist && (
          <Button onClick={() => setIsCreating(true)} className="gap-2 uppercase text-xs font-bold">
            <Plus className="w-4 h-4" /> NOVO DENTISTA
          </Button>
        )}
      </div>

      {dentists.length === 0 ? (
        <div className="p-12 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground uppercase text-xs font-bold">
            NENHUM DENTISTA CADASTRADO NO SISTEMA AINDA.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dentists.map((dentist) => (
            <Card
              key={dentist.id}
              className="shadow-subtle hover:shadow-md transition-shadow relative"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <Avatar className="w-12 h-12 border-2 border-primary/10">
                  <AvatarImage src={dentist.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold uppercase">
                    {dentist.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <CardTitle className="text-lg truncate uppercase" title={dentist.name}>
                    {dentist.name}
                  </CardTitle>
                  <CardDescription
                    className="flex items-center gap-1.5 mt-1 truncate uppercase text-xs"
                    title={dentist.clinic}
                  >
                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{dentist.clinic}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div
                  className="flex items-center gap-2 text-muted-foreground truncate uppercase text-xs font-semibold"
                  title={dentist.email}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />{' '}
                  <span className="truncate normal-case">{dentist.email}</span>
                </div>

                {dentist.personal_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground uppercase text-xs font-semibold">
                    <Phone className="w-4 h-4 flex-shrink-0" />{' '}
                    <span>{dentist.personal_phone}</span>
                  </div>
                )}

                {dentist.clinic_contact_name && (
                  <div
                    className="flex items-center gap-2 text-muted-foreground truncate uppercase text-xs font-semibold"
                    title={`${dentist.clinic_contact_name} - ${dentist.clinic_contact_phone}`}
                  >
                    <UserCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {dentist.clinic_contact_name}{' '}
                      {dentist.clinic_contact_phone && `(${dentist.clinic_contact_phone})`}
                    </span>
                  </div>
                )}

                {currentUser?.role === 'admin' && dentist.whatsapp_group_link && (
                  <div className="flex items-center gap-2 text-muted-foreground truncate uppercase text-xs font-semibold">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={dentist.whatsapp_group_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium truncate normal-case"
                      title={dentist.whatsapp_group_link}
                    >
                      Acessar Grupo WhatsApp
                    </a>
                  </div>
                )}

                {dentist.commercial_agreement > 0 && (
                  <div className="flex items-center gap-2 text-emerald-600 font-medium uppercase text-xs">
                    <Tag className="w-4 h-4 flex-shrink-0" />{' '}
                    <span>ACORDO COMERCIAL: -{dentist.commercial_agreement}%</span>
                  </div>
                )}

                <div className="bg-muted/40 rounded-md p-2 mt-2 border border-border/50 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-0.5 uppercase font-bold text-[10px]">
                      FECHAMENTO
                    </span>
                    <span className="font-medium uppercase">
                      {dentist.closing_date ? `DIA ${dentist.closing_date}` : 'NÃO DEF.'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5 uppercase font-bold text-[10px]">
                      VENCIMENTO
                    </span>
                    <span className="font-medium uppercase">
                      {dentist.payment_due_date ? `DIA ${dentist.payment_due_date}` : 'NÃO DEF.'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t mt-4">
                  <span className="font-medium text-foreground uppercase text-xs font-bold">
                    CASOS: <span className="text-primary">{dentist.activeCases}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {currentUser?.role === 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteDentist(dentist.id)}
                        title="EXCLUIR DENTISTA"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-primary hover:bg-primary/10 uppercase text-xs font-bold"
                      onClick={() => handleEditClick(dentist)}
                    >
                      <Settings className="w-3 h-3" /> CONFIG
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingDentist} onOpenChange={(open) => !open && setEditingDentist(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="uppercase">PERFIL DO DENTISTA</DialogTitle>
            <DialogDescription className="uppercase text-xs font-semibold">
              ATUALIZE AS INFORMAÇÕES DE CONTATO, FATURAMENTO E INTEGRAÇÕES DE{' '}
              {editingDentist?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="pt-1 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground uppercase">CONTATO PESSOAL</h4>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold">TELEFONE PESSOAL</Label>
                <Input
                  placeholder="EX: (11) 99999-9999"
                  value={formData.personal_phone}
                  onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                />
              </div>

              {currentUser?.role === 'admin' && (
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">GRUPO WHATSAPP (LINK)</Label>
                  <Input
                    placeholder="Ex: https://chat.whatsapp.com/..."
                    value={formData.whatsapp_group_link}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp_group_link: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="pt-4 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground uppercase">
                  FATURAMENTO & CONDIÇÕES
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">DIA DE FECHAMENTO</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="EX: 25"
                    value={formData.closing_date}
                    onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-bold">DIA DE VENCIMENTO</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="EX: 5"
                    value={formData.payment_due_date}
                    onChange={(e) => setFormData({ ...formData, payment_due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label className="uppercase text-xs font-bold">ACORDO COMERCIAL (DESCONTO %)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="EX: 10"
                  value={formData.commercial_agreement}
                  onChange={(e) =>
                    setFormData({ ...formData, commercial_agreement: e.target.value })
                  }
                />
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                  SERÁ APLICADO AUTOMATICAMENTE COMO DESCONTO NOS NOVOS PEDIDOS DESTE DENTISTA.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pt-1 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground uppercase">
                  INFORMAÇÕES DA CLÍNICA
                </h4>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold">NOME DO CONTATO SECUNDÁRIO</Label>
                <Input
                  placeholder="EX: MARIA"
                  value={formData.clinic_contact_name}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold">CARGO DO CONTATO</Label>
                <Input
                  placeholder="EX: SECRETÁRIA"
                  value={formData.clinic_contact_role}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_role: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold">TELEFONE DA CLÍNICA / CONTATO</Label>
                <Input
                  placeholder="EX: (11) 3333-3333"
                  value={formData.clinic_contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingDentist(null)}
              className="uppercase text-xs font-bold"
            >
              CANCELAR
            </Button>
            <Button onClick={handleSave} className="uppercase text-xs font-bold">
              SALVAR INFORMAÇÕES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="uppercase">NOVO DENTISTA</DialogTitle>
            <DialogDescription className="uppercase text-xs font-semibold">
              CRIE UMA CONTA PARA UM NOVO DENTISTA. UMA SENHA TEMPORÁRIA SERÁ DEFINIDA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">NOME COMPLETO *</Label>
              <Input
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                placeholder="NOME DO DENTISTA"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">EMAIL *</Label>
              <Input
                type="email"
                value={createData.email}
                onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                placeholder="EMAIL@EXEMPLO.COM"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">CLÍNICA</Label>
              <Input
                value={createData.clinic}
                onChange={(e) => setCreateData({ ...createData, clinic: e.target.value })}
                placeholder="NOME DA CLÍNICA"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">TELEFONE</Label>
              <Input
                value={createData.phone}
                onChange={(e) => setCreateData({ ...createData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold">SENHA TEMPORÁRIA *</Label>
              <Input
                type="text"
                value={createData.password}
                onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                placeholder="MÍNIMO DE 6 CARACTERES"
              />
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                O DENTISTA SERÁ OBRIGADO A TROCAR ESTA SENHA NO PRIMEIRO LOGIN.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
              className="uppercase text-xs font-bold"
            >
              CANCELAR
            </Button>
            <Button
              onClick={handleCreateDentist}
              disabled={loading}
              className="uppercase text-xs font-bold"
            >
              CRIAR CONTA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
