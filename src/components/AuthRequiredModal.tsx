import { createPortal } from "react-dom";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";

interface AuthRequiredModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
}

const AuthRequiredModal = ({
  isOpen,
  title = "Sign in to add this property to favourites",
  onClose,
}: AuthRequiredModalProps) => {
  if (!isOpen) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(231,236,255,0.9)] px-4 py-6 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] rounded-[24px] bg-white px-8 py-10 shadow-[0_24px_80px_rgba(19,27,46,0.14)] sm:px-12 sm:py-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2d3650] transition hover:bg-[#f3f5ff]"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#dce2ff]">
            <Heart className="h-11 w-11 text-[#0b46cf]" strokeWidth={1.8} />
          </div>

          <p className="mt-10 text-[12px] font-medium uppercase tracking-[0.28em] text-[#243462]">
            Account Required
          </p>

          <h2
            id="auth-required-title"
            className="mt-5 max-w-[360px] font-auth-headline text-[36px] font-bold leading-[1.08] tracking-[-0.05em] text-[#11182d] sm:text-[42px]"
          >
            {title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href={APP_ROUTES.register}
            className="inline-flex min-h-14 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#0b46cf_0%,#4b41e1_100%)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_28px_rgba(11,70,207,0.22)] transition hover:brightness-[1.04]"
            onClick={onClose}
          >
            Sign Up
          </Link>
          <Link
            href={APP_ROUTES.login}
            className="inline-flex min-h-14 items-center justify-center rounded-[10px] border border-[#e1e6fb] bg-[#f4f6ff] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#11182d] transition hover:border-[#c6d1ff] hover:bg-[#eef2ff]"
            onClick={onClose}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AuthRequiredModal;
