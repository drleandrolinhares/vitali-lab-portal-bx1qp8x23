import { useState, useEffect, useMemo } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function PartnerPricesPanel({
  partnerId,
  isReadOnly,
}: {
  partnerId: string
  isReadOnly?: boolean
}) {
  const { priceList } = useAppStore()
  const [partnerPrices, setPartnerPrices] = useState<
    Record<string, { custom_price: string; is_enabled: boolean; in_db: boolean }>
  >({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showOnlyCustom, setShowOnlyCustom] = useState(false)

  useEffect(() => {
    async function fetchPrices() {
      const { data, error } = await supabase
        .from('partner_prices')
        .select('*')
        .eq('partner_id', partnerId)
      if (data) {
        const pricesMap: Record<
          string,
          { custom_price: string; is_enabled: boolean; in_db: boolean }
        > = {}
        data.forEach((p: any) => {
          pricesMap[p.price_list_id] = {
            custom_price: p.custom_price != null ? String(p.custom_price) : '',
            is_enabled: p.is_enabled,
            in_db: true,
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
        in_db: prev[priceListId]?.in_db ?? false,
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
        in_db: prev[priceListId]?.in_db ?? false,
      },
    }))
  }

  const filteredPriceList = useMemo(() => {
    let list = priceList
    if (showOnlyCustom) {
      list = list.filter((item) => {
        const pp = partnerPrices[item.id]
        if (!pp) return false
        const hasCustomVal = pp.custom_price && pp.custom_price.trim() !== ''
        const isDisabled = !pp.is_enabled
        return hasCustomVal || isDisabled || pp.in_db
      })
    }
    return list
  }, [priceList, showOnlyCustom, partnerPrices])

  const handleEnableAll = () => {
    if (isReadOnly) return
    setPartnerPrices((prev) => {
      const next = { ...prev }
      filteredPriceList.forEach((item) => {
        if (next[item.id]) {
          next[item.id] = { ...next[item.id], is_enabled: true }
        } else {
          next[item.id] = { custom_price: '', is_enabled: true, in_db: false }
        }
      })
      return next
    })
  }

  const handleDisableAll = () => {
    if (isReadOnly) return
    setPartnerPrices((prev) => {
      const next = { ...prev }
      filteredPriceList.forEach((item) => {
        if (next[item.id]) {
          next[item.id] = { ...next[item.id], is_enabled: false }
        } else {
          next[item.id] = { custom_price: '', is_enabled: false, in_db: false }
        }
      })
      return next
    })
  }

  const handleSave = async () => {
    if (isReadOnly) return
    setSaving(true)

    const upserts: any[] = []
    const deletes: string[] = []

    Object.keys(partnerPrices).forEach((priceListId) => {
      const pp = partnerPrices[priceListId]
      const hasCustomPrice = pp.custom_price && pp.custom_price.trim() !== ''
      const isEnabled = pp.is_enabled

      if (!hasCustomPrice && isEnabled) {
        if (pp.in_db) deletes.push(priceListId)
      } else {
        const defaultPriceStr = priceList.find((p) => p.id === priceListId)?.price || '0'
        let customPriceNum = 0

        if (hasCustomPrice) {
          customPriceNum = parseFloat(String(pp.custom_price).replace(',', '.'))
        } else {
          customPriceNum =
            parseFloat(
              String(defaultPriceStr)
                .replace(/[^\d,.-]/g, '')
                .replace(/\./g, '')
                .replace(',', '.'),
            ) || 0
        }

        upserts.push({
          partner_id: partnerId,
          price_list_id: priceListId,
          custom_price: isNaN(customPriceNum) ? 0 : customPriceNum,
          is_enabled: isEnabled,
        })
      }
    })

    try {
      if (deletes.length > 0) {
        await supabase
          .from('partner_prices')
          .delete()
          .eq('partner_id', partnerId)
          .in('price_list_id', deletes)
      }

      if (upserts.length > 0) {
        const { error } = await supabase
          .from('partner_prices')
          .upsert(upserts, { onConflict: 'partner_id,price_list_id' })

        if (error) throw error
      }

      setPartnerPrices((prev) => {
        const next = { ...prev }
        deletes.forEach((id) => {
          if (next[id]) next[id].in_db = false
        })
        upserts.forEach((u) => {
          if (next[u.price_list_id]) next[u.price_list_id].in_db = true
        })
        return next
      })

      toast({ title: 'Tabela de preços salva com sucesso!' })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar tabela',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">Tabela de Preços Personalizada</h3>
            <p className="text-sm text-muted-foreground">
              Defina os valores negociados e habilite os procedimentos para este parceiro.
            </p>
          </div>
          {!isReadOnly && (
            <div className="flex gap-2 shrink-0 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleDisableAll}>
                Desabilitar Todos
              </Button>
              <Button variant="outline" size="sm" onClick={handleEnableAll}>
                Habilitar Todos
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
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

        <div className="flex items-center space-x-2 bg-muted/20 p-3 border rounded-lg">
          <Checkbox
            id="show-only-custom"
            checked={showOnlyCustom}
            onCheckedChange={(c) => setShowOnlyCustom(!!c)}
          />
          <Label htmlFor="show-only-custom" className="text-sm cursor-pointer font-medium">
            Mostrar apenas procedimentos com valores cadastrados
          </Label>
        </div>
      </div>

      <div className="border rounded-xl bg-background overflow-hidden">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Procedimento/Item</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Valor Padrão</TableHead>
                <TableHead>Valor Negociado (R$)</TableHead>
                <TableHead className="text-center">Habilitado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPriceList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum procedimento encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPriceList.map((item) => {
                  const pp = partnerPrices[item.id]
                  const isEnabled = pp?.is_enabled ?? true
                  const customPrice = pp?.custom_price ?? ''
                  const isCustomized = pp?.in_db || customPrice !== '' || !isEnabled

                  return (
                    <TableRow key={item.id} className={!isEnabled ? 'opacity-50 bg-muted/20' : ''}>
                      <TableCell className="font-medium text-xs">
                        {item.work_type}
                        {item.material && (
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            {item.material}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.sector}</TableCell>
                      <TableCell className="text-xs font-semibold">{item.price}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 250.00"
                          value={customPrice}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          disabled={!isEnabled || isReadOnly}
                          className={cn(
                            'w-32 h-8 text-xs',
                            isCustomized && customPrice !== ''
                              ? 'border-[#e76f51] focus-visible:ring-[#e76f51]'
                              : '',
                          )}
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
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
