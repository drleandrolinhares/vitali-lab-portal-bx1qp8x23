import { cn } from '@/lib/utils'
import logoImg from '@/assets/vitalli-03-4bb8e.png'

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
          'flex flex-col items-center justify-center bg-primary shrink-0 shadow-md overflow-hidden border border-primary/20',
          size === 'sm' ? 'w-20 h-20 rounded-xl' : 'w-28 h-28 rounded-2xl',
          className,
        )}
      >
        <img
          src={logoImg}
          alt="Vitali Lab Logo"
          className="w-full h-full object-contain scale-[1.85]"
        />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 font-display tracking-tight text-xl', className)}>
      <div className="flex flex-col items-center justify-center bg-primary shrink-0 shadow-sm overflow-hidden rounded-md w-8 h-8 border border-primary/20">
        <img
          src={logoImg}
          alt="Vitali Lab Logo"
          className="w-full h-full object-contain scale-[1.85]"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="font-extrabold text-foreground uppercase">Vitali</span>
        <span className="font-light text-foreground/80 lowercase">lab.</span>
      </div>
    </div>
  )
}
