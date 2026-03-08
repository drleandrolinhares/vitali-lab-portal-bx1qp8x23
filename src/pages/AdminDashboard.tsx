import { useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, CheckCircle2, PackageCheck, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const { orders, selectedLab } = useAppStore()

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => selectedLab === 'Todos' || o.sector === selectedLab)
  }, [orders, selectedLab])

  const metrics = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === 'pending').length,
      production: filteredOrders.filter((o) => o.status === 'in_production').length,
      completed: filteredOrders.filter((o) => o.status === 'completed' || o.status === 'delivered')
        .length,
    }
  }, [filteredOrders])

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Dashboard Gerencial</h2>
          <p className="text-muted-foreground text-sm">Visão geral de desempenho e produção.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-subtle border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Total de Pedidos
            </CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Na Triagem
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{metrics.pending}</div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Em Produção
            </CardTitle>
            <PackageCheck className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{metrics.production}</div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Finalizados
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{metrics.completed}</div>
          </CardContent>
        </Card>
      </div>

      {metrics.total === 0 && (
        <Card className="shadow-subtle mt-8">
          <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
            Nenhum dado encontrado para o laboratório selecionado.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
