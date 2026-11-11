import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800 border border-zinc-800",
        secondary:
          "bg-white text-zinc-900 border border-zinc-200 shadow-xs hover:bg-zinc-50 hover:border-zinc-300",
        outline:
          "border border-zinc-200 bg-transparent text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950",
        ghost:
          "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
        destructive:
          "bg-zinc-900 text-red-400 border border-zinc-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-900/60",
        subtle:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 border border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 rounded-md px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-base",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
