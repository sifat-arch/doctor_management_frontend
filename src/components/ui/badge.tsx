import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-zinc-900 bg-zinc-950 text-white",
        secondary:
          "border border-zinc-200 bg-zinc-100 text-zinc-800",
        outline:
          "border border-zinc-200 text-zinc-700 bg-white",
        subtle:
          "bg-zinc-50 border border-zinc-200/80 text-zinc-600 font-mono text-[11px]",
        dark:
          "bg-zinc-900 text-zinc-100 border border-zinc-800",
        success:
          "bg-zinc-100 border border-zinc-300 text-zinc-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
