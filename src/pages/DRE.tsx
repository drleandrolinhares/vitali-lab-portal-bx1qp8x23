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
import { FileDown, BarChart3, Info, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseISO, getMonth, getYear } from 'date-fns'
import { Navigate, Link } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function DREPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [basis, setBasis] = useState<'cash' | 'accrual'>('accrual')
  const { orders, kanbanStages, priceList, currentUser, dreCategories } = useAppStore()

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

  const revenueCats = useMemo(
    () => dreCategories.filter((c) => c.category_type === 'revenue'),
    [dreCategories],
  )
  const variableCats = useMemo(
    () => dreCategories.filter((c) => c.category_type === 'variable'),
    [dreCategories],
  )
  const fixedCats = useMemo(
    () => dreCategories.filter((c) => c.category_type === 'fixed'),
    [dreCategories],
  )
  const defaultRevCat = revenueCats[0]?.name || 'Receita'

  const { report, totals } = useMemo(() => {
    const dreCatMap = new Map(dreCategories.map((c) => [c.name, c.category_type]))

    const rep = months.map(() => {
      const data = {
        revenue: {} as Record<string, number>,
        variable: {} as Record<string, number>,
        fixed: {} as Record<string, number>,
        totalRevenue: 0,
        totalVariable: 0,
        totalFixed: 0,
        grossProfit: 0,
        netResult: 0,
      }
      dreCategories.forEach((c) => {
        if (c.category_type === 'revenue') data.revenue[c.name] = 0
        if (c.category_type === 'variable') data.variable[c.name] = 0
        if (c.category_type === 'fixed') data.fixed[c.name] = 0
      })
      return data
    })

    const tot = {
      revenue: {} as Record<string, number>,
      variable: {} as Record<string, number>,
      fixed: {} as Record<string, number>,
      totalRevenue: 0,
      totalVariable: 0,
      totalFixed: 0,
      grossProfit: 0,
      netResult: 0,
    }
    dreCategories.forEach((c) => {
      if (c.category_type === 'revenue') tot.revenue[c.name] = 0
      if (c.category_type === 'variable') tot.variable[c.name] = 0
      if (c.category_type === 'fixed') tot.fixed[c.name] = 0
    })

    if (basis === 'cash') {
      settlements.forEach((s) => {
        const m = getMonth(parseISO(s.created_at))
        const val = Number(s.amount)
        if (rep[m].revenue[defaultRevCat] !== undefined) {
          rep[m].revenue[defaultRevCat] += val
          rep[m].totalRevenue += val
        }
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
          if (getYear(parseISO(dateStr)).toString() === year) {
            const fin = getOrderFinancials(o, priceList, kanbanStages)
            const cat = o.dre_category || defaultRevCat
            if (dreCatMap.get(cat) === 'revenue' && rep[m].revenue[cat] !== undefined) {
              rep[m].revenue[cat] += fin.totalCost
              rep[m].totalRevenue += fin.totalCost
            }
          }
        }
      })
    }

    expenses.forEach((e) => {
      if (basis === 'cash' && e.status !== 'paid') return
      const m = getMonth(parseISO(e.due_date))
      const val = Number(e.amount)
      const cat = e.dre_category || 'Outros'
      const type = dreCatMap.get(cat)

      if (type === 'variable' && rep[m].variable[cat] !== undefined) {
        rep[m].variable[cat] += val
        rep[m].totalVariable += val
      } else if (type === 'fixed' && rep[m].fixed[cat] !== undefined) {
        rep[m].fixed[cat] += val
        rep[m].totalFixed += val
      } else if (type === 'revenue' && rep[m].revenue[cat] !== undefined) {
        rep[m].revenue[cat] += val
        rep[m].totalRevenue += val
      }
    })

    rep.forEach((m) => {
      m.grossProfit = m.totalRevenue - m.totalVariable
      m.netResult = m.grossProfit - m.totalFixed

      dreCategories.forEach((c) => {
        if (c.category_type === 'revenue') tot.revenue[c.name] += m.revenue[c.name]
        if (c.category_type === 'variable') tot.variable[c.name] += m.variable[c.name]
        if (c.category_type === 'fixed') tot.fixed[c.name] += m.fixed[c.name]
      })
      tot.totalRevenue += m.totalRevenue
      tot.totalVariable += m.totalVariable
      tot.totalFixed += m.totalFixed
      tot.grossProfit += m.grossProfit
      tot.netResult += m.netResult
    })

    return { report: rep, totals: tot }
  }, [
    basis,
    year,
    settlements,
    expenses,
    orders,
    priceList,
    kanbanStages,
    dreCategories,
    defaultRevCat,
  ])

  const handleExportCSV = () => {
    let csv = 'Demonstrativo,' + months.join(',') + ',Total\n'

    revenueCats.forEach((cat) => {
      csv +=
        `"${cat.name}",` +
        report.map((d) => d.revenue[cat.name]).join(',') +
        ',' +
        totals.revenue[cat.name] +
        '\n'
    })
    csv +=
      `"(=) Total Receita Bruta",` +
      report.map((d) => d.totalRevenue).join(',') +
      ',' +
      totals.totalRevenue +
      '\n'

    variableCats.forEach((cat) => {
      csv +=
        `"(-) ${cat.name}",` +
        report.map((d) => d.variable[cat.name]).join(',') +
        ',' +
        totals.variable[cat.name] +
        '\n'
    })
    csv +=
      `"(=) Lucro Bruto",` +
      report.map((d) => d.grossProfit).join(',') +
      ',' +
      totals.grossProfit +
      '\n'

    fixedCats.forEach((cat) => {
      csv +=
        `"(-) ${cat.name}",` +
        report.map((d) => d.fixed[cat.name]).join(',') +
        ',' +
        totals.fixed[cat.name] +
        '\n'
    })
    csv +=
      `"(=) Resultado Líquido",` +
      report.map((d) => d.netResult).join(',') +
      ',' +
      totals.netResult +
      '\n'

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
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
                  <strong>Competência:</strong> Considera a data de finalização dos trabalhos e
                  vencimento das contas.
                </p>
                <p className="mt-2">
                  <strong>Caixa:</strong> Considera apenas valores efetivamente pagos e recebidos.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          {currentUser?.role === 'admin' && (
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/dre-categories">
                <Settings className="w-4 h-4 mr-2" /> Categorias
              </Link>
            </Button>
          )}
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
                {/* Receitas */}
                {revenueCats.map((cat) => (
                  <TableRow key={cat.name}>
                    <TableCell className="pl-8 text-muted-foreground print:text-black">
                      (+) {cat.name}
                    </TableCell>
                    {report.map((d, i) => (
                      <TableCell key={i} className="text-right print:text-black">
                        {formatBRL(d.revenue[cat.name])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                      {formatBRL(totals.revenue[cat.name])}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-emerald-50/30 print:bg-transparent">
                  <TableCell className="font-semibold text-emerald-700 print:text-black">
                    (=) Receita Bruta
                  </TableCell>
                  {report.map((d, i) => (
                    <TableCell key={i} className="text-right text-emerald-600 print:text-black">
                      {formatBRL(d.totalRevenue)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-emerald-700 bg-emerald-50/50 print:bg-transparent print:text-black">
                    {formatBRL(totals.totalRevenue)}
                  </TableCell>
                </TableRow>

                {/* Custos Variáveis */}
                {variableCats.map((cat) => (
                  <TableRow key={cat.name}>
                    <TableCell className="pl-8 text-muted-foreground print:text-black">
                      (-) {cat.name}
                    </TableCell>
                    {report.map((d, i) => (
                      <TableCell key={i} className="text-right text-red-500 print:text-black">
                        {formatBRL(d.variable[cat.name])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-bold text-red-600 bg-muted/30 print:bg-transparent print:text-black">
                      {formatBRL(totals.variable[cat.name])}
                    </TableCell>
                  </TableRow>
                ))}

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
                {fixedCats.map((cat) => (
                  <TableRow key={cat.name}>
                    <TableCell className="pl-8 text-muted-foreground print:text-black">
                      (-) {cat.name}
                    </TableCell>
                    {report.map((d, i) => (
                      <TableCell key={i} className="text-right print:text-black">
                        {formatBRL(d.fixed[cat.name])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium bg-muted/30 print:bg-transparent print:text-black">
                      {formatBRL(totals.fixed[cat.name])}
                    </TableCell>
                  </TableRow>
                ))}

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
