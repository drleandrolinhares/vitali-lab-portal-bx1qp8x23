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
import { ManualEntryForm } from './ManualEntryForm'
import { CheckCircle2, ChevronDown, ChevronUp, PlusCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

  const grouped = useMemo(() => {
    const groups: Record<string, any> = {}

    installments.forEach((inst) => {
      const dateKey = inst.due_date || 'sem-data'
      const dentistId = inst.dentist_id
      const key = `${dentistId}_${dateKey}`

      if (!groups[key]) {
        groups[key] = {
          key,
          dentist_id: dentistId,
          dentist_name: inst.dentist?.name || 'Desconhecido',
          due_date: dateKey,
          total_value: 0,
          items: [],
          all_paid: true,
        }
      }

      groups[key].items.push(inst)
      groups[key].total_value += Number(inst.installment_value) || 0
      if (inst.status !== 'paid') {
        groups[key].all_paid = false
      }
    })

    return Object.values(groups).sort((a: any, b: any) => {
      if (a.all_paid !== b.all_paid) return a.all_paid ? 1 : -1
      return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    })
  }, [installments])

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleReceiveGroup = async (group: any) => {
    setProcessing(group.key)
    try {
      const idsToUpdate = group.items.filter((i: any) => i.status !== 'paid').map((i: any) => i.id)

      if (idsToUpdate.length > 0) {
        const { error } = await supabase
          .from('billing_installments')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .in('id', idsToUpdate)

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Gestão de Parcelamentos</h3>
          <p className="text-sm text-muted-foreground">
            Contas a receber e lançamentos avulsos agrupados por vencimento.
          </p>
        </div>
        {!readOnly && (
          <Dialog open={openDialog} onOpenChange={setDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Lançamento Avulso
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

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Dentista / Cliente</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor Consolidado</TableHead>
                {!readOnly && <TableHead className="text-right pr-6">Ação</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {grouped.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={readOnly ? 5 : 6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Nenhuma conta a receber encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                grouped.map((g: any) => (
                  <React.Fragment key={g.key}>
                    <TableRow
                      className={`hover:bg-muted/30 ${g.all_paid ? 'opacity-60 bg-muted/10' : ''}`}
                    >
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
                      <TableCell>
                        {g.due_date !== 'sem-data'
                          ? format(parseISO(g.due_date), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {g.all_paid ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Recebido
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
                      {!readOnly && (
                        <TableCell className="text-right pr-6">
                          {!g.all_paid && (
                            <Button
                              size="sm"
                              onClick={() => handleReceiveGroup(g)}
                              disabled={processing === g.key}
                            >
                              {processing === g.key ? 'Processando...' : 'RECEBER'}
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>

                    {expandedGroups[g.key] && (
                      <TableRow className="bg-muted/5">
                        <TableCell colSpan={readOnly ? 5 : 6} className="p-0 border-b-0">
                          <div className="pl-14 pr-6 py-4">
                            <Table className="bg-background rounded-md border text-sm">
                              <TableHeader className="bg-muted/30">
                                <TableRow>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead>Nº Parcela</TableHead>
                                  <TableHead>Status</TableHead>
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
                                      {item.status === 'paid' ? (
                                        <span className="text-emerald-600 text-xs font-medium">
                                          Pago
                                        </span>
                                      ) : (
                                        <span className="text-amber-600 text-xs font-medium">
                                          Pendente
                                        </span>
                                      )}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
