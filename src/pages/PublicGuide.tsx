import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function PublicGuide() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchGuide = async () => {
      if (!id) return
      try {
        const { data: result, error: rpcError } = await supabase.rpc('get_public_order_guide', {
          target_order_id: id,
        })
        if (rpcError) throw rpcError
        if (result) {
          setData(result)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchGuide()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Carregando guia...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Guia não encontrada</h1>
          <p className="text-slate-500 mt-2 text-sm">
            O pedido solicitado não existe ou foi removido do sistema.
          </p>
        </div>
      </div>
    )
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[340px] bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="text-center mb-6 border-b border-slate-100 pb-5">
          <h3 className="font-extrabold text-2xl uppercase leading-tight tracking-tight text-slate-800">
            VITALI LAB
          </h3>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mt-1">
            {data.friendly_id}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-40 h-40 object-contain mix-blend-multiply"
            crossOrigin="anonymous"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider">
              Paciente
            </span>
            <span className="font-bold text-base block text-slate-800 uppercase break-words leading-tight">
              {data.patient_name}
            </span>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider">
              Dentista
            </span>
            <span className="font-bold text-base block text-slate-800 uppercase break-words leading-tight">
              {data.dentist_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
