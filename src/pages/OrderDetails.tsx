import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/StatusBadge'
import {
  ArrowLeft,
  Calendar,
  FileText,
  Activity,
  Clock,
  ArrowRight,
  Circle,
  DollarSign,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn, processOrderHistory } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { OrderHistory } from '@/lib/types'
import { formatBRL } from '@/lib/financial'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, kanbanStages } = useAppStore()

  const order = orders.find((o) => o.id === id)

  const [historyItems, setHistoryItems] = useState<OrderHistory[]>([])
  const [additionalCostDesc, setAdditionalCostDesc] = useState('')
  const [additionalCostValue, setAdditionalCostValue] = useState('')

  useEffect(() => {
    if (order?.id) {
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('order_history')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: true })

        if (data && !error) {
          setHistoryItems(
            data.map((h: any) => ({
              id: h.id,
              status: h.status,
              date: h.created_at,
              note: h.note,
            })),
          )
        } else {
          setHistoryItems(order.history || [])
        }
      }
      fetchHistory()
    }
  }, [order?.id, order?.history])

  if (!order) return <div className="p-8 text-center">Pedido não encontrado.</div>

  const actualHistory = historyItems.length > 0 ? historyItems : order.history
  const processedHistory = processOrderHistory(actualHistory, kanbanStages, order.kanbanStage)

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedido {order.friendlyId}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Criado em {format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={order.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-subtle h-fit overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Detalhes Clínicos
              </CardTitle>
              <div
                className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 shrink-0 select-none"
                title="Código de Barras do Pedido"
              >
                <img
                  src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${order.friendlyId}&scale=2&height=10&includetext=false`}
                  alt={`Barcode ${order.friendlyId}`}
                  className="h-9 object-contain dark:invert mix-blend-multiply"
                  draggable={false}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium text-lg">{order.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dentista Responsável</p>
                  <p className="font-medium">{order.dentistName}</p>
                </div>

                {order.patientCpf && (
                  <div>
                    <p className="text-sm text-muted-foreground">CPF do Paciente</p>
                    <p className="font-medium">{order.patientCpf}</p>
                  </div>
                )}
                {order.patientBirthDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {format(new Date(order.patientBirthDate + 'T00:00:00'), 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Trabalho</p>
                  <p className="font-medium">{order.workType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-medium">{order.material}</p>
                </div>

                {order.implantBrand && (
                  <div>
                    <p className="text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold">
                      Marca do Implante
                    </p>
                    <p className="font-medium">{order.implantBrand}</p>
                  </div>
                )}
                {order.implantType && (
                  <div>
                    <p className="text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold">
                      Tipo do Componente
                    </p>
                    <p className="font-medium">{order.implantType}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-medium">{order.shade || 'Não especificada'}</p>
                </div>
                {order.shadeScale && (
                  <div>
                    <p className="text-sm text-muted-foreground">Escala</p>
                    <p className="font-medium">{order.shadeScale}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Origem do Pedido</p>
                  <p className="font-medium">
                    {order.createdBy &&
                    ['admin', 'master', 'receptionist'].includes(order.createdBy.role)
                      ? `Registrado por: ${order.createdBy.name}`
                      : `Enviado por: ${order.createdBy?.name || order.dentistName}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logística de Envio</p>
                  <p className="font-medium">
                    {order.shippingMethod === 'lab_pickup'
                      ? 'Motoboy Laboratório'
                      : 'Responsabilidade do Dentista'}
                  </p>
                </div>

                {order.stlDeliveryMethod && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Detalhes do Envio</p>
                    <p className="font-medium">{order.stlDeliveryMethod}</p>
                  </div>
                )}
              </div>
              {(order.teeth.length > 0 || (order.arches && order.arches.length > 0)) && (
                <div className="bg-muted/30 p-4 rounded-md border">
                  <p className="text-sm text-muted-foreground mb-2">Elementos Envolvidos</p>
                  <div className="flex flex-wrap gap-2">
                    {order.arches?.map((a: string) => (
                      <span
                        key={a}
                        className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold text-sm border border-primary/20"
                      >
                        {a}
                      </span>
                    ))}
                    {order.teeth.map((t: string) => (
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
                  <p className="text-sm bg-muted/50 p-3 rounded-md italic border-l-4 border-l-primary whitespace-pre-wrap">
                    {order.observations}
                  </p>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-border/50">
                <p className="text-sm font-medium mb-3 text-muted-foreground">Custo Adicional</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="add-cost-desc" className="text-xs">
                      Descrição do Custo
                    </Label>
                    <input
                      id="add-cost-desc"
                      type="text"
                      placeholder="Ex: Material extra"
                      value={additionalCostDesc}
                      onChange={(e) => setAdditionalCostDesc(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="add-cost-val" className="text-xs">
                      Valor
                    </Label>
                    <input
                      id="add-cost-val"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={additionalCostValue}
                      onChange={(e) => setAdditionalCostValue(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-subtle h-fit border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Valor Unitário</span>
                <span className="font-medium">{formatBRL(order.unitPrice || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Quantidade (Elementos)</span>
                <span className="font-medium">{order.quantity || 1}</span>
              </div>
              {(order.dentistDiscount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <span>Desconto Acordo Comercial</span>
                  <span className="font-medium">-{order.dentistDiscount}%</span>
                </div>
              )}
              {(parseFloat(additionalCostValue) || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Custo Adicional</span>
                  <span className="font-medium text-amber-600 dark:text-amber-500">
                    {formatBRL(parseFloat(additionalCostValue) || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t font-semibold">
                <span>Total do Pedido</span>
                <span className="text-primary">
                  {formatBRL(order.basePrice + (parseFloat(additionalCostValue) || 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Histórico de Etapas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-border">
                {processedHistory.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-4">
                    <div
                      className={cn(
                        'absolute left-0 mt-0.5 w-6 h-6 rounded-full ring-4 ring-background z-10 flex items-center justify-center border',
                        item.isCurrent
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {item.direction === 'backward' ? (
                        <ArrowLeft className="w-3.5 h-3.5" />
                      ) : item.direction === 'forward' ? (
                        <ArrowRight className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-2.5 h-2.5 fill-current" />
                      )}
                    </div>
                    <div className="ml-10 w-full space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium leading-none">{item.stageName}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(item.date), "dd/MM 'às' HH:mm")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium bg-muted/40 px-2 py-1 rounded-md text-muted-foreground whitespace-nowrap border border-border/50">
                          <Clock className="w-3 h-3" />
                          {item.durationStr}
                        </div>
                      </div>
                      {item.note && !item.note.startsWith('Movido para') && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md border border-border/40">
                          {item.note}
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
    </div>
  )
}
