import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function PartnerPricesPanel({
  partnerId,
  isReadOnly,
}: {
  partnerId: string
  isReadOnly?: boolean
}) {
  const { priceList } = useAppStore()
  const [partnerPrices, setPartnerPrices] = useState<
    Record<string, { custom_price: string; is_enabled: boolean }>
  >({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchPrices() {
      const { data, error } = await supabase
        .from('partner_prices')
        .select('*')
        .eq('partner_id', partnerId)
      if (data) {
        const pricesMap: Record<string, { custom_price: string; is_enabled: boolean }> = {}
        data.forEach((p: any) => {
          pricesMap[p.price_list_id] = {
            custom_price: p.custom_price != null ? String(p.custom_price) : '',
            is_enabled: p.is_enabled,
          }
        })
        setPartnerPrices(pricesMap)
      } else if (error) {
        console.error('Failed to fetch partner prices:', error)
      }
      setLoading(false)
    }
    fetchPrices()
  }, [partnerId])

  const handlePriceChange = (priceListId: string, val: string) => {
    if (isReadOnly) return
    setPartnerPrices((prev) => ({
      ...prev,
      [priceListId]: {
        ...prev[priceListId],
        custom_price: val,
        is_enabled: prev[priceListId]?.is_enabled ?? true,
      },
    }))
  }

  const handleToggle = (priceListId: string, checked: boolean) => {
    if (isReadOnly) return
    setPartnerPrices((prev) => ({
      ...prev,
      [priceListId]: {
        ...prev[priceListId],
        is_enabled: checked,
        custom_price: prev[priceListId]?.custom_price ?? '',
      },
    }))
  }

  const handleEnableAll = () => {
    if (isReadOnly) return
    const allEnabled: Record<string, any> = { ...partnerPrices }
    priceList.forEach((p) => {
      if (!allEnabled[p.id]) {
        allEnabled[p.id] = { custom_price: '', is_enabled: true }
      } else {
        allEnabled[p.id].is_enabled = true
      }
    })
    setPartnerPrices(allEnabled)
  }

  const handleSave = async () => {
    if (isReadOnly) return
    setSaving(true)
    const upserts = Object.keys(partnerPrices).map((priceListId) => {
      const pp = partnerPrices[priceListId]
      const defaultPrice = priceList.find((p) => p.id === priceListId)?.price || '0'
      const customPriceNum = pp.custom_price
        ? parseFloat(pp.custom_price.replace(',', '.'))
        : parseFloat(
            String(defaultPrice)
              .replace(/[^\d,.-]/g, '')
              .replace(/\./g, '')
              .replace(',', '.'),
          ) || 0

      return {
        partner_id: partnerId,
        price_list_id: priceListId,
        custom_price: isNaN(customPriceNum) ? 0 : customPriceNum,
        is_enabled: pp.is_enabled,
      }
    })

    if (upserts.length > 0) {
      const { error } = await supabase
        .from('partner_prices')
        .upsert(upserts, { onConflict: 'partner_id,price_list_id' })
      if (error) {
        toast({
          title: 'Erro ao salvar tabela',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Tabela de preços salva com sucesso!' })
      }
    }
    setSaving(false)
  }

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold">Tabela de Preços Personalizada</h3>
          <p className="text-sm text-muted-foreground">
            Defina os valores negociados e habilite os procedimentos para este parceiro.
          </p>
        </div>
        {!isReadOnly && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEnableAll}>
              Habilitar Todos
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#e76f51] hover:bg-[#d95f43] text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar Tabela'
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="border rounded-xl bg-background overflow-hidden">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Procedimento</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Valor Padrão</TableHead>
                <TableHead>Valor Negociado (R$)</TableHead>
                <TableHead className="text-center">Habilitado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceList.map((item) => {
                const pp = partnerPrices[item.id]
                const isEnabled = pp?.is_enabled ?? true
                const customPrice = pp?.custom_price ?? ''

                return (
                  <TableRow key={item.id} className={!isEnabled ? 'opacity-50 bg-muted/20' : ''}>
                    <TableCell className="font-medium text-xs">{item.work_type}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.sector}</TableCell>
                    <TableCell className="text-xs font-semibold">{item.price}</TableCell>
                    <TableCell>
                      <Input
                        placeholder="Ex: 250,00"
                        value={customPrice}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        disabled={!isEnabled || isReadOnly}
                        className="w-32 h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(c) => handleToggle(item.id, c)}
                        disabled={isReadOnly}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
