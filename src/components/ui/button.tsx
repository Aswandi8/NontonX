import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/85 hover:shadow-md active:scale-[0.98]",

        outline:
          "flex items-center justify-center gap-2 border border-border bg-background text-foreground hover:bg-muted hover:border-border transition py-2.5 rounded-lg text-sm",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "bg-transparent text-foreground hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        link: "bg-transparent text-primary underline-offset-4 hover:bg-transparent hover:text-primary/80 hover:underline",

        /*
         * Icon tanpa tampilan button.
         *
         * Digunakan untuk icon interaktif seperti:
         * - Show / hide password
         * - Close
         * - Search
         * - More actions
         *
         * Tetap menggunakan Button agar accessibility
         * dan keyboard interaction tetap terjaga.
         */
        "icon-plain":
          "rounded-md border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground active:translate-y-0 active:scale-100 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring/50",
      },

      size: {
        default: "h-11 gap-1.5 px-4 py-2.5",

        xs: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",

        sm: "h-9 gap-1 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",

        lg: "h-12 gap-1.5 px-6 text-base",

        icon: "size-10 p-0",

        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),10px)] p-0 [&_svg:not([class*='size-'])]:size-3",

        "icon-sm": "size-9 rounded-[min(var(--radius-md),12px)] p-0",

        "icon-lg": "size-12 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
