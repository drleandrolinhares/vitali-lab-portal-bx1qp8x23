import { Stage } from '@/lib/types'

export type PriceStage = { id: string; name: string; price: number; kanban_stage: string }
export type PriceItem = { id: string; work_type: string; price_stages?: PriceStage[] }

export function getOrderFinancials(order: any, priceList: PriceItem[], kanbanStages: Stage[]) {
  const priceItem = priceList.find((p) => p.work_type === order.workType)
  const stages = priceItem?.price_stages || []

  const kanbanIndexMap: Record<string, number> = {}
  kanbanStages.forEach((s) => (kanbanIndexMap[s.name] = s.orderIndex))

  const currentOrderIndex = kanbanIndexMap[order.kanbanStage] || 0
  const isFullyCompleted = order.status === 'completed' || order.status === 'delivered'

  let completedCost = 0
  let pendingCost = 0

  const mappedStages = stages.map((st) => {
    const stIndex = kanbanIndexMap[st.kanban_stage] || 0
    const isCompleted = isFullyCompleted || currentOrderIndex > stIndex
    if (isCompleted) completedCost += st.price
    else pendingCost += st.price
    return { ...st, isCompleted }
  })

  const clearedBalance = order.clearedBalance || 0
  const outstandingCost = Math.max(0, completedCost - clearedBalance)

  return {
    ...order,
    mappedStages,
    completedCost,
    pendingCost,
    clearedBalance,
    outstandingCost,
    totalCost: completedCost + pendingCost,
  }
}

export const formatBRL = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
