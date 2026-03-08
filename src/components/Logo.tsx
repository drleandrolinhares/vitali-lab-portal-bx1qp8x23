import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'square'
  size?: 'sm' | 'lg'
}

export function Logo({ className, variant = 'default', size = 'lg' }: LogoProps) {
  if (variant === 'square') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-background shrink-0 shadow-md overflow-hidden border border-border/20',
          size === 'sm' ? 'w-20 h-20 rounded-xl' : 'w-28 h-28 rounded-2xl',
          className,
        )}
      >
        <span
          className={cn(
            'font-extrabold text-primary uppercase leading-none tracking-tighter',
            size === 'sm' ? 'text-[22px]' : 'text-[32px]',
          )}
        >
          VITALI
        </span>
        <span
          className={cn(
            'font-light text-primary uppercase leading-none tracking-widest mt-1',
            size === 'sm' ? 'text-[22px]' : 'text-[32px]',
          )}
        >
          LAB
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1 font-display tracking-tight text-xl', className)}>
      <span className="font-extrabold text-primary uppercase">Vitali</span>
      <span className="font-light text-primary/80 lowercase">lab.</span>
    </div>
  )
}
