import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock, Calculator } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function HourlyCostDashboard() {
  const { appSettings } = useAppStore()
  const [dbSettings, setDbSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchDbSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('*')
        .in('key', ['hourly_cost_fixed_items', 'hourly_cost_monthly_hours'])

      if (data) {
        const s = data.reduce((acc: any, curr) => ({ ...acc, [curr.key]: curr.value }), {})
        setDbSettings(s)
      }
    }
    fetchDbSettings()
  }, [])

  const mergedSettings = useMemo(
    () => ({ ...appSettings, ...dbSettings }),
    [appSettings, dbSettings],
  )

  const costs = useMemo(() => {
    let totalFixedCosts = 0
    let monthlyHours = 176

    try {
      if (mergedSettings['hourly_cost_fixed_items']) {
        const items = JSON.parse(mergedSettings['hourly_cost_fixed_items'])
        if (Array.isArray(items)) {
          totalFixedCosts = items.reduce(
            (acc: number, curr: any) => acc + (Number(curr.value) || 0),
            0,
          )
        }
      }
    } catch (e) {
      console.error('Error parsing fixed items', e)
    }

    if (mergedSettings['hourly_cost_monthly_hours']) {
      const parsedHours = Number(mergedSettings['hourly_cost_monthly_hours'])
      if (!isNaN(parsedHours) && parsedHours > 0) {
        monthlyHours = parsedHours
      }
    }

    const totalHourlyCost = totalFixedCosts / monthlyHours
    const costPerMinute = totalHourlyCost / 60

    return { totalFixedCosts, totalHourlyCost, costPerMinute }
  }, [mergedSettings])

  const safeFormat = (val: number) => {
    if (isNaN(val)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
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
            {safeFormat(costs.totalFixedCosts)}
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
            {safeFormat(costs.totalHourlyCost)}
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
            {safeFormat(costs.costPerMinute)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
