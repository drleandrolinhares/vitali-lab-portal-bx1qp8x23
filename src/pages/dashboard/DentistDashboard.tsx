import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { PlusCircle, ArrowRight, Activity, CheckCircle2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Logo } from '@/components/Logo'

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export function DentistDashboard() {
  const { orders, currentUser, appSettings } = useAppStore()
  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'completed')

  const rawWhatsappLink =
    (currentUser as any).whatsapp_group_link ||
    appSettings?.whatsapp_group_link ||
    appSettings?.whatsapp_lab_link

  let validWhatsappLink = ''
  if (rawWhatsappLink && rawWhatsappLink.trim() !== '') {
    validWhatsappLink = rawWhatsappLink.trim()
    if (!validWhatsappLink.startsWith('http://') && !validWhatsappLink.startsWith('https://')) {
      validWhatsappLink = `https://${validWhatsappLink}`
    }
  }

  const isWhatsappConfigured = validWhatsappLink !== ''

  const stats = [
    {
      label: 'Pendentes',
      value: orders.filter((o) => o.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: 'Em Produção',
      value: orders.filter((o) => o.status === 'in_production').length,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      label: 'Concluídos',
      value: orders.filter((o) => o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Logo variant="square" size="lg" className="hidden sm:flex" />
          <div>
            <Logo variant="square" size="sm" className="sm:hidden mb-4" />
            <h2 className="text-3xl font-bold tracking-tight">Olá, {currentUser.name}</h2>
            <p className="text-muted-foreground mt-1 text-lg">
              Aqui está o resumo dos seus casos protéticos.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isWhatsappConfigured ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 shadow-sm text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 w-full sm:w-auto"
            >
              <a href={validWhatsappLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5" />
                Contato Laboratório
              </a>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              size="lg"
              className="gap-2 shadow-sm w-full sm:w-auto"
            >
              <WhatsAppIcon className="w-5 h-5 opacity-50" />
              Contato Indisponível
            </Button>
          )}
          <Button asChild size="lg" className="gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto">
            <Link to="/new-request">
              <PlusCircle className="w-5 h-5" /> Novo Pedido
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-subtle hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-subtle border-muted/60">
        <CardHeader className="bg-muted/10">
          <CardTitle>Casos Ativos</CardTitle>
          <CardDescription>
            Acompanhe o status dos trabalhos em andamento no laboratório.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activeOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Nenhum caso ativo no momento.</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/new-request">Iniciar um novo pedido</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4"
                >
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{order.patientName}</span>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {order.friendlyId}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium text-foreground/80">{order.workType}</span> •{' '}
                      {order.material} • Criado em{' '}
                      {format(new Date(order.createdAt), 'dd MMM, HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={order.status} className="px-3 py-1" />
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                      <Link to={`/order/${order.id}`}>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
