import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  // pb-1: Inter's metrics sit cap-heavy labels ~2px low of the flex-centered box — optical compensation
  'inline-flex items-center gap-3 rounded-pill border pb-1 font-medium transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'border-white bg-white text-black hover:bg-transparent hover:text-white',
        ghost: 'border-white/70 bg-white/5 text-white hover:bg-white hover:text-black',
      },
      size: {
        default: 'min-h-14 px-9 text-lg',
        sm: 'min-h-11 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & ButtonVariants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
