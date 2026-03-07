import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, MapPin, ExternalLink, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DentistsPage() {
  const { currentUser } = useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const hasAccess = currentUser?.role === 'receptionist' || currentUser?.role === 'admin'

  useEffect(() => {
    if (!hasAccess) {
      setLoading(false)
      return
    }

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
          activeCases: orders ? orders.filter((o: any) => o.dentist_id === p.id).length : 0,
        }))
        setDentists(mapped)
      }
      setLoading(false)
    }

    fetchDentists()
  }, [hasAccess])

  if (!hasAccess) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Acesso negado. Apenas recepção e administração.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando diretório de dentistas...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Diretório de Dentistas</h2>
        <p className="text-muted-foreground">Gerencie seus clientes e clínicas parceiras.</p>
      </div>

      {dentists.length === 0 ? (
        <div className="p-12 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Nenhum dentista cadastrado no sistema ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dentists.map((dentist) => (
            <Card key={dentist.id} className="shadow-subtle hover:shadow-md transition-shadow">
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
                <div className="pt-4 flex items-center justify-between border-t mt-4">
                  <span className="font-medium text-foreground">
                    Casos Ativos: <span className="text-primary">{dentist.activeCases}</span>
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
                    Detalhes <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
