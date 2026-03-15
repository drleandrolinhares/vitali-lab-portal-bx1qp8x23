import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { Activity, CheckCircle2, TrendingUp } from 'lucide-react'

export function FinancialOverviewCards() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    emProducao: 0,
    concluida: 0,
    pipeline: 0,
  })

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('base_price, status, settlement_id')
          .is('settlement_id', null)

        if (error) throw error

        if (data) {
          let emProducao = 0
          let concluida = 0
          let pipeline = 0

          data.forEach((order) => {
            const price = order.base_price || 0

            // "Valores em Produção": currently being processed (not 'pending' and not 'completed')
            if (
              order.status !== 'pending' &&
              order.status !== 'completed' &&
              order.status !== 'delivered'
            ) {
              emProducao += price
            }

            // "Produção Concluída": exactly 'completed' AND settlement_id is NULL
            if (order.status === 'completed') {
              concluida += price
            }

            // "Pipeline de Produção": aggregate value representing the entire workflow currently in progress
            if (order.status === 'pending' || order.status === 'in_production') {
              pipeline += price
            }
          })

          setMetrics({ emProducao, concluida, pipeline })
        }
      } catch (error) {
        console.error('Error fetching financial metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 bg-muted rounded mb-2 mt-2"></div>
              <div className="h-3 w-1/2 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pipeline de Produção
          </CardTitle>
          <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(metrics.pipeline)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Trabalhos em triagem e andamento</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valores em Produção
          </CardTitle>
          <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(metrics.emProducao)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Trabalhos ativamente em produção</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Produção Concluída
          </CardTitle>
          <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(metrics.concluida)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Concluídos aguardando faturamento</p>
        </CardContent>
      </Card>
    </div>
  )
}
