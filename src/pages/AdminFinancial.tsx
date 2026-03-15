import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DentistBillingTab } from '@/components/financial/DentistBillingTab'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, Receipt } from 'lucide-react'

export default function AdminFinancial() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Gerencie faturamentos, conferências e pagamentos do laboratório.
        </p>
      </div>

      <Tabs defaultValue="billing" className="w-full">
        <TabsList className="mb-6 h-12 px-1 bg-slate-100/80">
          <TabsTrigger value="billing" className="gap-2 h-10 px-6 font-medium">
            <Receipt className="w-4 h-4" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2 h-10 px-6 font-medium">
            <CircleDollarSign className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="mt-0 outline-none">
          <DentistBillingTab />
        </TabsContent>

        <TabsContent value="overview" className="mt-0 outline-none">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Visão Geral Financeira</CardTitle>
              <CardDescription>
                Resumo de receitas, faturamentos em aberto e despesas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center border-t border-slate-100 bg-slate-50/50 m-6 mt-0 rounded-b-xl">
              <div className="text-center space-y-2">
                <CircleDollarSign className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium">Módulo em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
