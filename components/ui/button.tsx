"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm hover:shadow-md",
        outline:
          "border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white active:scale-[0.98]",
        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        link:
          "text-red-600 underline-offset-4 hover:underline p-0 h-auto",
        white:
          "bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.98] shadow-sm",
        "outline-white":
          "border border-white text-white hover:bg-white hover:text-gray-900 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm rounded-sm",
        sm: "h-9 px-4 py-2 text-xs rounded-sm",
        lg: "h-13 px-8 py-3 text-base rounded-sm",
        xl: "h-14 px-10 py-3.5 text-base rounded-sm",
        icon: "h-10 w-10 rounded-sm",
        "icon-sm": "h-8 w-8 rounded-sm",
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
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
