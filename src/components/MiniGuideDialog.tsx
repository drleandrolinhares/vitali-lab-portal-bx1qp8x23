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
  type?: 'print' | 'full'
}

export function MiniGuideDialog({ order, isOpen, onClose, type = 'print' }: Props) {
  if (!order) return null

  const orderUrl =
    type === 'full'
      ? `${window.location.origin}/public/order/${order.id}/full`
      : `${window.location.origin}/public/guide/${order.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}`

  const title = type === 'full' ? 'QR Code do Pedido Completo' : 'Mini Guia de Trabalho'
  const description =
    type === 'full'
      ? 'Escaneie para visualizar todos os detalhes clínicos e financeiros do pedido.'
      : 'Imprima esta guia para colar ou acompanhar a caixa física do trabalho na bancada.'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] print:shadow-none print:border-none print:p-0 print:bg-transparent">
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
              box-shadow: none !important;
            }
            @page {
              margin: 0;
              size: auto;
            }
          }
        `}</style>

        <div className="print:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">{title}</DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">{description}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center justify-center py-2 print:py-0">
          <div
            id="print-area"
            className="w-full border border-slate-200 p-6 rounded-xl bg-white text-slate-900 shadow-sm print:max-w-[300px]"
          >
            <div className="text-center mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-2xl uppercase leading-tight tracking-tight text-slate-800">
                VITALI LAB
              </h3>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mt-1">
                {order.friendlyId}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-40 h-40 object-contain mix-blend-multiply"
                crossOrigin="anonymous"
              />
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider">
                  Paciente
                </span>
                <span className="font-bold text-sm block text-slate-800 uppercase break-words leading-tight">
                  {order.patientName}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider">
                  Dentista
                </span>
                <span className="font-bold text-sm block text-slate-800 uppercase break-words leading-tight">
                  {order.dentistName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 print:hidden mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
          <Button
            onClick={() => window.print()}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Printer className="w-4 h-4" />
            Imprimir Guia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
