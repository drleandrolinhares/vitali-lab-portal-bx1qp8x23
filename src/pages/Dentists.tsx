import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, MapPin, Briefcase, Settings } from 'lucide-react'
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
  const [formData, setFormData] = useState({ closing_date: '', payment_due_date: '' })

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
        closing_date: p.closing_date,
        payment_due_date: p.payment_due_date,
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
    })
  }

  const handleSave = async () => {
    if (!editingDentist) return
    const closing_date = formData.closing_date ? parseInt(formData.closing_date) : null
    const payment_due_date = formData.payment_due_date ? parseInt(formData.payment_due_date) : null

    const { error } = await supabase
      .from('profiles' as any)
      .update({ closing_date, payment_due_date })
      .eq('id', editingDentist.id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
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
          Gerencie seus clientes, clínicas parceiras e ciclos de faturamento.
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> <span>Brasil</span>
                </div>

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações Financeiras</DialogTitle>
            <CardDescription>
              Defina os dias de fechamento e vencimento para {editingDentist?.name}.
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <p className="text-xs text-muted-foreground">
                Dia do mês em que o faturamento é fechado.
              </p>
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
              <p className="text-xs text-muted-foreground">
                Dia do mês em que o pagamento deve ser realizado.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDentist(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
