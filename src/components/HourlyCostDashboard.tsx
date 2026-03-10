import { useAppStore } from '@/stores/main'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock, Calculator } from 'lucide-react'
import { computeHourlyCosts } from '@/lib/financial'

export function HourlyCostDashboard() {
  const { appSettings } = useAppStore()
  const costs = computeHourlyCosts(appSettings)

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
