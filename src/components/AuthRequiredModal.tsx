import Link from "next/link";
import { Heart } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import ActionModal from "@/components/ui/ActionModal";

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
  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Account Required"
      title={title}
      tone="primary"
      showCloseButton
      icon={<Heart className="h-10 w-10" strokeWidth={1.8} />}
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
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
      }
    />
  );
};

export default AuthRequiredModal;
