import { cn } from '@/lib/utils'
import logoImg from '@/assets/vitalli-03-4bb8e.png'

interface LogoProps {
  className?: string
  variant?: 'default' | 'square'
  size?: 'sm' | 'lg' | 'xl'
}

export function Logo({ className, variant = 'default', size = 'lg' }: LogoProps) {
  if (variant === 'square') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-primary shrink-0 shadow-md overflow-hidden border border-primary/20',
          size === 'sm'
            ? 'w-20 h-20 rounded-xl'
            : size === 'xl'
              ? 'w-40 h-40 rounded-3xl'
              : 'w-28 h-28 rounded-2xl',
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

  const sizes = {
    sm: { wrapper: 'text-lg gap-1.5', icon: 'w-6 h-6 rounded', textGap: 'gap-0.5' },
    lg: { wrapper: 'text-xl gap-2', icon: 'w-8 h-8 rounded-md', textGap: 'gap-1' },
    xl: { wrapper: 'text-4xl gap-3', icon: 'w-14 h-14 rounded-xl', textGap: 'gap-1.5' },
  }

  return (
    <div
      className={cn(
        'flex items-center font-display tracking-tight',
        sizes[size].wrapper,
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-primary shrink-0 shadow-sm overflow-hidden border border-primary/20',
          sizes[size].icon,
        )}
      >
        <img
          src={logoImg}
          alt="Vitali Lab Logo"
          className="w-full h-full object-contain scale-[1.85]"
        />
      </div>
      <div className={cn('flex items-center', sizes[size].textGap)}>
        <span className="font-extrabold text-foreground uppercase">Vitali</span>
        <span className="font-light text-foreground/80 lowercase">lab.</span>
      </div>
    </div>
  )
}
