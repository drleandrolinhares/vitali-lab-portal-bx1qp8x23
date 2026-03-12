import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isNormalCase = className?.includes('normal-case') || false
      if (!isNormalCase && type !== 'password' && type !== 'email' && type !== 'url') {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        const val = e.target.value
        const upper = val.toUpperCase()
        if (val !== upper) {
          e.target.value = upper
          if (
            start !== null &&
            end !== null &&
            (type === 'text' || type === undefined || type === 'search' || type === 'tel')
          ) {
            try {
              e.target.setSelectionRange(start, end)
            } catch (err) {
              // Ignore error on elements that don't support setSelectionRange
            }
          }
        }
      }
      if (onChange) onChange(e)
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          !className?.includes('normal-case') &&
            type !== 'password' &&
            type !== 'email' &&
            type !== 'url' &&
            'uppercase',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
