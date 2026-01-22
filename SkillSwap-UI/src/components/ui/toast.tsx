import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastActionElement = React.ReactElement;

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border bg-background px-4 py-3 text-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        <div className="flex-1">
          {title && <div className="text-sm font-medium">{title}</div>}
          {description && (
            <div className="mt-1 text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        {action ? <div className="ml-2 shrink-0">{action}</div> : null}
      </div>
    );
  },
);

Toast.displayName = "Toast";

interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6",
        className,
      )}
      {...props}
    />
  ),
);

ToastViewport.displayName = "ToastViewport";

export { Toast, ToastViewport };
