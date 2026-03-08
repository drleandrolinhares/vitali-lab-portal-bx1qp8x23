import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BellRing, CheckCircle } from 'lucide-react'

export function NewOrderNotification() {
  const { currentUser } = useAppStore()
  const [queue, setQueue] = useState<any[]>([])

  useEffect(() => {
    if (currentUser?.role !== 'admin') return

    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setQueue((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  if (queue.length === 0) return null

  const currentOrder = queue[0]

  const handleClose = () => {
    setQueue((prev) => prev.slice(1))
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md border-emerald-500/20 bg-emerald-50/95 dark:bg-emerald-950/90 backdrop-blur z-[100]">
        <DialogHeader className="flex flex-col items-center sm:text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-2 shadow-inner">
            <BellRing className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-[bounce_1s_infinite]" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
            Novo Caso Recebido!
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white dark:bg-background rounded-xl p-5 my-2 border shadow-sm space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
              Paciente
            </p>
            <p className="text-lg font-semibold">{currentOrder.patient_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Trabalho
              </p>
              <p className="font-medium">{currentOrder.work_type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Material
              </p>
              <p className="font-medium">{currentOrder.material}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center mt-2">
          <Button
            onClick={handleClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-6 text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <CheckCircle className="w-5 h-5" />
            CASO RECEBIDO COM SUCESSO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
