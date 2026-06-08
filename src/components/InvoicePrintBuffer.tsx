import { createPortal } from 'react-dom'
import { format, isValid, parseISO } from 'date-fns'

interface InvoicePrintBufferProps {
  isPrinting: boolean
  dentist: any
  labProfile: any
  orders: any[]
  invoiceDate: Date
}

export function InvoicePrintBuffer({
  isPrinting,
  dentist,
  labProfile,
  orders,
  invoiceDate,
}: InvoicePrintBufferProps) {
  if (!isPrinting) return null

  const dateStr = format(invoiceDate, 'dd/MM/yyyy')
  const totalAmount = orders.reduce((sum, o) => {
    const base = Number(o.basePrice || o.base_price || o.clearedAmount || 0)
    const add = Number(o.custo_adicional_valor || 0)
    return sum + base + add
  }, 0)

  return createPortal(
    <div id="print-root" className="bg-white text-black p-8 font-sans">
      <table className="w-full border-collapse invoice-table">
        <thead className="invoice-table-header-group">
          <tr>
            <td>
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
                    {labProfile?.clinic || 'VITALI LAB'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    CNPJ: {labProfile?.cpf || 'Não informado'}
                  </p>
                  {labProfile?.address && (
                    <p className="text-sm text-gray-600 mt-1 font-medium">{labProfile.address}</p>
                  )}
                </div>
                <div className="text-right flex-none">
                  <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
                    Fatura de Serviços
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    Data de Emissão: {dateStr}
                  </p>
                </div>
              </div>
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Sacado (Cliente)
                </h3>
                <p className="text-lg font-bold text-gray-900">
                  {dentist?.name || 'Cliente Não Identificado'}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {dentist?.cpf && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">CPF/CNPJ:</span> {dentist.cpf}
                    </p>
                  )}
                  {dentist?.clinic && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Clínica:</span> {dentist.clinic}
                    </p>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody className="invoice-table-row-group">
          <tr>
            <td>
              <table className="w-full text-sm border-collapse mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-800 text-gray-700">
                    <th className="text-left py-3 px-2 font-bold uppercase text-xs tracking-wider w-1/5">
                      Data Conclusão
                    </th>
                    <th className="text-left py-3 px-2 font-bold uppercase text-xs tracking-wider">
                      Paciente / Serviço
                    </th>
                    <th className="text-right py-3 px-2 font-bold uppercase text-xs tracking-wider w-1/4">
                      Valor Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => {
                    const completedAtStr = order.completedAt || order.completed_at
                    const createdAtStr = order.createdAt || order.created_at

                    let dateDisplay = ''
                    if (completedAtStr) {
                      const d = parseISO(completedAtStr)
                      dateDisplay = isValid(d) ? format(d, 'dd/MM/yyyy') : ''
                    } else if (createdAtStr) {
                      const d = parseISO(createdAtStr)
                      dateDisplay = isValid(d) ? `Criado em ${format(d, 'dd/MM/yyyy')}` : ''
                    }

                    if (!dateDisplay) {
                      dateDisplay = format(invoiceDate, 'dd/MM/yyyy')
                    }

                    const base = Number(
                      order.basePrice || order.base_price || order.clearedAmount || 0,
                    )
                    const add = Number(order.custo_adicional_valor || 0)
                    const rowTotal = base + add

                    return (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-gray-600 whitespace-nowrap align-top">
                          {dateDisplay}
                        </td>
                        <td className="py-3 px-2 align-top">
                          <p className="font-bold text-gray-900">
                            {order.patientName || order.patient_name || '-'}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {order.workType || order.work_type || '-'}
                          </p>
                          {add > 0 && order.custo_adicional_descricao && (
                            <p className="text-emerald-600 text-xs mt-1 font-semibold">
                              + {order.custo_adicional_descricao}
                            </p>
                          )}
                        </td>
                        <td className="text-right py-3 px-2 font-semibold align-top">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(rowTotal)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="flex justify-end mb-12">
                <div className="w-72 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                      Total a Pagar
                    </span>
                    <span className="text-2xl font-black text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot className="invoice-table-footer-group">
          <tr>
            <td>
              <div className="mt-8 pt-6 border-t-2 border-gray-100 invoice-footer-content">
                <h4 className="font-black text-gray-800 uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                  Dados para Pagamento (PIX)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                      Instituição Bancária
                    </p>
                    <p className="font-semibold text-gray-900 text-base">
                      {labProfile?.bank_name || 'Informação Bancária via PIX'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 uppercase tracking-wider font-bold mb-1">
                      Chave PIX
                    </p>
                    <p className="font-mono font-bold text-gray-900 text-base">
                      {labProfile?.pix_key || 'Não informada'}
                    </p>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                      Favorecido (Titular da Conta)
                    </p>
                    <p className="font-semibold text-gray-900 text-base">
                      {labProfile?.clinic || 'VITALI LAB'}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>,
    document.body,
  )
}
