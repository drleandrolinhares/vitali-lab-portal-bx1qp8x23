import { Stage } from '@/lib/types'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export type PriceStage = { id: string; name: string; price: number; kanban_stage: string }
export type PriceItem = {
  id: string
  work_type: string
  sector?: string
  price?: string | number
  price_stages?: PriceStage[]
}

export function computeHourlyCosts(settings: Record<string, string>) {
  const itemsStr = settings['hourly_cost_fixed_items']
  const hoursStr = settings['hourly_cost_monthly_hours']

  let totalFixed = 33200
  let hours = 176

  if (itemsStr) {
    try {
      const parsed = JSON.parse(itemsStr)
      if (Array.isArray(parsed) && parsed.length > 0) {
        totalFixed = parsed.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
      } else if (Array.isArray(parsed) && parsed.length === 0) {
        totalFixed = 0
      }
    } catch (e) {
      console.error('Failed to parse hourly_cost_fixed_items', e)
    }
  }
  if (hoursStr) {
    hours = parseFloat(String(hoursStr).replace(',', '.')) || 176
  }

  const hourly = hours > 0 ? totalFixed / hours : 0
  const perMin = hourly / 60
  return {
    totalFixedCosts: totalFixed,
    totalHourlyCost: hourly,
    costPerMinute: perMin,
  }
}

export function getOrderFinancials(order: any, priceList?: PriceItem[], kanbanStages?: Stage[]) {
  const isFullyCompleted = order.status === 'completed' || order.status === 'delivered'
  const isCancelled = order.status === 'cancelled'

  const quantity = Math.max(1, (order.teeth?.length || 0) + (order.arches?.length || 0))
  let basePrice = order.basePrice || 0
  let unitPrice = order.unitPrice || 0
  const discount = order.dentistDiscount || 0

  if (priceList && priceList.length > 0) {
    const priceItem =
      priceList.find(
        (p) => p.work_type === order.workType && (!p.sector || p.sector === order.sector),
      ) || priceList.find((p) => p.work_type === order.workType)

    if (priceItem && priceItem.price != null) {
      const numericString = String(priceItem.price)
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
      const parsed = parseFloat(numericString)
      if (!isNaN(parsed) && parsed > 0) {
        unitPrice = parsed
        basePrice = unitPrice * quantity * (1 - discount / 100)
      }
    }
  }

  if (unitPrice === 0) {
    unitPrice = quantity > 0 && discount < 100 ? basePrice / (1 - discount / 100) / quantity : 0
  }

  const effectiveUnitPrice = unitPrice * (1 - discount / 100)

  const completedCost = isFullyCompleted ? basePrice : 0
  const pipelineCost = !isFullyCompleted && !isCancelled ? basePrice : 0

  const clearedBalance = order.clearedBalance || 0
  const outstandingCost = Math.max(0, completedCost - clearedBalance)

  return {
    ...order,
    basePrice,
    unitPrice,
    effectiveUnitPrice,
    quantity,
    mappedStages: [],
    completedCost,
    pendingCost: pipelineCost,
    pipelineCost,
    clearedBalance,
    outstandingCost,
    totalCost: completedCost + pipelineCost,
  }
}

export const formatBRL = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function getOrderCompletionDate(order: any): Date | null {
  if (order.status !== 'completed' && order.status !== 'delivered') return null

  if (order.history && order.history.length > 0) {
    const completionEvents = order.history.filter(
      (h: any) => h.status === 'completed' || h.status === 'delivered',
    )
    if (completionEvents.length > 0) {
      completionEvents.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      return new Date(completionEvents[0].date)
    }
  }
  return new Date(order.createdAt)
}

export function generateMonthOptions() {
  return Array.from({ length: 13 }).map((_, i) => {
    const d = subMonths(new Date(), i)
    return {
      value: format(d, 'yyyy-MM'),
      label: format(d, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase()),
    }
  })
}

export function filterOrdersForFinancials(orders: any[], selectedMonth: string) {
  return orders.filter((o) => {
    if (o.status === 'cancelled') return false

    if (o.status === 'completed' || o.status === 'delivered') {
      const compDate = getOrderCompletionDate(o)
      return compDate && format(compDate, 'yyyy-MM') === selectedMonth
    } else {
      const createdStr = format(new Date(o.createdAt), 'yyyy-MM')
      return createdStr <= selectedMonth
    }
  })
}

export function calculateProcedureProfitability({
  price,
  executionTime,
  cadistaCost,
  materialCost,
  costPerMinute,
  globalCardFee,
  globalCommission,
  globalInadimplency,
  globalTaxes,
}: {
  price: number
  executionTime: number
  cadistaCost: number
  materialCost: number
  costPerMinute: number
  globalCardFee: number
  globalCommission: number
  globalInadimplency: number
  globalTaxes: number
}) {
  const fixedCost = executionTime * costPerMinute
  const cardFeeVal = price * (globalCardFee / 100)
  const commissionVal = price * (globalCommission / 100)
  const inadimplencyVal = price * (globalInadimplency / 100)
  const taxesVal = price * (globalTaxes / 100)

  const totalCosts =
    fixedCost + cardFeeVal + commissionVal + inadimplencyVal + taxesVal + cadistaCost + materialCost
  const profitVal = price - totalCosts
  const profitMargin = price > 0 ? (profitVal / price) * 100 : 0

  return {
    fixedCost,
    cardFeeVal,
    commissionVal,
    inadimplencyVal,
    taxesVal,
    totalCosts,
    profitVal,
    profitMargin,
  }
}
