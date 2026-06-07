import React, { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatBRL } from '@/lib/financial'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ManualEntryForm } from './ManualEntryForm'
import { CheckCircle2, ChevronDown, ChevronUp, PlusCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'

export function ReceivablesManager({
  installments,
  onRefresh,
  readOnly,
}: {
  installments: any[]
  onRefresh: () => void
  readOnly?: boolean
}) {
  const [openDialog, setDialog] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const [processing, setProcessing] = useState<string | null>(null)
  const { selectedLab } = useAppStore()

  const filteredInstallments = useMemo(() => {
    if (!installments) return []
    if (!selectedLab || selectedLab === 'TODOS') return installments
    return installments.filter((i) => {
      const sector = (i.sector || 'SOLUÇÕES CERÂMICAS').toUpperCase()
      return (
        sector.replace('STUDIO', 'STÚDIO') === selectedLab.toUpperCase().replace('STUDIO', 'STÚDIO')
      )
    })
  }, [installments, selectedLab])

  const parseDate = (d: string) =>
    d && d !== 'sem-data' ? format(parseISO(d), 'dd/MM/yyyy', { locale: ptBR }) : '-'

  const groupInstallments = (items: any[], isPaid: boolean) => {
    const groups: Record<string, any> = {}
    items.forEach((inst) => {
      const dKey = isPaid
        ? inst.paid_at?.split('T')[0] || inst.due_date || 'sem-data'
        : inst.due_date || 'sem-data'
      const key = `${isPaid ? 'paid' : 'pend'}_${inst.dentist_id}_${dKey}`
      if (!groups[key])
        groups[key] = {
          key,
          dentist_name: inst.dentist?.name || 'Desconhecido',
          date_key: dKey,
          total_value: 0,
          items: [],
        }
      groups[key].items.push(inst)
      groups[key].total_value += Number(inst.installment_value) || 0
    })
    return Object.values(groups).sort((a: any, b: any) => {
      if (a.date_key === 'sem-data') return 1
      if (b.date_key === 'sem-data') return -1
      return new Date(b.date_key).getTime() - new Date(a.date_key).getTime()
    })
  }

  const pendingGroups = useMemo(
    () =>
      groupInstallments(
        filteredInstallments.filter((i) => i.status !== 'paid'),
        false,
      ),
    [filteredInstallments],
  )
  const paidGroups = useMemo(
    () =>
      groupInstallments(
        filteredInstallments.filter((i) => i.status === 'paid'),
        true,
      ),
    [filteredInstallments],
  )
  const totalRecebidoMes = useMemo(
    () => paidGroups.reduce((acc, g) => acc + g.total_value, 0),
    [paidGroups],
  )

  const toggleGroup = (key: string) => setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleReceiveGroup = async (group: any) => {
    setProcessing(group.key)
    try {
      const ids = group.items.filter((i: any) => i.status !== 'paid').map((i: any) => i.id)
      if (ids.length > 0) {
        const { error } = await supabase
          .from('billing_installments')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .in('id', ids)
        if (error) throw error
        toast({ title: 'Baixa realizada com sucesso!' })
        onRefresh()
      }
    } catch (err: any) {
      toast({ title: 'Erro ao processar', description: err.message, variant: 'destructive' })
    } finally {
      setProcessing(null)
    }
  }

  const renderTable = (groups: any[], isPaid: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Dentista / Cliente</TableHead>
          <TableHead>{isPaid ? 'Data Recebimento' : 'Vencimento'}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Valor Total</TableHead>
          {!readOnly && !isPaid && <TableHead className="text-right pr-6">Ação</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhum registro encontrado.
            </TableCell>
          </TableRow>
        )}
        {groups.map((g: any) => (
          <React.Fragment key={g.key}>
            <TableRow className={`hover:bg-muted/30 ${isPaid ? 'bg-muted/10' : ''}`}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleGroup(g.key)}
                >
                  {expandedGroups[g.key] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-semibold">{g.dentist_name}</TableCell>
              <TableCell>{parseDate(g.date_key)}</TableCell>
              <TableCell>
                {isPaid ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Pago
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-600 border-amber-200 gap-1"
                  >
                    <AlertCircle className="w-3 h-3" /> Pendente
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-bold text-primary">
                {formatBRL(g.total_value)}
              </TableCell>
              {!readOnly && !isPaid && (
                <TableCell className="text-right pr-6">
                  <Button
                    size="sm"
                    onClick={() => handleReceiveGroup(g)}
                    disabled={processing === g.key}
                  >
                    {processing === g.key ? '...' : 'RECEBER'}
                  </Button>
                </TableCell>
              )}
            </TableRow>
            {expandedGroups[g.key] && (
              <TableRow className="bg-muted/5">
                <TableCell colSpan={6} className="p-0 border-b-0">
                  <div className="pl-14 pr-6 py-4">
                    <Table className="bg-background rounded-md border text-sm">
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Parcela</TableHead>
                          <TableHead>{isPaid ? 'Pagamento' : 'Vencimento'}</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {g.items.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-muted-foreground">
                              {item.note || 'Lançamento'}
                            </TableCell>
                            <TableCell>
                              {item.installment_number
                                ? `${item.installment_number}/${item.total_installments}`
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {parseDate(isPaid ? item.paid_at || item.due_date : item.due_date)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatBRL(item.installment_value)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Gestão de Parcelamentos</h3>
          <p className="text-sm text-muted-foreground">
            Contas a receber e lançamentos avulsos agrupados.
          </p>
        </div>
        {!readOnly && (
          <Dialog open={openDialog} onOpenChange={setDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" /> Lançamento Avulso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Lançamento (Acerto de Sócio)</DialogTitle>
              </DialogHeader>
              <ManualEntryForm
                onSuccess={() => {
                  setDialog(false)
                  onRefresh()
                }}
                onCancel={() => setDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Parcelas Pendentes</TabsTrigger>
          <TabsTrigger value="pagas">Histórico de Parcelas Pagas</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-0">
          <Card className="shadow-subtle">
            <CardContent className="p-0">{renderTable(pendingGroups, false)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagas" className="mt-0 space-y-4">
          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-md border">
            <span className="font-semibold text-muted-foreground">TOTAL RECEBIDO (MÊS)</span>
            <span className="text-xl font-bold text-emerald-600">
              {formatBRL(totalRecebidoMes)}
            </span>
          </div>
          <Card className="shadow-subtle">
            <CardContent className="p-0">{renderTable(paidGroups, true)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
