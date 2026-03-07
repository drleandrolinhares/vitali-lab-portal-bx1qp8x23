import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1 font-display tracking-tight text-xl', className)}>
      <span className="font-extrabold text-foreground dark:text-white uppercase">Vitali</span>
      <span className="font-light text-foreground/80 dark:text-white/80 lowercase">lab.</span>
    </div>
  )
}
