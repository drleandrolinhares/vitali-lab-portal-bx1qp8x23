import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Clock, Activity, FileText, Inbox } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { OrderDetailsSheet } from '@/components/OrderDetailsSheet'

export default function Index() {
  const { currentUser, orders, acknowledgeOrder, updateOrderObservations, checkPermission } =
    useAppStore()

  const showGlobalInbox = checkPermission('inbox', 'view_all')
  const canCreateOrder = checkPermission('inbox', 'create_order')

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null
  const [obsText, setObsText] = useState('')

  const handleSaveObs = () => {
    if (selectedOrder) {
      updateOrderObservations(selectedOrder.id, obsText)
    }
  }

  if (!showGlobalInbox) {
    const myOrders = orders.filter((o) => o.dentistId === currentUser?.id)
    const recentOrders = myOrders.slice(0, 5)
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meu Painel</h2>
          <p className="text-muted-foreground">Bem-vindo(a), {currentUser?.name}!</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 shadow-sm border-slate-200 dark:border-border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Trabalhos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Nenhum pedido recente.</div>
              ) : (
                <div className="divide-y">
                  {recentOrders.map((o) => (
                    <div
                      key={o.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{o.patientName}</p>
                        <p className="text-sm text-muted-foreground">{o.workType}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200 dark:border-border h-fit">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {canCreateOrder && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/new-request">Novo Pedido</Link>
                </Button>
              )}
              {checkPermission('kanban') && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/kanban">Evolução dos Trabalhos</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin Inbox
  const displayOrders = orders.filter((o) => !o.isAcknowledged)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Inbox className="w-6 h-6" /> Caixa de Entrada
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground">
            Gerencie os novos pedidos recebidos no laboratório.
          </p>
        </div>
        {canCreateOrder && (
          <Button asChild>
            <Link to="/new-request">Novo Pedido</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {displayOrders.length === 0 ? (
          <Card className="bg-slate-50/50 dark:bg-muted/20 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-medium">Nenhum novo pedido na caixa de entrada.</p>
            </CardContent>
          </Card>
        ) : (
          displayOrders.map((order) => (
            <Card
              key={order.id}
              className="group hover:border-primary/40 transition-all shadow-sm cursor-pointer"
              onClick={() => {
                setSelectedOrderId(order.id)
                setObsText(order.observations || '')
              }}
            >
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      {order.friendlyId}
                    </span>
                    <StatusBadge status={order.status} className="scale-[0.8] origin-left" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                    {order.patientName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="font-medium">{order.dentistName}</span>
                    <span className="text-slate-300">•</span>
                    {order.workType} <span className="opacity-75">({order.material})</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(order.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      acknowledgeOrder(order.id)
                    }}
                    className="ml-auto sm:ml-0 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
                    size="sm"
                  >
                    <Check className="w-4 h-4" /> Ciente
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        obsText={obsText}
        setObsText={setObsText}
        onSaveObs={handleSaveObs}
      />
    </div>
  )
}
