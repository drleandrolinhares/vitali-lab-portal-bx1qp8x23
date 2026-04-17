import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Clock, Activity, FileText, Inbox, ArrowRight, RefreshCw } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { OrderDetailsSheet } from '@/components/OrderDetailsSheet'
import { DentistDashboard } from '@/pages/dashboard/DentistDashboard'
import { cn } from '@/lib/utils'

export default function Index() {
  const {
    currentUser,
    orders,
    acknowledgeOrder,
    updateOrderObservations,
    checkPermission,
    effectiveRole,
    effectiveUserId,
  } = useAppStore()

  const showGlobalInbox = checkPermission('inbox', 'view_all')
  const canCreateOrder = checkPermission('inbox', 'create_order') || effectiveRole === 'dentist'
  const isInternalUser =
    effectiveRole === 'admin' ||
    effectiveRole === 'master' ||
    effectiveRole === 'receptionist' ||
    effectiveRole === 'technical_assistant' ||
    effectiveRole === 'financial' ||
    effectiveRole === 'relationship_manager'

  const isRepetitionOrder = (o: any) =>
    o.isRepetition || o.custo_adicional_descricao === 'REPETIÇÃO'

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null
  const [obsText, setObsText] = useState('')

  const handleSaveObs = () => {
    if (selectedOrder) {
      updateOrderObservations(selectedOrder.id, obsText)
    }
  }

  if (!showGlobalInbox) {
    if (effectiveRole === 'dentist' || effectiveRole === 'laboratory') {
      if (currentUser?.role === effectiveRole && !checkPermission('my_panel')) {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Você não possui permissão para visualizar o painel inicial. Entre em contato com o
              laboratório para mais informações.
            </p>
          </div>
        )
      }
      return <DentistDashboard />
    }

    const myOrders = orders.filter((o) => o.dentistId === effectiveUserId)

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Meu Painel</h2>
            <p className="text-muted-foreground">Bem-vindo(a), {currentUser?.name}!</p>
          </div>
          {canCreateOrder && (
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto shrink-0">
              {isInternalUser && (
                <Button
                  asChild
                  className="flex-1 sm:flex-none h-10 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-sm"
                >
                  <Link to="/new-request?type=repetition">Repetições</Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="flex-1 sm:flex-none h-10 border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2 font-bold shadow-sm"
              >
                <Link to="/new-request?type=adjustment">
                  <RefreshCw className="w-4 h-4 hidden sm:block" />
                  Ajustes
                </Link>
              </Button>
              <Button asChild className="flex-1 sm:flex-none h-10 font-bold shadow-sm">
                <Link to="/new-request">Novo Pedido</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 shadow-sm border-slate-200 dark:border-border h-fit">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Meus Trabalhos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {myOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 opacity-50" />
                  </div>
                  <p className="font-medium">Nenhum trabalho encontrado.</p>
                </div>
              ) : (
                <div className="divide-y max-h-[800px] overflow-y-auto">
                  {myOrders.map((o) => (
                    <div
                      key={o.id}
                      className={cn(
                        'p-4 hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group',
                        o.isAdjustmentReturn
                          ? 'bg-yellow-50/30 dark:bg-yellow-950/10'
                          : isRepetitionOrder(o)
                            ? 'bg-amber-50/30 dark:bg-amber-950/10'
                            : '',
                      )}
                      onClick={() => {
                        setSelectedOrderId(o.id)
                        setObsText(o.observations || '')
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                              o.isAdjustmentReturn || isRepetitionOrder(o)
                                ? 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'text-primary bg-primary/10',
                            )}
                          >
                            {o.friendlyId}
                          </span>
                          {o.isAdjustmentReturn && !isRepetitionOrder(o) && (
                            <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Ajuste
                            </span>
                          )}
                          {isRepetitionOrder(o) && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Repetição
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(o.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'font-semibold text-lg transition-colors',
                            o.isAdjustmentReturn || isRepetitionOrder(o)
                              ? 'text-yellow-950 dark:text-yellow-50'
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-primary',
                          )}
                        >
                          {o.patientName}
                        </p>
                        <p
                          className={cn(
                            'text-sm mt-0.5 flex items-center flex-wrap gap-x-1.5',
                            o.isAdjustmentReturn || isRepetitionOrder(o)
                              ? 'text-yellow-800 dark:text-yellow-200/80'
                              : 'text-slate-600 dark:text-slate-400',
                          )}
                        >
                          <span className="font-medium text-foreground/80">{o.workType}</span>
                          <span className="text-slate-300">•</span>
                          <span>{o.material}</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <StatusBadge
                          status={o.status}
                          className="scale-90 sm:scale-100 origin-left"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
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
                <>
                  {isInternalUser && (
                    <Button
                      asChild
                      className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold border-none"
                    >
                      <Link to="/new-request?type=repetition">
                        <RefreshCw className="w-4 h-4 mr-2" /> Repetição de Trabalho
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    className="w-full justify-start text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/30 font-bold"
                    variant="outline"
                  >
                    <Link to="/new-request?type=adjustment">
                      <RefreshCw className="w-4 h-4 mr-2" /> Ajustes
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link to="/new-request">Novo Pedido</Link>
                  </Button>
                </>
              )}
              {checkPermission('kanban') && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/kanban">Evolução dos Trabalhos</Link>
                </Button>
              )}
            </CardContent>
          </Card>
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

  // Admin Inbox
  const displayOrders = orders.filter((o) => !o.isAcknowledged)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Inbox className="w-6 h-6" /> Caixa de Entrada
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground">
            Gerencie os novos pedidos recebidos no laboratório.
          </p>
        </div>
        {canCreateOrder && (
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto shrink-0">
            {isInternalUser && (
              <Button
                asChild
                className="flex-1 sm:flex-none h-10 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-sm"
              >
                <Link to="/new-request?type=repetition">Repetições</Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="flex-1 sm:flex-none h-10 border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2 font-bold shadow-sm"
            >
              <Link to="/new-request?type=adjustment">
                <RefreshCw className="w-4 h-4 hidden sm:block" />
                Ajustes
              </Link>
            </Button>
            <Button asChild className="flex-1 sm:flex-none h-10 font-bold shadow-sm">
              <Link to="/new-request">Novo Pedido</Link>
            </Button>
          </div>
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
              className={cn(
                'group transition-all shadow-sm cursor-pointer',
                isRepetitionOrder(order)
                  ? 'bg-amber-50/50 border-amber-300 hover:border-amber-500 dark:bg-amber-950/20 dark:border-amber-900/50 dark:hover:border-amber-700'
                  : order.isAdjustmentReturn
                    ? 'bg-yellow-50/50 border-yellow-300 hover:border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-900/50 dark:hover:border-yellow-700'
                    : 'hover:border-primary/40',
              )}
              onClick={() => {
                setSelectedOrderId(order.id)
                setObsText(order.observations || '')
              }}
            >
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                        order.isAdjustmentReturn || isRepetitionOrder(order)
                          ? 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'text-primary bg-primary/10',
                      )}
                    >
                      {order.friendlyId}
                    </span>
                    {order.isAdjustmentReturn && !isRepetitionOrder(order) && (
                      <span className="text-[10px] font-bold text-white bg-yellow-500 dark:bg-yellow-600 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        Ajuste
                      </span>
                    )}
                    {isRepetitionOrder(order) && (
                      <span className="text-[10px] font-bold text-white bg-amber-500 dark:bg-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        Repetição
                      </span>
                    )}
                    <StatusBadge status={order.status} className="scale-[0.8] origin-left" />
                  </div>
                  <h3
                    className={cn(
                      'font-semibold text-lg',
                      order.isAdjustmentReturn || isRepetitionOrder(order)
                        ? 'text-yellow-950 dark:text-yellow-50'
                        : 'text-slate-800 dark:text-slate-100',
                    )}
                  >
                    {order.patientName}
                  </h3>
                  <p
                    className={cn(
                      'text-sm flex items-center gap-1.5 mt-0.5',
                      order.isAdjustmentReturn || isRepetitionOrder(order)
                        ? 'text-yellow-800 dark:text-yellow-200/80'
                        : 'text-slate-600 dark:text-slate-400',
                    )}
                  >
                    <span className="font-medium">{order.dentistName}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
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
