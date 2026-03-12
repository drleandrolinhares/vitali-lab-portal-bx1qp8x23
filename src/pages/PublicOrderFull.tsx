import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Loader2,
  ArrowLeft,
  FileText,
  DollarSign,
  Activity,
  Clock,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { formatBRL } from '@/lib/financial'
import { cn, processOrderHistory, formatDuration } from '@/lib/utils'

export default function PublicOrderFull() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!id) return
      try {
        const { data: result, error: rpcError } = await supabase.rpc(
          'get_public_order_full_details',
          {
            target_order_id: id,
          },
        )
        if (rpcError) throw rpcError
        if (result) {
          setData(result)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchFullDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 bg-white border rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Pedido não encontrado</h1>
        </div>
      </div>
    )
  }

  const quantity = data.quantity || 1
  const basePrice = data.base_price || 0
  const discount = data.discount || 0
  const unitPrice = quantity > 0 && discount < 100 ? basePrice / (1 - discount / 100) / quantity : 0

  const processedHistory = processOrderHistory(
    data.history || [],
    data.kanban_stages || [],
    data.kanban_stage,
  )

  const teeth = data.tooth_or_arch?.teeth || []
  const arches = data.tooth_or_arch?.arches || []

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6 shadow-sm">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            PORTAL DIGITAL • <span className="text-slate-800">Vitali Lab</span>
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase border border-emerald-100">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Laboratório Online
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Pedido {data.friendly_id}
              </h2>
              <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
                Criado em{' '}
                {format(new Date(data.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          <StatusBadge
            status={data.status}
            className="px-4 py-1.5 text-sm rounded-full bg-amber-50 text-amber-700 border-amber-200 shrink-0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 px-6 pt-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <FileText className="w-6 h-6 text-pink-600" /> Detalhes Clínicos
                </CardTitle>
                <div className="shrink-0 select-none opacity-80 mix-blend-multiply">
                  <img
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${data.friendly_id}&scale=2&height=12&includetext=false`}
                    alt="Barcode"
                    className="h-10 object-contain"
                    draggable={false}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-6 py-6 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Paciente
                    </p>
                    <p className="font-bold text-slate-800 text-lg uppercase">
                      {data.patient_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Dentista Responsável
                    </p>
                    <p className="font-bold text-slate-800 text-base uppercase">
                      {data.dentist_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Trabalho
                    </p>
                    <p className="font-bold text-slate-800 text-base uppercase">{data.work_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Material
                    </p>
                    <p className="font-bold text-slate-800 text-base uppercase">{data.material}</p>
                  </div>

                  {data.implant_brand && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Marca do Implante
                      </p>
                      <p className="font-bold text-slate-800 text-base uppercase">
                        {data.implant_brand}
                      </p>
                    </div>
                  )}
                  {data.implant_type && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Tipo do Componente
                      </p>
                      <p className="font-bold text-slate-800 text-base uppercase">
                        {data.implant_type}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Cor
                    </p>
                    <p className="font-bold text-slate-800 text-base uppercase">
                      {data.color_and_considerations || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Origem do Pedido
                    </p>
                    <p className="font-bold text-slate-800 text-base uppercase">
                      Registrado por: {data.creator_name || data.dentist_name}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Logística de Envio
                    </p>
                    <p className="font-bold text-slate-800 text-base">
                      {data.shipping_method === 'lab_pickup'
                        ? 'Motoboy Laboratório'
                        : 'Responsabilidade do Dentista'}
                    </p>
                  </div>
                </div>

                {(teeth.length > 0 || arches.length > 0) && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Elementos Envolvidos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arches.map((a: string) => (
                        <span
                          key={a}
                          className="bg-pink-100 text-pink-700 px-3 py-1 rounded-md font-bold text-sm border border-pink-200/50"
                        >
                          {a}
                        </span>
                      ))}
                      {teeth.map((t: string) => (
                        <span
                          key={t}
                          className="bg-pink-100 text-pink-700 px-3 py-1 rounded-md font-bold text-sm border border-pink-200/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.observations && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Observações
                    </p>
                    <div className="bg-slate-50/80 p-4 rounded-r-xl rounded-l-sm border border-slate-100 border-l-[4px] border-l-pink-500">
                      <p className="text-sm italic font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {data.observations}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white border-l-[6px] border-l-pink-600">
              <CardHeader className="pb-4 px-6 pt-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <DollarSign className="w-5 h-5 text-pink-600" /> Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Valor Unitário</span>
                  <span className="font-bold text-slate-800">{formatBRL(unitPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Quantidade (Elementos)</span>
                  <span className="font-bold text-slate-800">{quantity}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                  <span className="font-bold text-slate-900 text-base">Total do Pedido</span>
                  <span className="font-black text-pink-600 text-lg">{formatBRL(basePrice)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-slate-50 px-6 pt-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Activity className="w-5 h-5 text-pink-600" /> Histórico de Etapas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[35px] before:h-full before:w-px before:bg-slate-200">
                  {processedHistory.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-4">
                      <div
                        className={cn(
                          'absolute left-0 mt-0.5 w-6 h-6 rounded-full ring-4 ring-white z-10 flex items-center justify-center border',
                          item.isCurrent
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-slate-100 text-slate-400 border-slate-200',
                        )}
                      >
                        {item.direction === 'backward' ? (
                          <ArrowLeft className="w-3.5 h-3.5" />
                        ) : item.direction === 'forward' ? (
                          <ArrowRight className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-2 h-2 fill-current" />
                        )}
                      </div>
                      <div className="ml-10 w-full space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className={cn(
                                'text-sm font-bold uppercase',
                                item.isCurrent ? 'text-slate-900' : 'text-slate-600',
                              )}
                            >
                              {item.stageName}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {format(new Date(item.date), "dd/MM 'às' HH:mm")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {item.durationStr}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
