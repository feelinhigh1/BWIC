import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { toast, type ExternalToast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errors";

type AppToastVariant = "success" | "error" | "info" | "warning";

type AppToastOptions = ExternalToast;

const baseStyle: CSSProperties = {
  maxWidth: "28rem",
  borderRadius: "18px",
  padding: "14px 16px",
  background: "#ffffff",
  color: "#131b2e",
  border: "1px solid #dbe1ff",
  boxShadow: "0 20px 42px rgba(19,27,46,0.14)",
  fontSize: "0.95rem",
  lineHeight: "1.5",
};

const variantStyles: Record<AppToastVariant, CSSProperties> = {
  success: {
    border: "1px solid #dbe5ff",
    background:
      "linear-gradient(180deg, rgba(247, 249, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
  },
  error: {
    border: "1px solid #ffd7d7",
    background: "#fff8f8",
  },
  info: {
    border: "1px solid #dbe5ff",
    background: "#f7f9ff",
  },
  warning: {
    border: "1px solid #ffe2a8",
    background: "#fffaf1",
  },
};

const variantIcons: Record<AppToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-[18px] w-[18px] text-[#157f3d]" />,
  error: <CircleAlert className="h-[18px] w-[18px] text-[#c81e1e]" />,
  info: <Info className="h-[18px] w-[18px] text-[#0b4fd6]" />,
  warning: <TriangleAlert className="h-[18px] w-[18px] text-[#b26a00]" />,
};

const variantDurations: Record<AppToastVariant, number> = {
  success: 4000,
  error: 5000,
  info: 4500,
  warning: 4500,
};

const buildToastOptions = (
  variant: AppToastVariant,
  options?: AppToastOptions,
): ExternalToast => ({
  duration: options?.duration ?? variantDurations[variant],
  ...options,
  icon: options?.icon ?? variantIcons[variant],
  style: {
    ...baseStyle,
    ...variantStyles[variant],
    ...(options?.style ?? {}),
  },
});

const showToast = (
  variant: AppToastVariant,
  message: string,
  options?: AppToastOptions,
) => {
  const toastOptions = buildToastOptions(variant, options);

  if (variant === "success") {
    return toast.success(message, toastOptions);
  }

  if (variant === "error") {
    return toast.error(message, toastOptions);
  }

  if (variant === "info") {
    return toast.info(message, toastOptions);
  }

  return toast.warning(message, toastOptions);
};

export const showSuccessToast = (
  message: string,
  options?: AppToastOptions,
) => showToast("success", message, options);

export const showErrorToast = (
  message: string,
  options?: AppToastOptions,
) => showToast("error", message, options);

export const showInfoToast = (
  message: string,
  options?: AppToastOptions,
) => showToast("info", message, options);

export const showWarningToast = (
  message: string,
  options?: AppToastOptions,
) => showToast("warning", message, options);

export const showApiErrorToast = (
  error: unknown,
  fallback: string,
  options?: AppToastOptions,
) => showErrorToast(getApiErrorMessage(error, fallback), options);

export const dismissToast = (toastId?: string) => toast.dismiss(toastId);
