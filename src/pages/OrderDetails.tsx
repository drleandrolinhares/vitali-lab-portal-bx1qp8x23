import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge, getStatusLabel } from '@/components/StatusBadge'
import { ArrowLeft, Calendar, User, FileText, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders } = useAppStore()

  const order = orders.find((o) => o.id === id)

  if (!order) return <div className="p-8 text-center">Pedido não encontrado.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedido {order.id}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Criado em {format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={order.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Detalhes Clínicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Paciente</p>
                <p className="font-medium text-lg">{order.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dentista Responsável</p>
                <p className="font-medium">{order.dentistName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trabalho</p>
                <p className="font-medium">{order.workType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{order.material}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cor/Escala</p>
                <p className="font-medium">{order.shade || 'Não especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Envio</p>
                <p className="font-medium">
                  {order.shippingMethod === 'lab_pickup'
                    ? 'Motoboy Laboratório'
                    : 'Enviado pelo Dentista'}
                </p>
              </div>
            </div>
            {order.teeth.length > 0 && (
              <div className="bg-muted/30 p-4 rounded-md border">
                <p className="text-sm text-muted-foreground mb-2">Elementos Envolvidos</p>
                <div className="flex flex-wrap gap-2">
                  {order.teeth.map((t) => (
                    <span
                      key={t}
                      className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm border border-primary/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {order.observations && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="text-sm bg-muted/50 p-3 rounded-md italic border-l-4 border-l-primary">
                  {order.observations}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
              {order.history.map((event, i) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  <div className="absolute left-0 mt-1.5 w-2 h-2 rounded-full ring-4 ring-background bg-primary z-10" />
                  <div className="ml-6 space-y-1">
                    <p className="text-sm font-medium">{getStatusLabel(event.status)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{' '}
                      {format(new Date(event.date), "dd/MM 'às' HH:mm")}
                    </p>
                    {event.note && (
                      <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-1.5 rounded">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
