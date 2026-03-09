import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Index() {
  const { orders, currentUser } = useAppStore()

  const unreadOrders = useMemo(() => {
    return orders.filter((o) => {
      const stg = o.kanbanStage.toUpperCase()
      return stg === 'TRIAGEM' || stg === 'CAIXA DE ENTRADA'
    })
  }, [orders])

  const recentOrders = useMemo(() => {
    return orders.slice(0, 15)
  }, [orders])

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4 sm:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Bem-vindo(a), {currentUser?.name}
        </h2>
        <p className="text-muted-foreground mt-1">Acompanhe seus pedidos e fluxo de trabalho.</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="mb-6 bg-muted/50 border">
          <TabsTrigger value="inbox" className="gap-2 data-[state=active]:bg-background">
            Caixa de Entrada
            {unreadOrders.length > 0 && (
              <Badge
                variant="destructive"
                className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full text-[10px] animate-in zoom-in"
              >
                {unreadOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-background">
            Visão Geral (Recentes)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          {unreadOrders.length === 0 ? (
            <Card className="border-dashed shadow-sm">
              <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <span className="text-xl">📥</span>
                </div>
                Nenhum novo pedido na Caixa de Entrada.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {unreadOrders.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentOrders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrderCard({ order }: { order: any }) {
  return (
    <Link to={`/order/${order.id}`} className="block h-full group">
      <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer h-full flex flex-col relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary/60 transition-colors" />
        <CardHeader className="p-4 pb-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {order.friendlyId}
            </span>
            <StatusBadge
              status={order.status}
              className="scale-[0.8] origin-top-right -mt-1 -mr-1"
            />
          </div>
          <CardTitle className="text-base mt-2 line-clamp-1 group-hover:text-primary transition-colors">
            {order.patientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1 flex flex-col">
          <div className="text-sm space-y-1.5 flex-1">
            <p className="text-muted-foreground truncate">
              <span className="font-medium text-foreground">Trabalho:</span> {order.workType}
            </p>
            <p className="text-muted-foreground truncate">
              <span className="font-medium text-foreground">Dr(a):</span> {order.dentistName}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-medium text-foreground">Estágio:</span>
              <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                {order.kanbanStage}
              </Badge>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground mt-4 border-t border-border/50 pt-3 flex justify-between items-center">
            <span>Criado em:</span>
            <span className="font-medium">
              {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
