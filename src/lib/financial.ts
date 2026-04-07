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
