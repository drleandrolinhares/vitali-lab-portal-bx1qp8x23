import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  getBillingCycleDates,
  formatBRL,
  getOrderFinancials,
  getOrderCompletionDate,
} from '@/lib/financial'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { isWithinInterval } from 'date-fns'
import { DentistBillingDetails } from './DentistBillingDetails'

export function DentistBillingTab({
  selectedMonth,
  dentists,
  selectedMonthLabel,
}: {
  selectedMonth: string
  dentists: any[]
  selectedMonthLabel?: string
}) {
  const { orders, priceList, kanbanStages, refreshOrders } = useAppStore()
  const [installments, setInstallments] = useState<any[]>([])
  const [selectedDentist, setSelectedDentist] = useState<any>(null)

  const fetchInstallments = async () => {
    const { data } = await supabase.from('billing_installments').select('*').eq('status', 'active')
    if (data) setInstallments(data)
    refreshOrders()
  }

  useEffect(() => {
    fetchInstallments()
  }, [])

  const billingData = useMemo(() => {
    return dentists
      .map((d) => {
        const closingDay = d.closing_date || 30
        const cycle = getBillingCycleDates(selectedMonth, closingDay)

        const cycleOrders = orders
          .filter((o) => {
            if (o.dentistId !== d.id) return false
            if (o.status !== 'completed' && o.status !== 'delivered') return false
            const compDate = getOrderCompletionDate(o)
            return compDate && isWithinInterval(compDate, { start: cycle.start, end: cycle.end })
          })
          .map((o) => getOrderFinancials(o, priceList, kanbanStages))

        const outstandingOrders = cycleOrders.filter((o) => o.outstandingCost > 0)
        const ordersTotal = outstandingOrders.reduce((sum, o) => sum + o.outstandingCost, 0)

        const activePlans = installments.filter((i) => i.dentist_id === d.id)
        const installmentsTotal = activePlans.reduce(
          (sum, i) => sum + Number(i.installment_value),
          0,
        )

        const currentMonthTotal = ordersTotal + installmentsTotal

        return {
          ...d,
          cycle,
          outstandingOrders,
          ordersTotal,
          activePlans,
          installmentsTotal,
          currentMonthTotal,
        }
      })
      .sort((a, b) => b.currentMonthTotal - a.currentMonthTotal)
  }, [dentists, orders, selectedMonth, installments, priceList, kanbanStages])

  return (
    <div className="space-y-4 animate-fade-in mt-4">
      <div className="border rounded-lg bg-background shadow-subtle overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dentista</TableHead>
              <TableHead className="text-center">Fechamento</TableHead>
              <TableHead className="text-center">Vencimento</TableHead>
              <TableHead className="text-right">Pedidos (Mês)</TableHead>
              <TableHead className="text-right">Parcelas (Mês)</TableHead>
              <TableHead className="text-right">Total Fatura</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingData.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="text-center">Dia {d.closing_date || 30}</TableCell>
                <TableCell className="text-center">Dia {d.payment_due_date || 5}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatBRL(d.ordersTotal)}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatBRL(d.installmentsTotal)}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  {formatBRL(d.currentMonthTotal)}
                </TableCell>
                <TableCell className="text-center">
                  {d.currentMonthTotal > 0 ? (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                      Pendente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 bg-emerald-50"
                    >
                      Fechado
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDentist(d)}>
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {billingData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum dentista encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDentist && (
        <DentistBillingDetails
          open={!!selectedDentist}
          onOpenChange={(op: boolean) => !op && setSelectedDentist(null)}
          dentistData={selectedDentist}
          selectedMonthLabel={selectedMonthLabel}
          onRefresh={fetchInstallments}
        />
      )}
    </div>
  )
}
