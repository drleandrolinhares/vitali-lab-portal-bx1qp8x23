import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DentistBillingDetails } from './DentistBillingDetails'
import { Loader2, Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DentistBillingSummary {
  dentist_id: string
  name: string
  clinic: string
  unbilled_count: number
  unbilled_total: number
}

export function DentistBillingTab() {
  const [summaries, setSummaries] = useState<DentistBillingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const fetchSummaries = async () => {
    setLoading(true)
    try {
      const { data: profiles } = await supabase.from('profiles').select('id, name, clinic')
      const { data: orders } = await supabase
        .from('orders')
        .select('dentist_id, base_price')
        .eq('status', 'completed')
        .is('settlement_id', null)

      if (profiles && orders) {
        const summaryMap = new Map<string, DentistBillingSummary>()

        orders.forEach((order) => {
          if (!order.dentist_id) return
          const existing = summaryMap.get(order.dentist_id)
          if (existing) {
            existing.unbilled_count += 1
            existing.unbilled_total += order.base_price || 0
          } else {
            const profile = profiles.find((p) => p.id === order.dentist_id)
            summaryMap.set(order.dentist_id, {
              dentist_id: order.dentist_id,
              name: profile?.name || 'Dentista Desconhecido',
              clinic: profile?.clinic || 'Sem clínica',
              unbilled_count: 1,
              unbilled_total: order.base_price || 0,
            })
          }
        })

        setSummaries(
          Array.from(summaryMap.values()).sort((a, b) => b.unbilled_total - a.unbilled_total),
        )
      }
    } catch (error) {
      console.error('Error fetching billing summaries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedDentistId) {
      fetchSummaries()
    }
  }, [selectedDentistId])

  if (selectedDentistId) {
    return (
      <DentistBillingDetails
        dentistId={selectedDentistId}
        onBack={() => setSelectedDentistId(null)}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Receipt className="w-5 h-5 text-primary" />
          Faturamento por Dentista
        </CardTitle>
        <CardDescription>
          Selecione um dentista para visualizar os pedidos pendentes e gerar o faturamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Dentista</TableHead>
                <TableHead>Clínica</TableHead>
                <TableHead className="text-center">Pedidos Pendentes</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                    Nenhum pedido pendente de faturamento encontrado no sistema.
                  </TableCell>
                </TableRow>
              ) : (
                summaries.map((summary) => (
                  <TableRow
                    key={summary.dentist_id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-900">{summary.name}</TableCell>
                    <TableCell className="text-slate-600">{summary.clinic}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-full text-xs border border-slate-200">
                        {summary.unbilled_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(summary.unbilled_total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDentistId(summary.dentist_id)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
