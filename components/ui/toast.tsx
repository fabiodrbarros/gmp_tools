"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen flex-col gap-2 w-[380px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

type ToastVariant = "default" | "success" | "error" | "info";

const toastVariants: Record<ToastVariant, string> = {
  default: "border border-gray-200 bg-white text-gray-900",
  success: "border border-green-200 bg-green-50 text-green-900",
  error: "border border-red-200 bg-red-50 text-red-900",
  info: "border border-red-200 bg-red-50 text-red-900",
};

const toastIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />,
  info: <Info className="h-4 w-4 text-red-600 shrink-0" />,
};

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
}

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = "default", title, description, children, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden p-4 shadow-lg",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[swipe=end]:animate-out data-[state=closed]:fade-out-80",
        "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
        toastVariants[variant],
        className
      )}
      {...props}
    >
      {toastIcons[variant]}
      <div className="flex-1 min-w-0">
        {title && (
          <ToastPrimitive.Title className="text-sm font-semibold">
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className="mt-0.5 text-xs opacity-80">
            {description}
          </ToastPrimitive.Description>
        )}
        {children}
      </div>
      <ToastPrimitive.Close className="shrink-0 opacity-40 hover:opacity-100 transition-opacity">
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
);
Toast.displayName = "Toast";

export { Toast, ToastProvider, ToastViewport };
export type { ToastVariant };
