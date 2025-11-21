import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#401903] text-white hover:bg-[#2e1302]",

        outline:
          "border border-[#401903] text-[#401903] hover:bg-[#faf6f4]",

        secondary:
          "bg-[#f5eee9] text-[#401903] hover:bg-[#e8ddd6]",

        ghost:
          "hover:bg-[#f7f2ef] text-[#401903]",
      },

      size: {
        default: "h-14 px-6 text-lg",

        sm: "h-10 px-4 text-sm",
        lg: "h-16 px-8 text-xl",

        icon: "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>