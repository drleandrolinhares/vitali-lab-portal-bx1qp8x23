import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useInvoicePrint() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [printData, setPrintData] = useState<any>(null)

  const triggerPrint = useCallback(async (orders: any[], dentistId: string) => {
    try {
      setIsPrinting(true)

      // Fetch master profile for Lab Identity
      const { data: masterProfiles } = await supabase
        .from('profiles')
        .select('clinic, cpf, pix_key, bank_name')
        .eq('role', 'master')
        .limit(1)

      const masterProfile = masterProfiles?.[0] || null

      // Fetch specific dentist profile
      const { data: dentistProfile } = await supabase
        .from('profiles')
        .select('name, cpf, clinic')
        .eq('id', dentistId)
        .single()

      setPrintData({
        labProfile: masterProfile,
        dentist: dentistProfile,
        orders,
        invoiceDate: new Date(),
      })

      // Allow DOM to render the hidden print buffer before calling window.print()
      setTimeout(() => {
        const dentistName = dentistProfile?.name || 'Dentista'
        const dateStr = new Date().toISOString().split('T')[0]
        const originalTitle = document.title

        // Dynamically rename document for PDF export name inference
        document.title = `Fatura_Vitali_Lab_${dentistName.replace(/\s+/g, '_')}_${dateStr}.pdf`

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
