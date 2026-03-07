import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Clock, Wrench, CheckCircle2, PackageCheck } from 'lucide-react'

const config: Record<OrderStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20',
  },
  in_production: {
    label: 'Em Produção',
    icon: Wrench,
    className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20',
  },
  completed: {
    label: 'Finalizado',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20',
  },
  delivered: {
    label: 'Entregue',
    icon: PackageCheck,
    className: 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20',
  },
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const { label, icon: Icon, className: variantClass } = config[status]
  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', variantClass, className)}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  )
}

export function getStatusLabel(status: OrderStatus) {
  return config[status].label
}
