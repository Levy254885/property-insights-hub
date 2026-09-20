import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Logo orange — primary brand action */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        bronze: "bg-bronze text-bronze-foreground hover:bg-bronze/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-secondary hover:border-bronze",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        onImage:
          "bg-background/90 text-foreground backdrop-blur-sm hover:bg-background border border-border/60",
        link: "text-bronze underline underline-offset-4 decoration-bronze/40 hover:decoration-bronze",
        /* Magenta accent for secondary emphasis (logo tagline colour) */
        magenta: "bg-magenta text-magenta-foreground hover:bg-magenta/90",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-7 text-[0.9375rem]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
