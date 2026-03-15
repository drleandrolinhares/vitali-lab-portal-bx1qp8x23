import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { InvoicePreviewDialog } from './InvoicePreviewDialog'
import { format } from 'date-fns'
import { Loader2, FileText, CheckCircle, ArrowLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CreateInstallmentDialog } from './CreateInstallmentDialog'

interface Order {
  id: string
  friendly_id: string
  created_at: string
  patient_name: string
  work_type: string
  base_price: number
  status: string
}

interface DentistBillingDetailsProps {
  dentistId: string
  onBack?: () => void
}

export function DentistBillingDetails({ dentistId, onBack }: DentistBillingDetailsProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [dentist, setDentist] = useState<{ name: string; clinic: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [installmentOpen, setInstallmentOpen] = useState(false)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  useEffect(() => {
    if (!dentistId) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, clinic')
          .eq('id', dentistId)
          .single()

        if (profile) setDentist(profile as any)

        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, friendly_id, created_at, patient_name, work_type, base_price, status')
          .eq('dentist_id', dentistId)
          .eq('status', 'completed')
          .is('settlement_id', null)
          .order('created_at', { ascending: false })

        if (ordersData) {
          setOrders(ordersData as Order[])
        }
      } catch (error) {
        console.error('Error fetching billing details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dentistId])

  const totalAmount = orders.reduce((sum, order) => sum + (order.base_price || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-2xl font-bold tracking-tight">{dentist?.name || 'Dentista'}</h2>
          </div>
          <p className="text-muted-foreground pl-10 md:pl-0">
            {dentist?.clinic || 'Clínica não informada'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pl-10 md:pl-0">
          <Button
            variant="secondary"
            onClick={() => setPreviewOpen(true)}
            className="gap-2"
            disabled={orders.length === 0}
          >
            <FileText className="w-4 h-4" />
            VISUALIZAR FATURA DO DENTISTA
          </Button>
          <Button
            onClick={() => setInstallmentOpen(true)}
            className="gap-2"
            disabled={orders.length === 0}
          >
            <CheckCircle className="w-4 h-4" />
            Gerar Faturamento
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Pendentes de Faturamento</CardTitle>
          <CardDescription>
            Estes pedidos foram concluídos mas ainda não foram faturados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Nenhum pedido pendente de faturamento para este dentista.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.created_at ? format(new Date(order.created_at), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">{order.friendly_id || '-'}</TableCell>
                      <TableCell className="uppercase">{order.patient_name || '-'}</TableCell>
                      <TableCell className="uppercase">{order.work_type || '-'}</TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        {formatCurrency(order.base_price || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {orders.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl min-w-[320px] space-y-3 shadow-sm">
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Total de Pedidos:</span>
                  <span className="font-medium text-slate-900">{orders.length}</span>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-slate-700">Total a Faturar:</span>
                  <span className="font-black text-slate-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InvoicePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        dentistName={dentist?.name || 'Dentista'}
        clinicName={dentist?.clinic || ''}
        orders={orders}
        totalAmount={totalAmount}
      />

      {installmentOpen && (
        <CreateInstallmentDialog
          open={installmentOpen}
          onOpenChange={setInstallmentOpen}
          dentistId={dentistId}
          orders={orders}
          totalAmount={totalAmount}
          onSuccess={() => {
            setInstallmentOpen(false)
            if (onBack) onBack()
          }}
        />
      )}
    </div>
  )
}
