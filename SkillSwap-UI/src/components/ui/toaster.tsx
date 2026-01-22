import { useEffect } from "react";
import { Toast, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.open === false) {
        dismiss(toast.id);
      }
    });
  }, [toasts, dismiss]);

  if (!toasts.length) return null;

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={toast.open}
          onOpenChange={(open) => {
            if (!open) dismiss(toast.id);
          }}
          title={toast.title}
          description={toast.description}
          action={toast.action}
        />
      ))}
    </ToastViewport>
  );
};
