import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Briefcase, Settings, Phone, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function DentistsPage() {
  const { currentUser } = useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDentist, setEditingDentist] = useState<any>(null)
  const [formData, setFormData] = useState({
    closing_date: '',
    payment_due_date: '',
    personal_phone: '',
    clinic_contact_name: '',
    clinic_contact_role: '',
    clinic_contact_phone: '',
  })

  const hasAccess = currentUser?.role === 'receptionist' || currentUser?.role === 'admin'

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
        clinic: p.clinic || 'Clínica não informada',
        email: p.email,
        avatar_url: p.avatar_url,
        closing_date: p.closing_date,
        payment_due_date: p.payment_due_date,
        personal_phone: p.personal_phone,
        clinic_contact_name: p.clinic_contact_name,
        clinic_contact_role: p.clinic_contact_role,
        clinic_contact_phone: p.clinic_contact_phone,
        activeCases: orders ? orders.filter((o: any) => o.dentist_id === p.id).length : 0,
      }))
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
    })
  }

  const handleSave = async () => {
    if (!editingDentist) return
    const closing_date = formData.closing_date ? parseInt(formData.closing_date) : null
    const payment_due_date = formData.payment_due_date ? parseInt(formData.payment_due_date) : null

    const { data, error } = await supabase
      .from('profiles' as any)
      .update({
        closing_date,
        payment_due_date,
        personal_phone: formData.personal_phone,
        clinic_contact_name: formData.clinic_contact_name,
        clinic_contact_role: formData.clinic_contact_role,
        clinic_contact_phone: formData.clinic_contact_phone,
      })
      .eq('id', editingDentist.id)
      .select()

    if (error || !data || data.length === 0) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações. Verifique suas permissões.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Configurações salvas com sucesso!' })
      setEditingDentist(null)
      fetchDentists()
    }
  }

  if (!hasAccess)
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Acesso negado. Apenas recepção e administração.
      </div>
    )
  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando diretório de dentistas...
      </div>
    )

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Diretório de Dentistas</h2>
        <p className="text-muted-foreground">
          Gerencie seus clientes, clínicas parceiras e informações de contato.
        </p>
      </div>

      {dentists.length === 0 ? (
        <div className="p-12 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Nenhum dentista cadastrado no sistema ainda.</p>
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
                  <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold">
                    {dentist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <CardTitle className="text-lg truncate" title={dentist.name}>
                    {dentist.name}
                  </CardTitle>
                  <CardDescription
                    className="flex items-center gap-1.5 mt-1 truncate"
                    title={dentist.clinic}
                  >
                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{dentist.clinic}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div
                  className="flex items-center gap-2 text-muted-foreground truncate"
                  title={dentist.email}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />{' '}
                  <span className="truncate">{dentist.email}</span>
                </div>

                {dentist.personal_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />{' '}
                    <span>{dentist.personal_phone}</span>
                  </div>
                )}

                {dentist.clinic_contact_name && (
                  <div
                    className="flex items-center gap-2 text-muted-foreground truncate"
                    title={`${dentist.clinic_contact_name} - ${dentist.clinic_contact_phone}`}
                  >
                    <UserCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {dentist.clinic_contact_name}{' '}
                      {dentist.clinic_contact_phone && `(${dentist.clinic_contact_phone})`}
                    </span>
                  </div>
                )}

                <div className="bg-muted/40 rounded-md p-2 mt-2 border border-border/50 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Fechamento</span>
                    <span className="font-medium">
                      {dentist.closing_date ? `Dia ${dentist.closing_date}` : 'Não def.'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Vencimento</span>
                    <span className="font-medium">
                      {dentist.payment_due_date ? `Dia ${dentist.payment_due_date}` : 'Não def.'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t mt-4">
                  <span className="font-medium text-foreground">
                    Casos Ativos: <span className="text-primary">{dentist.activeCases}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-primary"
                    onClick={() => handleEditClick(dentist)}
                  >
                    <Settings className="w-3 h-3" /> Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingDentist} onOpenChange={(open) => !open && setEditingDentist(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil do Dentista</DialogTitle>
            <CardDescription>
              Atualize as informações de contato, faturamento e integrações de{' '}
              {editingDentist?.name}.
            </CardDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="pt-1 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground">Contato Pessoal</h4>
              </div>
              <div className="space-y-2">
                <Label>Telefone Pessoal</Label>
                <Input
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.personal_phone}
                  onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                />
              </div>

              <div className="pt-4 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground">Faturamento</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dia de Fechamento</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 25"
                    value={formData.closing_date}
                    onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dia de Vencimento</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 5"
                    value={formData.payment_due_date}
                    onChange={(e) => setFormData({ ...formData, payment_due_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pt-1 pb-2 border-b">
                <h4 className="text-sm font-semibold text-foreground">Informações da Clínica</h4>
              </div>
              <div className="space-y-2">
                <Label>Nome do Contato Secundário</Label>
                <Input
                  placeholder="Ex: Maria"
                  value={formData.clinic_contact_name}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo do Contato</Label>
                <Input
                  placeholder="Ex: Secretária"
                  value={formData.clinic_contact_role}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_role: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone da Clínica / Contato</Label>
                <Input
                  placeholder="Ex: (11) 3333-3333"
                  value={formData.clinic_contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_contact_phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDentist(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Informações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
