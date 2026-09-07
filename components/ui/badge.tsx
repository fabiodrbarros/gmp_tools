import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 border border-gray-200",
        red: "bg-red-50 text-red-700 border border-red-200",
        green: "bg-green-50 text-green-700 border border-green-200",
        yellow: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        blue: "bg-blue-50 text-blue-700 border border-blue-200",
        black: "bg-gray-900 text-white border border-gray-900",
        outline: "border border-gray-300 text-gray-600 bg-white",
      },
      size: {
        default: "px-2.5 py-1 text-xs rounded-sm",
        sm: "px-2 py-0.5 text-[10px] rounded-sm",
        lg: "px-3 py-1.5 text-sm rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
