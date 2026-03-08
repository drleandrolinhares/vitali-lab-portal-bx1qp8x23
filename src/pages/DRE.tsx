import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBRL, getOrderFinancials } from '@/lib/financial'
import { useAppStore } from '@/stores/main'
import { FileDown, BarChart3, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseISO, getMonth, getYear } from 'date-fns'
import { Navigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function DREPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [basis, setBasis] = useState<'cash' | 'accrual'>('accrual')
  const { orders, kanbanStages, priceList, currentUser } = useAppStore()

  const [settlements, setSettlements] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const currentY = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentY - i).toString())
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase
        .from('settlements')
        .select('*')
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31T23:59:59`),
      supabase
        .from('expenses')
        .select('*')
        .gte('due_date', `${year}-01-01`)
        .lte('due_date', `${year}-12-31`),
    ]).then(([settlementsRes, expensesRes]) => {
      if (settlementsRes.data) setSettlements(settlementsRes.data)
      if (expensesRes.data) setExpenses(expensesRes.data)
      setLoading(false)
    })
  }, [year])

  const report = useMemo(() => {
    const data = months.map(() => ({
      revenue: 0,
      labMaterial: 0,
      personnel: 0,
      administrative: 0,
      taxes: 0,
      other: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      netResult: 0,
    }))

    if (basis === 'cash') {
      settlements.forEach((s) => {
        const m = getMonth(parseISO(s.created_at))
        data[m].revenue += Number(s.amount)
      })
    } else {
      orders.forEach((o) => {
        const isCompleted = o.status === 'completed' || o.status === 'delivered'
        if (isCompleted) {
          const completionHist = o.history.find(
            (h: any) => h.status === 'completed' || h.status === 'delivered',
          )
          const dateStr = completionHist ? completionHist.date : o.createdAt
          const m = getMonth(parseISO(dateStr))
          const y = getYear(parseISO(dateStr))
          if (y.toString() === year) {
            const fin = getOrderFinancials(o, priceList, kanbanStages)
            data[m].revenue += fin.totalCost
          }
        }
      })
    }

    expenses.forEach((e) => {
      if (basis === 'cash' && e.status !== 'paid') return
      const m = getMonth(parseISO(e.due_date))
      const val = Number(e.amount)
      switch (e.dre_category) {
        case 'Material de Laboratório':
          data[m].labMaterial += val
          break
        case 'Pessoal':
          data[m].personnel += val
          break
        case 'Despesa Administrativa':
          data[m].administrative += val
          break
        case 'Impostos':
          data[m].taxes += val
          break
        default:
          data[m].other += val
          break
      }
    })

    return data.map((d) => {
      const grossProfit = d.revenue - d.labMaterial
      const operatingExpenses = d.personnel + d.administrative + d.taxes + d.other
      const netResult = grossProfit - operatingExpenses
      return { ...d, grossProfit, operatingExpenses, netResult }
    })
  }, [basis, year, settlements, expenses, orders, priceList, kanbanStages])

  const totals = report.reduce(
    (acc, curr) => ({
      revenue: acc.revenue + curr.revenue,
      labMaterial: acc.labMaterial + curr.labMaterial,
      grossProfit: acc.grossProfit + curr.grossProfit,
      personnel: acc.personnel + curr.personnel,
      administrative: acc.administrative + curr.administrative,
      taxes: acc.taxes + curr.taxes,
      other: acc.other + curr.other,
      operatingExpenses: acc.operatingExpenses + curr.operatingExpenses,
      netResult: acc.netResult + curr.netResult,
    }),
    {
      revenue: 0,
      labMaterial: 0,
      grossProfit: 0,
      personnel: 0,
      administrative: 0,
      taxes: 0,
      other: 0,
      operatingExpenses: 0,
      netResult: 0,
    },
  )

  const handleExportCSV = () => {
    let csv = 'Demonstrativo,' + months.join(',') + ',Total\n'
    const addRow = (label: string, key: keyof (typeof report)[0]) => {
      csv += `"${label}",` + report.map((d) => d[key]).join(',') + ',' + totals[key] + '\n'
    }
    addRow('(=) Receita Bruta', 'revenue')
    addRow('(-) Custo de Materiais (Variável)', 'labMaterial')
    addRow('(=) Lucro Bruto', 'grossProfit')
    addRow('(-) Pessoal / Folha', 'personnel')
    addRow('(-) Despesas Administrativas', 'administrative')
    addRow('(-) Impostos', 'taxes')
    addRow('(-) Outras Despesas', 'other')
    addRow('(=) Resultado Líquido', 'netResult')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DRE_${year}_${basis}.csv`
    a.click()
  }

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist')
    return <Navigate to="/" replace />

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">DRE</h2>
            <p className="text-muted-foreground text-sm">
              Demonstrativo de Resultados do Exercício.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center">
            <Select value={basis} onValueChange={(v: any) => setBasis(v)}>
              <SelectTrigger className="w-[240px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accrual">Regime de Competência</SelectItem>
                <SelectItem value="cash">Regime de Caixa</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground ml-2 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  <strong>Competência:</strong> Considera a data de finalização dos trabalhos
                  (Receita) e a data de vencimento das contas (Despesa), independentemente do
                  pagamento.
                </p>
                <p className="mt-2">
                  <strong>Caixa:</strong> Considera apenas o que foi efetivamente recebido
                  (Liquidações) e o que foi efetivamente pago (Status: Paga).
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="w-4 h-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h2 className="text-2xl font-bold">Relatório DRE - {year}</h2>
        <p className="text-muted-foreground">
          Regime: {basis === 'cash' ? 'Caixa' : 'Competência'} | Emissão:{' '}
          {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[280px] font-bold text-foreground print:text-black">
                    Demonstrativo
                  </TableHead>
                  {months.map((m) => (
                    <TableHead key={m} className="text-right min-w-[100px] print:text-black">
                      {m}
                    </TableHead>
                  ))}
                  <TableHead className="text-right min-w-[120px] font-bold bg-muted/50 print:bg-transparent print:text-black">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Receita Bruta */}
                <TableRow className="bg-emerald-50/30 print:bg-transparent">
                  <TableCell className="font-semibold text-emerald-700 print:text-black">
                    (=) Receita Bruta
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right text-emerald-600 print:text-black">
                      {formatBRL(d.revenue)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-emerald-700 bg-emerald-50/50 print:bg-transparent print:text-black">
                    {formatBRL(totals.revenue)}
                  </TableCell>
                </TableRow>

                {/* Custos Variáveis */}
                <TableRow>
                  <TableCell className="pl-8 text-muted-foreground print:text-black">
                    (-) Custo de Materiais (Variável)
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right text-red-500 print:text-black">
                      {formatBRL(d.labMaterial)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-red-600 bg-muted/30 print:bg-transparent print:text-black">
                    {formatBRL(totals.labMaterial)}
                  </TableCell>
                </TableRow>

                {/* Lucro Bruto */}
                <TableRow className="border-t-2 border-t-muted bg-blue-50/20 print:bg-transparent print:border-black">
                  <TableCell className="font-semibold text-blue-700 print:text-black">
                    (=) Lucro Bruto
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell
                      key={i}
                      className="text-right font-medium text-blue-600 print:text-black"
                    >
                      {formatBRL(d.grossProfit)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-blue-700 bg-blue-50/40 print:bg-transparent print:text-black">
                    {formatBRL(totals.grossProfit)}
                  </TableCell>
                </TableRow>

                {/* Despesas Operacionais */}
                <TableRow>
                  <TableCell className="pl-8 text-muted-foreground print:text-black">
                    (-) Pessoal / Folha
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right print:text-black">
                      {formatBRL(d.personnel)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                    {formatBRL(totals.personnel)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-muted-foreground print:text-black">
                    (-) Despesas Administrativas
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right print:text-black">
                      {formatBRL(d.administrative)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                    {formatBRL(totals.administrative)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-muted-foreground print:text-black">
                    (-) Impostos
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right print:text-black">
                      {formatBRL(d.taxes)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                    {formatBRL(totals.taxes)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-muted-foreground print:text-black">
                    (-) Outras Despesas
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right print:text-black">
                      {formatBRL(d.other)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                    {formatBRL(totals.other)}
                  </TableCell>
                </TableRow>

                {/* Resultado Líquido */}
                <TableRow className="border-t-2 border-t-muted bg-slate-50 dark:bg-slate-900 print:bg-transparent print:border-black">
                  <TableCell className="font-bold text-base print:text-black">
                    (=) Resultado Líquido
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell
                      key={i}
                      className={`text-right font-bold ${d.netResult >= 0 ? 'text-emerald-600' : 'text-red-600'} print:text-black`}
                    >
                      {formatBRL(d.netResult)}
                    </TableCell>
                  ))}
                  <TableCell
                    className={`text-right font-bold text-base bg-slate-100 dark:bg-slate-800 print:bg-transparent print:text-black ${totals.netResult >= 0 ? 'text-emerald-700' : 'text-red-700'}`}
                  >
                    {formatBRL(totals.netResult)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
