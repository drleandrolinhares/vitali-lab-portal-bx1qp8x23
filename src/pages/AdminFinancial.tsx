import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  Loader2,
  Download,
  BarChart3,
  Wallet,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { InvoicePreviewDialog } from '@/components/financial/InvoicePreviewDialog'
import { useAppStore } from '@/stores/main'

const MONTHS = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
]

const YEARS = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

export default function AdminFinancial() {
  const { currentUser, loading: storeLoading, refreshOrders } = useAppStore()

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'master'

  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedDentist, setSelectedDentist] = useState<string>('all')
  const [showOnlyReadyToInvoice, setShowOnlyReadyToInvoice] = useState(true)

  const [loadingSettlements, setLoadingSettlements] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])
  const [directOrders, setDirectOrders] = useState<any[]>([])
  const [installments, setInstallments] = useState<any[]>([])

  // Modal State
  const [manualInvoiceDentist, setManualInvoiceDentist] = useState<string | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Payment Plan State
  const [paymentType, setPaymentType] = useState<'single' | 'installment'>('single')
  const [upfrontAmount, setUpfrontAmount] = useState<string>('')
  const [installmentsCount, setInstallmentsCount] = useState<string>('2')
  const [intervalDays, setIntervalDays] = useState<string>('30')

  // Receive Settlement State (Single)
  const [receiveSettlement, setReceiveSettlement] = useState<any | null>(null)
  const [receiveDate, setReceiveDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [receiveNote, setReceiveNote] = useState<string>('')
  const [isReceiving, setIsReceiving] = useState(false)

  // Receive Installment State
  const [receiveInstallment, setReceiveInstallment] = useState<any | null>(null)
  const [receiveInstallmentDate, setReceiveInstallmentDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [receiveInstallmentMethod, setReceiveInstallmentMethod] = useState<string>('')
  const [isReceivingInstallment, setIsReceivingInstallment] = useState(false)

  // Pipeline Details Modal State
  const [pipelineDentist, setPipelineDentist] = useState<string | null>(null)

  const fetchData = async () => {
    setLoadingSettlements(true)
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) return

      const [profilesRes, settlementsRes, ordersRes, installmentsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, name, clinic, closing_date, payment_due_date')
          .in('role', ['dentist', 'laboratory'])
          .order('name'),
        supabase
          .from('settlements')
          .select(
            'id, amount, created_at, dentist_id, status, paid_at, orders_snapshot, note, total_installments',
          ),
        supabase
          .from('orders')
          .select(
            'id, friendly_id, patient_name, dentist_id, status, base_price, settlement_id, created_at, work_type, kanban_stage',
          ),
        supabase.from('billing_installments').select('*'),
      ])

      if (profilesRes.error) throw profilesRes.error
      if (settlementsRes.error) throw settlementsRes.error
      if (ordersRes.error) throw ordersRes.error
      if (installmentsRes.error) throw installmentsRes.error

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (settlementsRes.data) setSettlements(settlementsRes.data)
      if (ordersRes.data) setDirectOrders(ordersRes.data)
      if (installmentsRes.data) setInstallments(installmentsRes.data)
    } catch (error: any) {
      console.error('Error fetching financial data:', error)
      toast({ title: 'Erro ao buscar dados financeiros', variant: 'destructive' })
    } finally {
      setLoadingSettlements(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { summary, tableData } = useMemo(() => {
    let faturar = 0
    let pipeline = 0
    let recebido = 0
    const inadimplencia = 0

    const map = new Map<string, any>()
    profiles.forEach((p) => {
      if (selectedDentist !== 'all' && p.id !== selectedDentist) return
      map.set(p.id, {
        id: p.id,
        name: p.name,
        clinic: p.clinic,
        closing_date: p.closing_date,
        payment_due_date: p.payment_due_date,
        aFaturar: 0,
        emProducao: 0,
        readyToInvoiceCount: 0,
        unsettledOrders: [],
        pipelineOrders: [],
      })
    })

    directOrders.forEach((o) => {
      if (selectedDentist !== 'all' && o.dentist_id !== selectedDentist) return

      const isCompleted = o.status === 'completed' || o.status === 'delivered'
      const isCancelled = o.status === 'cancelled'
      const basePrice = Number(o.base_price || 0)

      const orderDate = new Date(o.created_at)
      const orderMonth = orderDate.getMonth().toString()
      const orderYear = orderDate.getFullYear().toString()
      const isSelectedPeriod = orderMonth === selectedMonth && orderYear === selectedYear

      if (isCompleted && !o.settlement_id && isSelectedPeriod) {
        faturar += basePrice
      }

      if (!isCompleted && !isCancelled) {
        pipeline += basePrice
      }

      if (!o.dentist_id || !map.has(o.dentist_id)) return
      const dentistData = map.get(o.dentist_id)

      if (isCompleted && !o.settlement_id && isSelectedPeriod) {
        dentistData.aFaturar += basePrice
        dentistData.readyToInvoiceCount += 1
        dentistData.unsettledOrders.push({
          id: o.id,
          friendlyId: o.friendly_id,
          patientName: o.patient_name,
          workType: o.work_type,
          basePrice: basePrice,
          createdAt: o.created_at,
        })
      }

      if (!isCompleted && !isCancelled) {
        dentistData.emProducao += basePrice
        dentistData.pipelineOrders.push({
          id: o.id,
          friendlyId: o.friendly_id,
          patientName: o.patient_name,
          workType: o.work_type,
          kanbanStage: o.kanban_stage,
          basePrice: basePrice,
          createdAt: o.created_at,
        })
      }
    })

    settlements.forEach((s) => {
      if (selectedDentist !== 'all' && s.dentist_id !== selectedDentist) return
      if (
        s.status === 'paid' &&
        s.paid_at &&
        (!s.total_installments || s.total_installments === 1)
      ) {
        const [year, month] = s.paid_at.split('T')[0].split('-')
        if ((parseInt(month, 10) - 1).toString() === selectedMonth && year === selectedYear) {
          recebido += Number(s.amount || 0)
        }
      }
    })

    installments.forEach((i) => {
      if (selectedDentist !== 'all' && i.dentist_id !== selectedDentist) return
      if (i.status === 'paid' && i.paid_at) {
        const [year, month] = i.paid_at.split('T')[0].split('-')
        if ((parseInt(month, 10) - 1).toString() === selectedMonth && year === selectedYear) {
          recebido += Number(i.installment_value || 0)
        }
      }
    })

    const activeTableData = Array.from(map.values())
      .filter((d) => {
        if (showOnlyReadyToInvoice) {
          return d.aFaturar > 0 || d.readyToInvoiceCount > 0
        }
        return d.aFaturar > 0 || d.emProducao > 0 || d.readyToInvoiceCount > 0
      })
      .sort((a, b) => b.aFaturar - a.aFaturar)

    return {
      summary: { faturar, pipeline, recebido, inadimplencia },
      tableData: activeTableData,
    }
  }, [
    profiles,
    directOrders,
    settlements,
    installments,
    selectedMonth,
    selectedYear,
    selectedDentist,
    showOnlyReadyToInvoice,
  ])

  const pendingInvoices = useMemo(() => {
    return settlements
      .filter(
        (s) =>
          s.status === 'pending' &&
          (!s.total_installments || s.total_installments === 1) &&
          (selectedDentist === 'all' || s.dentist_id === selectedDentist),
      )
      .map((s) => {
        const dentist = profiles.find((p) => p.id === s.dentist_id)
        return {
          ...s,
          dentistName: dentist?.name || 'Desconhecido',
          clinic: dentist?.clinic || '',
        }
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [settlements, profiles, selectedDentist])

  const paidInvoices = useMemo(() => {
    return settlements
      .filter((s) => {
        if (s.status !== 'paid') return false
        if (s.total_installments && s.total_installments > 1) return false
        if (selectedDentist !== 'all' && s.dentist_id !== selectedDentist) return false

        const dateStr = s.paid_at || s.created_at
        if (!dateStr) return false

        const [year, month] = dateStr.split('T')[0].split('-')
        const itemMonth = (parseInt(month, 10) - 1).toString()

        return itemMonth === selectedMonth && year === selectedYear
      })
      .map((s) => {
        const dentist = profiles.find((p) => p.id === s.dentist_id)
        return {
          ...s,
          dentistName: dentist?.name || 'Desconhecido',
          clinic: dentist?.clinic || '',
        }
      })
      .sort(
        (a, b) =>
          new Date(b.paid_at || b.created_at).getTime() -
          new Date(a.paid_at || a.created_at).getTime(),
      )
  }, [settlements, profiles, selectedDentist, selectedMonth, selectedYear])

  const pendingInstallments = useMemo(() => {
    return installments
      .filter(
        (i) =>
          i.status !== 'paid' && (selectedDentist === 'all' || i.dentist_id === selectedDentist),
      )
      .map((i) => {
        const dentist = profiles.find((p) => p.id === i.dentist_id)
        return {
          ...i,
          dentistName: dentist?.name || 'Desconhecido',
          clinic: dentist?.clinic || '',
        }
      })
      .sort(
        (a, b) =>
          new Date(a.due_date || a.created_at).getTime() -
          new Date(b.due_date || b.created_at).getTime(),
      )
  }, [installments, profiles, selectedDentist])

  const paidInstallments = useMemo(() => {
    return installments
      .filter(
        (i) =>
          i.status === 'paid' && (selectedDentist === 'all' || i.dentist_id === selectedDentist),
      )
      .map((i) => {
        const dentist = profiles.find((p) => p.id === i.dentist_id)
        return {
          ...i,
          dentistName: dentist?.name || 'Desconhecido',
          clinic: dentist?.clinic || '',
        }
      })
      .sort(
        (a, b) =>
          new Date(b.paid_at || b.created_at).getTime() -
          new Date(a.paid_at || a.created_at).getTime(),
      )
  }, [installments, profiles, selectedDentist])

  const modalOrders = useMemo(() => {
    if (!manualInvoiceDentist) return []
    const dentistData = tableData.find((d) => d.id === manualInvoiceDentist)
    if (!dentistData) return []
    return dentistData.unsettledOrders.sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [manualInvoiceDentist, tableData])

  useEffect(() => {
    if (manualInvoiceDentist) {
      setSelectedOrderIds(modalOrders.map((o: any) => o.id))
      setPaymentType('single')
      setUpfrontAmount('')
      setInstallmentsCount('2')
      setIntervalDays('30')
    } else {
      setSelectedOrderIds([])
    }
  }, [manualInvoiceDentist, modalOrders])

  const selectedTotalAmount = modalOrders
    .filter((o: any) => selectedOrderIds.includes(o.id))
    .reduce((sum: number, o: any) => sum + (o.basePrice || 0), 0)

  const installmentPreview = useMemo(() => {
    if (paymentType === 'single') return null
    const upfront = parseFloat(upfrontAmount) || 0
    const count = parseInt(installmentsCount) || 1
    const remaining = selectedTotalAmount - upfront
    const instValue = count > 0 ? remaining / count : remaining
    return { upfront, count, instValue }
  }, [paymentType, upfrontAmount, installmentsCount, selectedTotalAmount])

  const handleExport = () => {
    let csv =
      'Dentista / Clínica,Data de Fechamento,Data de Pagamento,A Faturar (R$),Em Produção (Pipeline) (R$)\n'
    tableData.forEach((d) => {
      csv += `"${d.name} ${d.clinic ? `/ ${d.clinic}` : ''}",${d.closing_date || ''},${d.payment_due_date || ''},${d.aFaturar},${d.emProducao}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Producao_${MONTHS.find((m) => m.value === selectedMonth)?.label}_${selectedYear}.csv`
    link.click()
  }

  const handleToggleAllOrders = (checked: boolean) => {
    if (checked) setSelectedOrderIds(modalOrders.map((o: any) => o.id))
    else setSelectedOrderIds([])
  }

  const handleToggleOrder = (id: string, checked: boolean) => {
    if (checked) setSelectedOrderIds((prev) => [...prev, id])
    else setSelectedOrderIds((prev) => prev.filter((x) => x !== id))
  }

  const handleConfirmReceive = async () => {
    if (!receiveSettlement || !receiveDate) return
    setIsReceiving(true)
    try {
      const { error } = await supabase
        .from('settlements')
        .update({
          status: 'paid',
          paid_at: new Date(receiveDate + 'T12:00:00Z').toISOString(),
          note: receiveNote,
        })
        .eq('id', receiveSettlement.id)

      if (error) throw error

      toast({ title: 'Recebimento confirmado com sucesso!' })
      fetchData()
      setReceiveSettlement(null)
      setReceiveDate(new Date().toISOString().split('T')[0])
      setReceiveNote('')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao confirmar recebimento',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsReceiving(false)
    }
  }

  const handleConfirmReceiveInstallment = async () => {
    if (!receiveInstallment || !receiveInstallmentDate) return
    setIsReceivingInstallment(true)
    try {
      const { error } = await supabase
        .from('billing_installments')
        .update({
          status: 'paid',
          paid_at: new Date(receiveInstallmentDate + 'T12:00:00Z').toISOString(),
          payment_method: receiveInstallmentMethod,
        })
        .eq('id', receiveInstallment.id)

      if (error) throw error

      const { data: pendingSiblings } = await supabase
        .from('billing_installments')
        .select('id')
        .eq('settlement_id', receiveInstallment.settlement_id)
        .neq('status', 'paid')
        .neq('id', receiveInstallment.id)

      if (pendingSiblings && pendingSiblings.length === 0) {
        await supabase
          .from('settlements')
          .update({
            status: 'paid',
            paid_at: new Date(receiveInstallmentDate + 'T12:00:00Z').toISOString(),
          })
          .eq('id', receiveInstallment.settlement_id)
      }

      toast({ title: 'Parcela recebida com sucesso!' })
      fetchData()
      setReceiveInstallment(null)
      setReceiveInstallmentDate(new Date().toISOString().split('T')[0])
      setReceiveInstallmentMethod('')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao receber parcela',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsReceivingInstallment(false)
    }
  }

  const handleConfirmInvoice = async () => {
    if (selectedOrderIds.length === 0) return
    setIsSubmitting(true)
    try {
      const ordersToSettle = modalOrders.filter((o: any) => selectedOrderIds.includes(o.id))
      const totalAmount = ordersToSettle.reduce(
        (sum: number, o: any) => sum + (o.basePrice || 0),
        0,
      )

      const snapshot = ordersToSettle.map((o: any) => ({
        id: o.id,
        friendlyId: o.friendlyId,
        patientName: o.patientName,
        workType: o.workType,
        clearedAmount: o.basePrice,
      }))

      const isInstallment = paymentType === 'installment'
      const upfront = parseFloat(upfrontAmount) || 0
      const count = parseInt(installmentsCount) || 1
      const finalInstallmentsCount = isInstallment ? (upfront > 0 ? count + 1 : count) : 1

      const { data: settlementData, error } = await supabase
        .from('settlements')
        .insert({
          dentist_id: manualInvoiceDentist,
          amount: totalAmount,
          orders_snapshot: snapshot,
          status: isInstallment ? 'installment_plan' : 'pending',
          total_installments: finalInstallmentsCount,
        })
        .select('id')
        .single()

      if (error) throw error

      const { error: updateError } = await supabase
        .from('orders')
        .update({ settlement_id: settlementData.id })
        .in('id', selectedOrderIds)

      if (updateError) throw updateError

      if (isInstallment) {
        const interval = parseInt(intervalDays) || 30
        const remainingTotal = totalAmount - upfront
        const installmentValue = remainingTotal / count

        const inserts = []
        let currentInstNum = 1
        const baseDate = new Date()

        if (upfront > 0) {
          inserts.push({
            dentist_id: manualInvoiceDentist,
            settlement_id: settlementData.id,
            total_amount: totalAmount,
            installment_value: upfront,
            total_installments: finalInstallmentsCount,
            remaining_installments: finalInstallmentsCount,
            installment_number: currentInstNum,
            due_date: baseDate.toISOString().split('T')[0],
            status: 'pending',
            note: 'Entrada',
          })
          currentInstNum++
        }

        for (let i = 0; i < count; i++) {
          const dueDate = new Date(baseDate)
          dueDate.setDate(dueDate.getDate() + interval * (i + 1))

          inserts.push({
            dentist_id: manualInvoiceDentist,
            settlement_id: settlementData.id,
            total_amount: totalAmount,
            installment_value: installmentValue,
            total_installments: finalInstallmentsCount,
            remaining_installments: finalInstallmentsCount - currentInstNum + 1,
            installment_number: currentInstNum,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pending',
            note: `Parcela ${i + 1}/${count}`,
          })
          currentInstNum++
        }

        const { error: instError } = await supabase.from('billing_installments').insert(inserts)
        if (instError) throw instError
      }

      toast({ title: 'Fatura fechada com sucesso!' })
      fetchData()
      refreshOrders()
      setManualInvoiceDentist(null)
    } catch (err: any) {
      console.error(err)
      toast({ title: 'Erro ao fechar fatura', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (storeLoading || loadingSettlements) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1600px] flex flex-col gap-6 animate-in fade-in duration-500 lg:h-[calc(100vh-6rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary uppercase">
              PAINEL GERENCIAL GLOBAL
            </h1>
            <p className="text-muted-foreground text-sm">
              Visão financeira e acompanhamento de faturamento do laboratório.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm px-3 py-1.5 h-10">
            <Checkbox
              id="show-ready"
              checked={showOnlyReadyToInvoice}
              onCheckedChange={(c) => setShowOnlyReadyToInvoice(!!c)}
            />
            <label
              htmlFor="show-ready"
              className="text-sm font-medium text-slate-700 cursor-pointer whitespace-nowrap"
            >
              Apenas Prontos p/ Faturar
            </label>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1 min-w-[200px] h-10">
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="border-none shadow-none focus:ring-0 h-full font-medium">
                <SelectValue placeholder="Todos os Dentistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleExport} className="gap-2 bg-white h-10">
            <Download className="w-4 h-4" /> Exportar
          </Button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1 h-10">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0 h-full font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-px h-5 bg-slate-200" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 h-full font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="painel" className="flex-1 flex flex-col min-h-0 mt-4 gap-6">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-none overflow-x-auto">
          <TabsTrigger
            value="painel"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
          >
            Painel Gerencial
          </TabsTrigger>
          <TabsTrigger
            value="faturamento"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
          >
            Faturamento (Únicas)
          </TabsTrigger>
          <TabsTrigger
            value="parcelamentos"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
          >
            Gestão de Parcelamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="painel"
          className="flex-1 flex flex-col min-h-0 mt-0 gap-6 data-[state=inactive]:hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p
                    className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center"
                    title="Trabalhos Concluídos a Faturar"
                  >
                    Trabalhos Concluídos a Faturar
                  </p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {formatCurrency(summary.faturar)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full flex-none">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-amber-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p
                    className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center"
                    title="Trabalhos em Pipeline de Produção"
                  >
                    Trabalhos em Pipeline de Produção
                  </p>
                  <h3 className="text-2xl font-bold text-amber-600">
                    {formatCurrency(summary.pipeline)}
                  </h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full flex-none">
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center">
                    Recebido (Mês)
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(summary.recebido)}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full flex-none">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center">
                    Inadimplência
                  </p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {formatCurrency(summary.inadimplencia)}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full flex-none">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-slate-200 overflow-hidden">
            <div className="overflow-auto flex-1 bg-white">
              <Table>
                <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 pl-6">
                      Dentista / Clínica
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">
                      Data de Fechamento
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">
                      Data de Pagamento
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">
                      A Faturar (R$)
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">
                      Em Produção (Pipeline) (R$)
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right pr-6">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        Nenhum dado encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50/50">
                        <TableCell className="pl-6">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          {row.clinic && (
                            <p className="text-xs text-muted-foreground">{row.clinic}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium text-slate-600">
                          {row.closing_date ? `Dia ${row.closing_date}` : '-'}
                        </TableCell>
                        <TableCell className="text-center font-medium text-slate-600">
                          {row.payment_due_date ? `Dia ${row.payment_due_date}` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {formatCurrency(row.aFaturar)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-amber-600">
                          {row.emProducao > 0 ? (
                            <Button
                              variant="link"
                              className="text-amber-600 font-bold p-0 h-auto hover:text-amber-700"
                              onClick={() => setPipelineDentist(row.id)}
                            >
                              {formatCurrency(row.emProducao)}
                            </Button>
                          ) : (
                            formatCurrency(row.emProducao)
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setManualInvoiceDentist(row.id)}
                            disabled={row.readyToInvoiceCount === 0}
                            className="text-xs font-semibold"
                          >
                            FECHAR FATURA MANUAL
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="faturamento"
          className="flex-1 flex flex-col min-h-0 mt-0 gap-6 data-[state=inactive]:hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            <Card className="shadow-sm border-slate-200 flex flex-col min-h-0">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Faturas Únicas Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="pl-6">Data Fechamento</TableHead>
                      <TableHead>Dentista / Clínica</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Nenhuma fatura única pendente encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                          <TableCell className="pl-6 whitespace-nowrap font-medium text-slate-600">
                            {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-900">{invoice.dentistName}</p>
                            {invoice.clinic && (
                              <p className="text-xs text-muted-foreground">{invoice.clinic}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              Pendente
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReceiveSettlement(invoice)
                                  setReceiveDate(new Date().toISOString().split('T')[0])
                                  setReceiveNote('')
                                }}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                RECEBER
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 flex flex-col min-h-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg text-slate-800">Recebimentos Únicos</CardTitle>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total no Período (Únicas)
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(
                      paidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0),
                    )}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="pl-6">Data Pagamento</TableHead>
                      <TableHead>Dentista / Clínica</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          Nenhum recebimento único encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paidInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                          <TableCell className="pl-6 whitespace-nowrap font-medium text-slate-600">
                            {invoice.paid_at
                              ? new Date(invoice.paid_at).toLocaleDateString('pt-BR')
                              : new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-900">{invoice.dentistName}</p>
                            {invoice.clinic && (
                              <p className="text-xs text-muted-foreground">{invoice.clinic}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              Pago
                            </Badge>
                            {invoice.note && (
                              <p
                                className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]"
                                title={invoice.note}
                              >
                                {invoice.note}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium pr-6 text-slate-900">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="parcelamentos"
          className="flex-1 flex flex-col min-h-0 mt-0 gap-6 data-[state=inactive]:hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            <Card className="shadow-sm border-slate-200 flex flex-col min-h-0">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Parcelas Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="pl-6">Vencimento</TableHead>
                      <TableHead>Dentista / Clínica</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInstallments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Nenhuma parcela pendente encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingInstallments.map((inst) => (
                        <TableRow key={inst.id} className="hover:bg-slate-50/50">
                          <TableCell className="pl-6 whitespace-nowrap font-medium text-slate-600">
                            {inst.due_date
                              ? new Date(inst.due_date + 'T12:00:00Z').toLocaleDateString('pt-BR')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-900">{inst.dentistName}</p>
                            {inst.clinic && (
                              <p className="text-xs text-muted-foreground">{inst.clinic}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              {inst.note || `${inst.installment_number}/${inst.total_installments}`}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            {formatCurrency(inst.installment_value)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReceiveInstallment(inst)
                                  setReceiveInstallmentDate(new Date().toISOString().split('T')[0])
                                  setReceiveInstallmentMethod('')
                                }}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                RECEBER
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 flex flex-col min-h-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg text-slate-800">
                  Histórico de Parcelas Pagas
                </CardTitle>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Recebido (Mês)
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(
                      paidInstallments
                        .filter((i) => {
                          const [year, month] = (i.paid_at || i.created_at).split('T')[0].split('-')
                          return (
                            (parseInt(month, 10) - 1).toString() === selectedMonth &&
                            year === selectedYear
                          )
                        })
                        .reduce((sum, inv) => sum + Number(inv.installment_value || 0), 0),
                    )}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="pl-6">Data Pagamento</TableHead>
                      <TableHead>Dentista / Clínica</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead className="text-right pr-6">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidInstallments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          Nenhuma parcela recebida encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paidInstallments.map((inst) => (
                        <TableRow key={inst.id} className="hover:bg-slate-50/50">
                          <TableCell className="pl-6 whitespace-nowrap font-medium text-slate-600">
                            {inst.paid_at
                              ? new Date(inst.paid_at).toLocaleDateString('pt-BR')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-900">{inst.dentistName}</p>
                            {inst.clinic && (
                              <p className="text-xs text-muted-foreground">{inst.clinic}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              {inst.note || `${inst.installment_number}/${inst.total_installments}`}
                            </Badge>
                            {inst.payment_method && (
                              <p
                                className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]"
                                title={inst.payment_method}
                              >
                                {inst.payment_method}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium pr-6 text-slate-900">
                            {formatCurrency(inst.installment_value)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* MANUAL INVOICE MODAL */}
      <Dialog
        open={!!manualInvoiceDentist}
        onOpenChange={(open) => !open && setManualInvoiceDentist(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Fechar Fatura Manual</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-600 font-medium">
                  Pedidos concluídos e pendentes de faturamento:
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedOrderIds.length === modalOrders.length && modalOrders.length > 0
                    }
                    onCheckedChange={(c) => handleToggleAllOrders(!!c)}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-semibold cursor-pointer select-none"
                  >
                    Marcar Todos
                  </label>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-12 text-center"></TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Data de Entrada</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modalOrders.map((o: any) => (
                      <TableRow key={o.id}>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedOrderIds.includes(o.id)}
                            onCheckedChange={(c) => handleToggleOrder(o.id, !!c)}
                          />
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {o.friendlyId || o.id.substring(0, 8)}
                          {o.patientName && (
                            <span className="text-muted-foreground font-normal ml-2">
                              - {o.patientName}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(o.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(o.basePrice || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {modalOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhum pedido pendente para este dentista.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t space-y-4">
              <h4 className="font-semibold text-slate-800">Forma de Pagamento</h4>
              <div className="flex gap-2">
                <Button
                  variant={paymentType === 'single' ? 'default' : 'outline'}
                  onClick={() => setPaymentType('single')}
                  className="flex-1 shadow-sm"
                >
                  Pagamento Único (À Vista)
                </Button>
                <Button
                  variant={paymentType === 'installment' ? 'default' : 'outline'}
                  onClick={() => setPaymentType('installment')}
                  className="flex-1 shadow-sm"
                >
                  Parcelado
                </Button>
              </div>

              {paymentType === 'installment' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Entrada (R$)
                    </label>
                    <input
                      type="number"
                      value={upfrontAmount}
                      onChange={(e) => setUpfrontAmount(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nº de Parcelas
                    </label>
                    <input
                      type="number"
                      value={installmentsCount}
                      onChange={(e) => setInstallmentsCount(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      min="1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Intervalo (Dias)
                    </label>
                    <input
                      type="number"
                      value={intervalDays}
                      onChange={(e) => setIntervalDays(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      min="1"
                    />
                  </div>
                </div>
              )}

              {paymentType === 'installment' && installmentPreview && (
                <div className="mt-2 p-3 bg-blue-50/50 border border-blue-100 rounded-md text-sm text-blue-900 shadow-inner">
                  <p className="font-semibold mb-1">Resumo do Parcelamento:</p>
                  <ul className="list-disc list-inside opacity-90">
                    {installmentPreview.upfront > 0 && (
                      <li>Entrada: {formatCurrency(installmentPreview.upfront)}</li>
                    )}
                    <li>
                      {installmentPreview.count}x de {formatCurrency(installmentPreview.instValue)}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-100 border-t flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total Selecionado
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(selectedTotalAmount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={() => setPreviewOpen(true)}
                disabled={selectedOrderIds.length === 0}
                className="gap-2 bg-slate-700 hover:bg-slate-800 text-white"
              >
                PRÉVIA DA FATURA
              </Button>
              <Button variant="ghost" onClick={() => setManualInvoiceDentist(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmInvoice}
                disabled={selectedOrderIds.length === 0 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar Fechamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* INVOICE PREVIEW / PDF MODAL */}
      {manualInvoiceDentist && (
        <InvoicePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          dentistName={profiles.find((p) => p.id === manualInvoiceDentist)?.name || ''}
          clinicName={profiles.find((p) => p.id === manualInvoiceDentist)?.clinic || ''}
          orders={modalOrders.filter((o: any) => selectedOrderIds.includes(o.id))}
          totalAmount={selectedTotalAmount}
        />
      )}

      {/* RECEIVE SETTLEMENT MODAL (SINGLE) */}
      <Dialog
        open={!!receiveSettlement}
        onOpenChange={(open) => !open && setReceiveSettlement(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Confirmar Recebimento de Fatura Única</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800">
                  Pedidos Inclusos ({receiveSettlement?.orders_snapshot?.length || 0})
                </h4>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Dentista / Clínica</p>
                  <p className="font-bold text-slate-900">{receiveSettlement?.dentistName}</p>
                </div>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Trabalho</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiveSettlement?.orders_snapshot?.map((o: any, idx: number) => (
                      <TableRow key={o.id || idx}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {o.friendlyId || o.id?.substring(0, 8) || '-'}
                        </TableCell>
                        <TableCell>{o.patientName || '-'}</TableCell>
                        <TableCell>{o.workType || '-'}</TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatCurrency(o.clearedAmount || o.basePrice || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!receiveSettlement?.orders_snapshot ||
                      receiveSettlement.orders_snapshot.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Nenhum pedido encontrado no snapshot.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Detalhes / Observações
                </label>
                <input
                  type="text"
                  placeholder="Ex: PIX, Transferência, Dinheiro..."
                  value={receiveNote}
                  onChange={(e) => setReceiveNote(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Valor Total a Receber
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatCurrency(receiveSettlement?.amount || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setReceiveSettlement(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmReceive}
                disabled={isReceiving || !receiveDate}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isReceiving && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar Recebimento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIPELINE DETAILS MODAL */}
      <Dialog open={!!pipelineDentist} onOpenChange={(open) => !open && setPipelineDentist(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              Trabalhos em Pipeline - {profiles.find((p) => p.id === pipelineDentist)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6">
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Trabalho</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Valor Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData
                    .find((d) => d.id === pipelineDentist)
                    ?.pipelineOrders.map((o: any) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {o.friendlyId || o.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{o.patientName || '-'}</TableCell>
                        <TableCell>{o.workType || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            {o.kanbanStage || 'Em Produção'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(o.basePrice || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {(!tableData.find((d) => d.id === pipelineDentist)?.pipelineOrders ||
                    tableData.find((d) => d.id === pipelineDentist)?.pipelineOrders.length ===
                      0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido em pipeline para este dentista.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total em Produção
              </span>
              <span className="text-2xl font-bold text-amber-600">
                {formatCurrency(tableData.find((d) => d.id === pipelineDentist)?.emProducao || 0)}
              </span>
            </div>
            <Button variant="outline" onClick={() => setPipelineDentist(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RECEIVE INSTALLMENT MODAL */}
      <Dialog
        open={!!receiveInstallment}
        onOpenChange={(open) => !open && setReceiveInstallment(null)}
      >
        <DialogContent className="max-w-md flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Confirmar Recebimento - {receiveInstallment?.note}</DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
              <span className="text-sm font-semibold text-slate-600">Valor da Parcela</span>
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(receiveInstallment?.installment_value || 0)}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Data de Pagamento</label>
              <input
                type="date"
                value={receiveInstallmentDate}
                onChange={(e) => setReceiveInstallmentDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Método de Pagamento / Obs</label>
              <input
                type="text"
                value={receiveInstallmentMethod}
                onChange={(e) => setReceiveInstallmentMethod(e.target.value)}
                placeholder="Ex: PIX, Transferência..."
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2 shrink-0">
            <Button variant="ghost" onClick={() => setReceiveInstallment(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReceiveInstallment}
              disabled={isReceivingInstallment || !receiveInstallmentDate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isReceivingInstallment && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirmar Recebimento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
