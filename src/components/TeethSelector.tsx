import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  value: number[]
  onChange: (teeth: number[]) => void
  arches?: string[]
  onArchesChange?: (arches: string[]) => void
}

const quadrants = [
  { id: 1, teeth: [18, 17, 16, 15, 14, 13, 12, 11] }, // Superior Direito
  { id: 2, teeth: [21, 22, 23, 24, 25, 26, 27, 28] }, // Superior Esquerdo
  { id: 4, teeth: [48, 47, 46, 45, 44, 43, 42, 41] }, // Inferior Direito
  { id: 3, teeth: [31, 32, 33, 34, 35, 36, 37, 38] }, // Inferior Esquerdo
]

export function TeethSelector({ value, onChange, arches = [], onArchesChange }: Props) {
  const toggleTooth = (tooth: number) => {
    if (value.includes(tooth)) {
      onChange(value.filter((t) => t !== tooth))
    } else {
      onChange([...value, tooth].sort())
    }
  }

  const toggleArch = (arch: string) => {
    if (!onArchesChange) return
    if (arches.includes(arch)) {
      onArchesChange(arches.filter((a) => a !== arch))
    } else {
      onArchesChange([...arches, arch])
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center bg-background p-4 rounded-lg border w-full overflow-x-auto">
      {onArchesChange && (
        <div className="flex flex-col sm:flex-row gap-4 mb-2 w-full justify-center items-center pb-4 border-b border-primary/10">
          <span className="text-sm font-medium text-muted-foreground mr-2">Arco Total:</span>
          <Button
            type="button"
            variant={arches.includes('MAXILA') ? 'default' : 'outline'}
            onClick={() => toggleArch('MAXILA')}
            size="sm"
            className="w-32"
          >
            MAXILA
          </Button>
          <Button
            type="button"
            variant={arches.includes('MANDIBULA') ? 'default' : 'outline'}
            onClick={() => toggleArch('MANDIBULA')}
            size="sm"
            className="w-32"
          >
            MANDÍBULA
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2 min-w-max">
        {/* Superior */}
        <div className="flex justify-center gap-6 border-b-2 border-primary/20 pb-2">
          <div className="flex gap-1 border-r-2 border-primary/20 pr-4">
            {quadrants[0].teeth.map((t) => (
              <ToothBtn key={t} t={t} selected={value.includes(t)} onClick={() => toggleTooth(t)} />
            ))}
          </div>
          <div className="flex gap-1 pl-2">
            {quadrants[1].teeth.map((t) => (
              <ToothBtn key={t} t={t} selected={value.includes(t)} onClick={() => toggleTooth(t)} />
            ))}
          </div>
        </div>
        {/* Inferior */}
        <div className="flex justify-center gap-6 pt-2">
          <div className="flex gap-1 border-r-2 border-primary/20 pr-4">
            {quadrants[2].teeth.map((t) => (
              <ToothBtn key={t} t={t} selected={value.includes(t)} onClick={() => toggleTooth(t)} />
            ))}
          </div>
          <div className="flex gap-1 pl-2">
            {quadrants[3].teeth.map((t) => (
              <ToothBtn key={t} t={t} selected={value.includes(t)} onClick={() => toggleTooth(t)} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Clique nos elementos para selecionar (Odontograma FDI)
      </p>
    </div>
  )
}

function ToothBtn({ t, selected, onClick }: { t: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-8 h-10 flex flex-col items-center justify-center rounded text-xs font-medium transition-all shadow-sm border',
        selected
          ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-md'
          : 'bg-muted/50 text-foreground hover:bg-muted',
      )}
    >
      <span className="opacity-50 text-[10px] mb-0.5">{Math.floor(t / 10)}</span>
      <span>{t % 10}</span>
    </button>
  )
}
