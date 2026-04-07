export function getOrderFinancials(order: any, priceList: any[], kanbanStages: any[]) {
  let quantity = 1
  if (order.tooth_or_arch) {
    let q = 0
    if (Array.isArray(order.tooth_or_arch)) {
      q = order.tooth_or_arch.length
    } else if (typeof order.tooth_or_arch === 'object') {
      if (Array.isArray(order.tooth_or_arch.teeth)) q += order.tooth_or_arch.teeth.length
      if (Array.isArray(order.tooth_or_arch.arches)) q += order.tooth_or_arch.arches.length
    }
    if (q > 0) quantity = q
  }

  const dentistDiscount = order.profiles?.commercial_agreement || 0
  const basePrice = Number(order.base_price) || 0
  const unitPrice = basePrice / quantity

  return {
    ...order,
    id: order.id,
    dentistId: order.dentist_id,
    status: order.status,
    basePrice,
    dentistDiscount,
    unitPrice,
    quantity,
    createdAt: order.created_at,
    patientName: order.patient_name,
    friendlyId: order.friendly_id,
    workType: order.work_type,
    custo_adicional_valor: order.custo_adicional_valor,
    settlementId: order.settlement_id,
  }
}

export function filterOrdersForFinancials(orders: any[], monthYear: string) {
  if (!orders || !Array.isArray(orders)) return []
  return orders
}

export function formatBRL(value: number | string | undefined | null): string {
  if (value === null || value === undefined) return 'R$ 0,00'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

export function computeHourlyCosts(costs: any[], totalMonthlyHours: number = 160): number {
  if (!costs || !Array.isArray(costs)) return 0

  const totalMonthlyCost = costs.reduce((acc, cost) => {
    const val = Number(cost.amount) || 0
    return acc + val
  }, 0)

  return totalMonthlyHours > 0 ? totalMonthlyCost / totalMonthlyHours : 0
}

export function calculateProcedureProfitability(procedure: any, hourlyCost: number) {
  const price = Number(procedure.price || procedure.base_price) || 0
  const durationHours = Number(procedure.estimated_hours) || 0
  const materialCost = Number(procedure.material_cost) || 0
  const totalCost = durationHours * hourlyCost + materialCost
  const profit = price - totalCost
  const margin = price > 0 ? (profit / price) * 100 : 0

  return {
    price,
    totalCost,
    profit,
    margin,
  }
}

export function generateMonthOptions(monthsToGenerate: number = 12) {
  const options = []
  const currentDate = new Date()

  for (let i = 0; i < monthsToGenerate; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    options.push({
      value: `${year}-${month}`,
      label: new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
        .format(d)
        .replace(/^\w/, (c) => c.toUpperCase()),
    })
  }

  return options
}
