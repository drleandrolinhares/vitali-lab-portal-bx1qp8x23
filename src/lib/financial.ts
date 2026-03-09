import { Stage } from '@/lib/types'

export type PriceStage = { id: string; name: string; price: number; kanban_stage: string }
export type PriceItem = {
  id: string
  work_type: string
  sector?: string
  price?: string | number
  price_stages?: PriceStage[]
}

export function getOrderFinancials(order: any, priceList?: PriceItem[], kanbanStages?: Stage[]) {
  const isFullyCompleted = order.status === 'completed' || order.status === 'delivered'
  const isCancelled = order.status === 'cancelled'

  const basePrice = order.basePrice || 0
  const completedCost = isFullyCompleted ? basePrice : 0
  const pipelineCost = !isFullyCompleted && !isCancelled ? basePrice : 0

  const clearedBalance = order.clearedBalance || 0
  const outstandingCost = Math.max(0, completedCost - clearedBalance)

  return {
    ...order,
    basePrice,
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
