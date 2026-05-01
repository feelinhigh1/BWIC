import { type ReactNode } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  loading?: boolean;
  loadingLabel?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  cancelLabel = "Cancel",
  confirmLabel,
  loading = false,
  loadingLabel,
}: ConfirmModalProps) => {
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={!loading}
      panelClassName="max-w-[34rem] rounded-[1.75rem] shadow-[0_28px_72px_rgba(19,27,46,0.16)]"
    >
      <div className="relative px-5 pb-8 pt-6 text-center sm:px-8 sm:pb-9 sm:pt-7">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1e2942] transition hover:bg-[#f4f6ff] disabled:cursor-not-allowed disabled:opacity-45 sm:right-5 sm:top-5"
          aria-label="Close"
        >
          <X className="h-5 w-5 stroke-[1.9]" />
        </button>

        {icon ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#ff5c63] bg-[#fff4f4] text-[#ff2f3e] shadow-[0_14px_28px_rgba(255,47,62,0.08)]">
            {icon}
          </div>
        ) : null}

        <h2 className="mt-7 font-auth-headline text-[1.8rem] font-semibold tracking-[-0.05em] text-[#16213b] sm:text-[2.1rem]">
          {title}
        </h2>

        {description ? (
          <div className="mx-auto mt-4 max-w-[28rem] font-auth-body text-[1rem] leading-7 text-[#5b6478] sm:text-[1.05rem]">
            {description}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex min-h-[3.75rem] w-full items-center justify-center rounded-full border-2 border-[#0a51d9] bg-white px-6 text-[0.98rem] font-medium text-[#0a51d9] transition hover:bg-[#eef7ff] focus:outline-none focus:ring-4 focus:ring-[#0a51d9]/14 disabled:cursor-not-allowed disabled:opacity-55 sm:min-w-[10.5rem] sm:w-auto"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex min-h-[3.75rem] w-full items-center justify-center rounded-full bg-[#ff2f3e] px-7 text-[0.98rem] font-semibold text-white shadow-[0_18px_32px_rgba(255,47,62,0.22)] transition hover:bg-[#f02232] focus:outline-none focus:ring-4 focus:ring-[#ff2f3e]/18 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[12.5rem] sm:w-auto"
          >
            {loading ? (loadingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
