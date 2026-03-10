import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
  Calculator,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'

interface FixedCost {
  id: string
  description: string
  value: number
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export default function HourlyCost() {
  const { currentUser } = useAppStore()
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([])
  const [monthlyHours, setMonthlyHours] = useState<number>(176)
  const [evaluationFactor, setEvaluationFactor] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('app_settings')
        .select('*')
        .in('key', [
          'hourly_cost_fixed_items',
          'hourly_cost_monthly_hours',
          'hourly_cost_evaluation_factor',
        ])

      if (data) {
        const items = data.find((d) => d.key === 'hourly_cost_fixed_items')
        const hours = data.find((d) => d.key === 'hourly_cost_monthly_hours')
        const factor = data.find((d) => d.key === 'hourly_cost_evaluation_factor')

        if (items?.value) {
          try {
            setFixedCosts(JSON.parse(items.value))
          } catch (e) {
            console.error(e)
          }
        } else {
          setFixedCosts([
            { id: crypto.randomUUID(), description: 'Pró-labore', value: 2000 },
            { id: crypto.randomUUID(), description: 'Salários Funcionários', value: 17000 },
            { id: crypto.randomUUID(), description: 'Aluguel / IPTU / Condomínio', value: 2200 },
            { id: crypto.randomUUID(), description: 'Energia / Água', value: 500 },
          ])
        }

        if (hours?.value) setMonthlyHours(Number(hours.value))
        if (factor?.value) setEvaluationFactor(Number(factor.value))
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const totalFixedCosts = useMemo(
    () => fixedCosts.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0),
    [fixedCosts],
  )
  const totalHourlyCost = monthlyHours > 0 ? totalFixedCosts / monthlyHours : 0
  const hourlyCostWithFactor = totalHourlyCost + evaluationFactor
  const costPerMinute = hourlyCostWithFactor / 60

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist') {
    return <Navigate to="/" replace />
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = [
      {
        key: 'hourly_cost_fixed_items',
        value: JSON.stringify(fixedCosts),
        updated_at: new Date().toISOString(),
      },
      {
        key: 'hourly_cost_monthly_hours',
        value: monthlyHours.toString(),
        updated_at: new Date().toISOString(),
      },
      {
        key: 'hourly_cost_evaluation_factor',
        value: evaluationFactor.toString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const { error } = await supabase.from('app_settings').upsert(updates)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Configurações salvas com sucesso!' })
    }
    setSaving(false)
  }

  const updateCost = (id: string, field: keyof FixedCost, value: string | number) => {
    setFixedCosts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const addCost = () => {
    setFixedCosts((prev) => [...prev, { id: crypto.randomUUID(), description: '', value: 0 }])
  }

  const removeCost = (id: string) => {
    setFixedCosts((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]">Carregando...</div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link to="/admin-financial">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Custo Hora Clínica</h2>
            <p className="text-muted-foreground text-sm">
              Gerencie a precificação e os custos operacionais por minuto.
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-slate-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Total Custos Fixos
            </CardTitle>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {formatCurrency(totalFixedCosts)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Custo Hora Base
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalHourlyCost)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-purple-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Custo Hora + Avaliação
            </CardTitle>
            <Activity className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(hourlyCostWithFactor)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Custo por Minuto
            </CardTitle>
            <Calculator className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(costPerMinute)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custos e Despesas Fixas</CardTitle>
                <CardDescription>
                  Adicione e atualize os itens de custo fixo da clínica.
                </CardDescription>
              </div>
              <Button onClick={addCost} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-[200px] text-right">Valor (R$)</TableHead>
                      <TableHead className="w-[80px] text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixedCosts.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell>
                          <Input
                            value={cost.description}
                            onChange={(e) => updateCost(cost.id, 'description', e.target.value)}
                            placeholder="Descrição do custo..."
                            className="border-transparent hover:border-input focus:border-input bg-transparent"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={cost.value || ''}
                            onChange={(e) =>
                              updateCost(cost.id, 'value', parseFloat(e.target.value))
                            }
                            className="text-right border-transparent hover:border-input focus:border-input bg-transparent"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-600"
                            onClick={() => removeCost(cost.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {fixedCosts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Nenhum custo fixo registrado. Clique em "Adicionar Item".
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total de Custos Fixos</TableCell>
                      <TableCell className="text-right font-bold text-slate-700">
                        {formatCurrency(totalFixedCosts)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Parâmetros de Cálculo</CardTitle>
              <CardDescription>Defina as horas de atendimento e fatores de ajuste.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 block">
                  Total de Horas de Atendimento por Mês
                  <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                    Considere ociosidade, faltas e desmarcados. (Ex: 176)
                  </span>
                </label>
                <Input
                  type="number"
                  value={monthlyHours || ''}
                  onChange={(e) => setMonthlyHours(parseFloat(e.target.value))}
                  placeholder="Ex: 176"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 block">
                  Fator de Avaliação (R$)
                  <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                    Valor adicionado ao custo hora base.
                  </span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluationFactor || ''}
                  onChange={(e) => setEvaluationFactor(parseFloat(e.target.value))}
                  placeholder="Ex: 0.00"
                />
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Fórmula Custo Hora:</span>
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                    Custos / Horas
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Fórmula por Minuto:</span>
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                    Custo Hora / 60
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
