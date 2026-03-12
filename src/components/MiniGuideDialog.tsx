import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Order } from '@/lib/types'
import { Printer } from 'lucide-react'

interface Props {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function MiniGuideDialog({ order, isOpen, onClose }: Props) {
  if (!order) return null

  // Generate QR code encoding the direct URL to the order details
  const orderUrl = `${window.location.origin}/order/${order.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm print:shadow-none print:border-none print:p-0 print:bg-transparent">
        {/* Global print styles specifically tuned for the Mini Guide */}
        <style>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #print-area, #print-area * {
              visibility: visible !important;
            }
            #print-area {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              margin: 0 !important;
              padding: 16px !important;
              width: 7.5cm !important;
              background: white !important;
              border: 1px dashed #ccc !important;
            }
            @page {
              margin: 0;
              size: auto;
            }
          }
        `}</style>

        <div className="print:hidden">
          <DialogHeader>
            <DialogTitle>Mini Guia de Trabalho</DialogTitle>
            <DialogDescription>
              Imprima esta guia para colar ou acompanhar a caixa física do trabalho na bancada.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center justify-center py-4 print:py-0">
          <div
            id="print-area"
            className="w-full max-w-[280px] border border-slate-200 p-4 rounded-lg bg-white text-slate-900 shadow-sm"
          >
            <div className="text-center mb-3 border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-lg uppercase leading-tight tracking-tight text-slate-800">
                Vitali Lab
              </h3>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500 mt-1">
                {order.friendlyId}
              </p>
            </div>

            <div className="flex justify-center my-4">
              <div className="p-1 bg-white border border-slate-100 rounded-md shadow-sm">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-32 h-32 object-contain mix-blend-multiply"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-bold uppercase text-[9px] text-slate-400 block mb-0.5">
                  Paciente
                </span>
                <span className="font-bold text-sm truncate block text-slate-700">
                  {order.patientName}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-bold uppercase text-[9px] text-slate-400 block mb-0.5">
                  Dentista
                </span>
                <span className="font-semibold text-xs truncate block text-slate-700">
                  {order.dentistName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 print:hidden mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimir Guia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
