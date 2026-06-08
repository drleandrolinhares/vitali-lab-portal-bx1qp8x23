import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useInvoicePrint() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [printData, setPrintData] = useState<any>(null)

  const triggerPrint = useCallback(async (orders: any[], dentistId: string) => {
    try {
      setIsPrinting(true)

      // Fetch institutional lab profile from app_settings
      const { data: settings } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['lab_razao_social', 'lab_cnpj', 'lab_address', 'lab_pix_key', 'lab_bank_name'])

      const settingsMap =
        settings?.reduce(
          (acc, curr) => {
            acc[curr.key] = curr.value
            return acc
          },
          {} as Record<string, string>,
        ) || {}

      const labProfile = {
        clinic: settingsMap['lab_razao_social'] || 'VITALI LAB',
        cpf: settingsMap['lab_cnpj'] || 'Não informado',
        address: settingsMap['lab_address'] || 'Endereço não informado',
        pix_key: settingsMap['lab_pix_key'] || 'Não informada',
        bank_name: settingsMap['lab_bank_name'] || 'Informação Bancária via PIX',
      }

      // Fetch specific dentist profile
      const { data: dentistProfile } = await supabase
        .from('profiles')
        .select('name, cpf, clinic')
        .eq('id', dentistId)
        .single()

      setPrintData({
        labProfile,
        dentist: dentistProfile,
        orders,
        invoiceDate: new Date(),
      })

      // Allow DOM to render the hidden print buffer before calling window.print()
      setTimeout(() => {
        const dentistName = dentistProfile?.name || 'Cliente'
        const dateStr = new Date().toISOString().split('T')[0]
        const originalTitle = document.title

        // Dynamically rename document for PDF export name inference
        document.title = `Fatura_Vitali_Lab_${dateStr}_${dentistName.replace(/\s+/g, '_')}`

        window.print()

        // Restore title and cleanup
        document.title = originalTitle
        setIsPrinting(false)
        setPrintData(null)
      }, 800)
    } catch (error) {
      console.error('Error preparing print:', error)
      setIsPrinting(false)
    }
  }, [])

  return { isPrinting, printData, triggerPrint }
}
