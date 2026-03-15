import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  getOrderFinancials,
  formatBRL,
  generateMonthOptions,
  filterOrdersForFinancials,
} from '@/lib/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  TrendingUp,
  Wallet,
  CheckCircle,
  Activity,
  CalendarDays,
  Send,
  Download,
  Eye,
  Clock,
  Users,
  Printer,
  PauseCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { InvoicePreviewDialog } from '@/components/financial/InvoicePreviewDialog'

export default function AdminFinancial() {
  const {
    currentUser,
    orders,
    refreshOrders,
    selectedLab,
    priceList,
    kanbanStages,
    checkPermission,
    appSettings,
  } = useAppStore()

  const [dentists, setDentists] = useState<any[]>([])
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])
  const [settleDialog, setSettleDialog] = useState<any>(null)
  const [detailsDialog, setDetailsDialog] = useState<any>(null)
  const [previewInvoiceData, setPreviewInvoiceData] = useState<any>(null)

  const [selectedDentist, setSelectedDentist] = useState<string>('all')

  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  useEffect(() => {
    // Fetch all profiles for historical matching (Faturas Fechadas)
    supabase
      .from('profiles')
      .select('id, name, clinic')
      .then(({ data }) => {
        if (data) setAllProfiles(data)
      })

    // Strict fetch for the active dentists list and filter
    supabase
      .from('profiles')
      .select('id, name, clinic, is_billing_paused, is_active, is_approved, cpf')
      .eq('role', 'dentist')
      .eq('is_active', true)
      .eq('is_approved', true)
      .then(({ data }) => {
        if (data) {
          // Deduplicate by ID to prevent any visual duplicates
          const uniqueDentists = Array.from(new Map(data.map((item) => [item.id, item])).values())
          setDentists(uniqueDentists.sort((a, b) => a.name.localeCompare(b.name)))
        }
      })
  }, [currentUser])

  useEffect(() => {
    supabase
      .from('settlements')
      .select('*')
      .then(({ data }) => {
        if (data) setSettlements(data)
      })
  }, [selectedMonth]) // Refresh when month changes or action taken

  const filteredOrders = useMemo(() => {
    return filterOrdersForFinancials(orders, selectedMonth).filter((o) => {
      if (selectedLab === 'Todos') return true
      return (o.sector || '').trim().toUpperCase() === selectedLab.trim().toUpperCase()
    })
  }, [orders, selectedLab, selectedMonth])

  const producaoData = useMemo(() => {
    if (!dentists.length) return []

    return dentists
      .filter((d) => (currentUser?.role === 'dentist' ? d.id === currentUser.id : true))
      .filter((d) => selectedDentist === 'all' || d.id === selectedDentist)
      .map((d) => {
        const dOrders = filteredOrders.filter((o) => o.dentistId === d.id)
        const aFaturarOrders: any[] = []
        const pipelineOrders: any[] = []
        let aFaturarTotal = 0
        let pipelineTotal = 0

        dOrders.forEach((o) => {
          const fin = getOrderFinancials(o, priceList, kanbanStages)
          if ((o.status === 'completed' || o.status === 'delivered') && fin.outstandingCost > 0) {
            aFaturarOrders.push(fin)
            aFaturarTotal += fin.outstandingCost
          } else if (o.status === 'pending' || o.status === 'in_production') {
            pipelineOrders.push(fin)
            pipelineTotal += fin.pipelineCost
          }
        })

        return {
          dentist: d,
          aFaturarOrders,
          pipelineOrders,
          aFaturarTotal,
          pipelineTotal,
        }
      })
      .filter((d) => d.aFaturarTotal > 0 || d.pipelineTotal > 0 || d.dentist.is_billing_paused)
      .sort((a, b) => b.aFaturarTotal - a.aFaturarTotal)
  }, [dentists, filteredOrders, selectedDentist, priceList, kanbanStages, currentUser])

  const faturasFechadasData = useMemo(() => {
    return settlements
      .filter((s) => {
        if (selectedDentist !== 'all' && s.dentist_id !== selectedDentist) return false
        const sMonth = format(new Date(s.created_at), 'yyyy-MM')
        if (sMonth !== selectedMonth) return false
        return true
      })
      .map((s) => {
        const dentist =
          dentists.find((d) => d.id === s.dentist_id) ||
          allProfiles.find((d) => d.id === s.dentist_id)
        return { ...s, dentist }
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [settlements, selectedMonth, selectedDentist, dentists, allProfiles])

  const topCardsData = useMemo(() => {
    const faturadoNoMes = faturasFechadasData.reduce((acc, s) => acc + Number(s.amount), 0)
    const aFaturar = producaoData.reduce((acc, d) => acc + d.aFaturarTotal, 0)
    const emProducao = producaoData.reduce((acc, d) => acc + d.pipelineTotal, 0)
    return { faturadoNoMes, aFaturar, emProducao }
  }, [producaoData, faturasFechadasData])

  const canView =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'master' ||
    currentUser?.role === 'receptionist' ||
    currentUser?.role === 'financial' ||
    checkPermission('finances')

  if (currentUser && !canView && currentUser.role !== 'dentist') return <Navigate to="/" replace />
  if (currentUser && currentUser.role === 'dentist') return <Navigate to="/financial" replace />

  const handleTogglePauseBilling = async (dentistId: string, paused: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_billing_paused: paused })
      .eq('id', dentistId)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      })
    } else {
      toast({ title: paused ? 'Faturamento Pausado' : 'Faturamento Retomado' })
      setDentists((prev) =>
        prev.map((d) => (d.id === dentistId ? { ...d, is_billing_paused: paused } : d)),
      )
    }
  }

  const handleSettle = async () => {
    if (!settleDialog) return
    const { dentist, aFaturarOrders, aFaturarTotal } = settleDialog

    if (aFaturarTotal <= 0) {
      toast({ title: 'Nenhum valor pendente para liquidar' })
      setSettleDialog(null)
      return
    }

    const snapshot = aFaturarOrders.map((o: any) => ({
      orderId: o.id,
      friendlyId: o.friendlyId,
      patientName: o.patientName,
      workType: o.workType,
      clearedAmount: o.outstandingCost,
    }))

    const { error } = await supabase.from('settlements').insert({
      dentist_id: dentist.id,
      amount: aFaturarTotal,
      orders_snapshot: snapshot,
    })

    if (error) {
      return toast({
        title: 'Erro',
        description: 'Não foi possível emitir a fatura.',
        variant: 'destructive',
      })
    }

    const updates = aFaturarOrders.map((o: any) =>
      supabase.from('orders').update({ cleared_balance: o.completedCost }).eq('id', o.id),
    )
    await Promise.all(updates)

    toast({ title: 'Fatura Emitida e Liquidada com Sucesso!' })
    setSettleDialog(null)
    refreshOrders()

    // Refresh settlements immediately to show in the closed tab
    supabase
      .from('settlements')
      .select('*')
      .then(({ data }) => {
        if (data) setSettlements(data)
      })
  }

  const handlePrintInvoice = (settlement: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const {
      lab_razao_social = 'Vitali Lab',
      lab_cnpj = '',
      lab_address = '',
      lab_phone = '',
      lab_email = '',
      lab_logo_url = '',
    } = appSettings

    const dentist = settlement.dentist || {}
    const snapshot = settlement.orders_snapshot || []

    const html = `
      <html>
        <head>
          <title>Fatura - ${dentist.name || 'Cliente'}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 150px; max-height: 80px; object-fit: contain; }
            .lab-info { text-align: right; font-size: 12px; color: #6b7280; }
            .lab-info h1 { margin: 0 0 5px 0; color: #111827; font-size: 18px; text-transform: uppercase; }
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
            .client-info { margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f9fafb; font-weight: 600; text-transform: uppercase; font-size: 11px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row { font-size: 16px; font-weight: bold; background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              ${lab_logo_url ? `<img src="${lab_logo_url}" class="logo" alt="Logo" />` : `<h2>${lab_razao_social || 'VITALI LAB'}</h2>`}
            </div>
            <div class="lab-info">
              <h1>${lab_razao_social || 'VITALI LAB'}</h1>
              ${lab_cnpj ? `<p>CNPJ: ${lab_cnpj}</p>` : ''}
              ${lab_address ? `<p>${lab_address}</p>` : ''}
              ${lab_phone ? `<p>Tel: ${lab_phone}</p>` : ''}
              ${lab_email ? `<p>Email: ${lab_email}</p>` : ''}
            </div>
          </div>
          
          <div class="invoice-title">Recibo de Faturamento</div>
          <p style="color: #6b7280; margin-bottom: 20px;">Data de Emissão: ${format(new Date(settlement.created_at), 'dd/MM/yyyy HH:mm')}</p>
          
          <div class="client-info">
            <strong>Cliente:</strong> ${dentist.name || 'Desconhecido'}<br/>
            ${dentist.clinic ? `<strong>Clínica:</strong> ${dentist.clinic}<br/>` : ''}
          </div>

          <table>
             <thead>
               <tr>
                 <th>Pedido</th>
                 <th>Paciente</th>
                 <th>Trabalho</th>
                 <th class="text-right">Valor</th>
               </tr>
             </thead>
             <tbody>
               ${snapshot.length === 0 ? '<tr><td colspan="4" class="text-center">Nenhum pedido listado</td></tr>' : ''}
               ${snapshot.map((o: any) => `<tr><td>${o.friendlyId || '-'}</td><td>${o.patientName || '-'}</td><td>${o.workType || '-'}</td><td class="text-right">${formatBRL(o.clearedAmount || 0)}</td></tr>`).join('')}
             </tbody>
             <tfoot>
               <tr class="total-row">
                 <td colspan="3" class="text-right">Total Recebido</td>
                 <td class="text-right">${formatBRL(settlement.amount)}</td>
               </tr>
             </tfoot>
          </table>

          <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #9ca3af;">
            <p>Documento gerado eletronicamente pelo Sistema Vitali Lab.</p>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleExportMonthCSV = () => {
    if (faturasFechadasData.length === 0) {
      toast({ title: 'Nenhuma fatura para exportar no período.' })
      return
    }

    const headers = ['Data Emissao', 'Dentista', 'Clinica', 'Valor Total', 'Pedidos']
    const rows = faturasFechadasData.map((s) => {
      const pedidosStr = (s.orders_snapshot || [])
        .map((o: any) => `${o.friendlyId} (${o.patientName})`)
        .join('; ')
      return [
        format(new Date(s.created_at), 'dd/MM/yyyy HH:mm'),
        s.dentist?.name || 'Desconhecido',
        s.dentist?.clinic || '-',
        s.amount,
        pedidosStr,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Faturas_${selectedMonth}.csv`
    link.click()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
              Contas a Receber
            </h2>
            <p className="text-muted-foreground text-sm">
              Gerencie a produção a faturar e o histórico de recebimentos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm flex-1 sm:flex-initial">
            <Users className="w-4 h-4 text-muted-foreground ml-2" />
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="w-full sm:w-[280px] border-0 bg-transparent shadow-none focus:ring-0 uppercase text-xs font-bold">
                <SelectValue placeholder="Todos os Dentistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="uppercase text-xs font-bold">
                  Todos os Dentistas
                </SelectItem>
                {dentists.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="uppercase text-xs font-bold">
                    {d.name} {d.clinic ? `(${d.clinic})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm flex-1 sm:flex-initial">
            <CalendarDays className="w-4 h-4 text-muted-foreground ml-2" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[150px] border-0 bg-transparent shadow-none focus:ring-0 uppercase text-xs font-bold">
                <SelectValue placeholder="Selecione o Mês" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="uppercase text-xs font-bold"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Faturado no Mês (Fechadas)
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatBRL(topCardsData.faturadoNoMes)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              A Faturar (Finalizados)
            </CardTitle>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatBRL(topCardsData.aFaturar)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Em Produção (Estimativa)
            </CardTitle>
            <Activity className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatBRL(topCardsData.emProducao)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="producao" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="producao">PRODUÇÃO EM R$</TabsTrigger>
          <TabsTrigger value="faturas">FATURAS FECHADAS</TabsTrigger>
        </TabsList>

        <TabsContent value="producao" className="mt-0">
          <Card className="shadow-subtle">
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-lg">Trabalhos em Andamento e Finalizados</CardTitle>
              <p className="text-sm text-muted-foreground">
                Lista de clientes com saldo pendente de faturamento ou trabalhos no fluxo.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-12">Dentista / Clínica</TableHead>
                      <TableHead className="text-right">Em Produção (Pipeline)</TableHead>
                      <TableHead className="text-right">A Faturar (Finalizados)</TableHead>
                      <TableHead className="text-center">Status Faturamento</TableHead>
                      <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {producaoData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Nenhuma produção pendente para os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      producaoData.map((item) => (
                        <TableRow key={item.dentist.id} className="hover:bg-muted/30">
                          <TableCell className="pl-6">
                            <div className="font-bold text-foreground">{item.dentist.name}</div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {item.dentist.clinic || 'Sem clínica'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-amber-600">
                            {formatBRL(item.pipelineTotal)}
                          </TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">
                            {formatBRL(item.aFaturarTotal)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Switch
                                checked={item.dentist.is_billing_paused}
                                onCheckedChange={(v) =>
                                  handleTogglePauseBilling(item.dentist.id, v)
                                }
                              />
                              <span
                                className={cn(
                                  'text-xs font-semibold uppercase tracking-wider',
                                  item.dentist.is_billing_paused
                                    ? 'text-amber-600'
                                    : 'text-emerald-600',
                                )}
                              >
                                {item.dentist.is_billing_paused ? 'Pausado' : 'Ativo'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6 space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => setDetailsDialog(item)}
                              title="Ver Detalhes dos Pedidos"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold uppercase text-[10px]"
                              disabled={item.aFaturarTotal <= 0}
                              onClick={() => setSettleDialog(item)}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Emitir Fatura
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturas" className="mt-0">
          <Card className="shadow-subtle">
            <CardHeader className="pb-2 pt-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Histórico de Faturas Emitidas</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Liquidações registradas no mês selecionado.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportMonthCSV}>
                <Download className="w-4 h-4 mr-2" /> CSV Mensal
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-12">Data de Emissão</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Valor Faturado</TableHead>
                      <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faturasFechadasData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          Nenhuma fatura emitida no período selecionado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      faturasFechadasData.map((s) => (
                        <TableRow key={s.id} className="hover:bg-muted/30">
                          <TableCell className="pl-6 font-medium text-slate-600">
                            {format(new Date(s.created_at), "dd/MM/yyyy 'às' HH:mm")}
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-foreground">
                              {s.dentist?.name || 'Desconhecido'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.dentist?.clinic || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-emerald-600 text-base">
                            {formatBRL(s.amount)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => handlePrintInvoice(s)}
                            >
                              <Printer className="w-4 h-4 mr-2" /> Recibo PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={!!detailsDialog} onOpenChange={(o) => !o && setDetailsDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
            <DialogTitle>Detalhes da Produção: {detailsDialog?.dentist?.name}</DialogTitle>
            {detailsDialog?.aFaturarTotal > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold shadow-sm"
                onClick={() => setPreviewInvoiceData({ ...detailsDialog, appSettings })}
              >
                <FileText className="w-4 h-4 mr-2" /> Visualizar Fatura do Dentista
              </Button>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-emerald-600 uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> A Faturar (Finalizados)
              </h4>
              <div className="border rounded-md shadow-sm">
                <Table>
                  <TableHeader className="bg-emerald-50/50">
                    <TableRow>
                      <TableHead className="h-10 py-2 pl-4">Pedido</TableHead>
                      <TableHead className="h-10 py-2">Trabalho</TableHead>
                      <TableHead className="h-10 py-2 text-center">Qtd.</TableHead>
                      <TableHead className="h-10 py-2 text-right">Unitário</TableHead>
                      <TableHead className="h-10 py-2 text-right pr-4">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.aFaturarOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          Nenhum trabalho a faturar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      detailsDialog?.aFaturarOrders.map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="py-2.5 font-medium pl-4">
                            {o.friendlyId}
                            <div className="text-xs text-muted-foreground font-normal">
                              {o.patientName}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground">
                            {o.workType}
                          </TableCell>
                          <TableCell className="py-2.5 text-center text-muted-foreground">
                            {o.quantity}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-muted-foreground">
                            {formatBRL(o.effectiveUnitPrice || 0)}
                          </TableCell>
                          <TableCell className="py-2.5 text-right font-semibold pr-4">
                            {formatBRL(o.outstandingCost)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right mt-2 pr-4 font-bold text-emerald-600 text-lg">
                Total a Faturar: {formatBRL(detailsDialog?.aFaturarTotal || 0)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-600 uppercase tracking-wider">
                <Activity className="w-4 h-4" /> Em Produção (Estimativa Pipeline)
              </h4>
              <div className="border rounded-md shadow-sm">
                <Table>
                  <TableHeader className="bg-amber-50/50">
                    <TableRow>
                      <TableHead className="h-10 py-2 pl-4">Pedido</TableHead>
                      <TableHead className="h-10 py-2">Trabalho</TableHead>
                      <TableHead className="h-10 py-2">Status (Laboratório)</TableHead>
                      <TableHead className="h-10 py-2 text-right pr-4">Estimativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.pipelineOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          Nenhum trabalho em produção.
                        </TableCell>
                      </TableRow>
                    ) : (
                      detailsDialog?.pipelineOrders.map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="py-2.5 font-medium pl-4">
                            {o.friendlyId}
                            <div className="text-xs text-muted-foreground font-normal">
                              {o.patientName}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground">
                            {o.workType}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <Badge variant="secondary" className="text-[10px]">
                              {o.kanbanStage}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 text-right font-semibold text-amber-600 pr-4">
                            {formatBRL(o.pipelineCost)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right mt-2 pr-4 font-bold text-amber-600 text-lg">
                Total Estimado Pipeline: {formatBRL(detailsDialog?.pipelineTotal || 0)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      {previewInvoiceData && (
        <InvoicePreviewDialog
          open={!!previewInvoiceData}
          onOpenChange={(open: boolean) => !open && setPreviewInvoiceData(null)}
          data={previewInvoiceData}
        />
      )}

      {/* Settlement Dialog */}
      <Dialog open={!!settleDialog} onOpenChange={(o) => !o && setSettleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emitir Fatura</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Você está prestes a emitir a fatura dos trabalhos finalizados para o cliente{' '}
              <strong>{settleDialog?.dentist?.name}</strong>.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <span className="font-semibold text-emerald-800">Valor Total da Fatura:</span>
              <span className="text-2xl font-black text-emerald-700">
                {formatBRL(settleDialog?.aFaturarTotal || 0)}
              </span>
            </div>
            <p className="text-xs font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              Atenção: Ao confirmar, o saldo destes pedidos será zerado e um recibo de liquidação
              será gerado no histórico (Faturas Fechadas).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleDialog(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSettle}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Emissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
