import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, Clock, Calculator } from 'lucide-react'

export interface HourlyCosts {
  totalFixedCosts: number
  totalHourlyCost: number
  costPerMinute: number
}

interface Props {
  onFetched?: (costs: HourlyCosts) => void
}

const INITIAL_COSTS_SUM = 33200 // Fallback sum if DB is completely empty

export function HourlyCostDashboard({ onFetched }: Props) {
  const [costs, setCosts] = useState<HourlyCosts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchCosts = async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('*')
          .in('key', ['hourly_cost_fixed_items', 'hourly_cost_monthly_hours'])

        let totalFixed = INITIAL_COSTS_SUM
        let hours = 176

        if (data && data.length > 0) {
          const items = data.find((d) => d.key === 'hourly_cost_fixed_items')
          const hoursData = data.find((d) => d.key === 'hourly_cost_monthly_hours')

          if (items?.value) {
            try {
              const parsed = JSON.parse(items.value)
              if (Array.isArray(parsed) && parsed.length > 0) {
                totalFixed = parsed.reduce(
                  (acc: number, curr: any) => acc + (Number(curr.value) || 0),
                  0,
                )
              }
            } catch (e) {
              console.error('Failed to parse hourly_cost_fixed_items', e)
            }
          }
          if (hoursData?.value) {
            hours = parseFloat(String(hoursData.value).replace(',', '.')) || 176
          }
        }

        const hourly = hours > 0 ? totalFixed / hours : 0
        const perMin = hourly / 60
        const computed = {
          totalFixedCosts: totalFixed,
          totalHourlyCost: hourly,
          costPerMinute: perMin,
        }

        if (isMounted) {
          setCosts(computed)
          setLoading(false)
          if (onFetched) onFetched(computed)
        }
      } catch (err) {
        console.error('Error fetching hourly costs:', err)
        if (isMounted) setLoading(false)
      }
    }

    fetchCosts()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading || !costs) {
    return (
      <div className="grid gap-3 md:grid-cols-3 mb-4 px-1 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="shadow-sm border-l-4 border-l-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-l-slate-800"
          >
            <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
              <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <Skeleton className="h-6 w-28 bg-slate-200 dark:bg-slate-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-3 mb-4 px-1">
      <Card className="shadow-sm border-l-4 border-l-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
        <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Total de Custos Fixos
          </CardTitle>
          <DollarSign className="w-4 h-4 text-slate-500" />
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
            {formatCurrency(costs.totalFixedCosts)}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Total Custo Hora
          </CardTitle>
          <Clock className="w-4 h-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(costs.totalHourlyCost)}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Total Custo por Minuto
          </CardTitle>
          <Calculator className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(costs.costPerMinute)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
