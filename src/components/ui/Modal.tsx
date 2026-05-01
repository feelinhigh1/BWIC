import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  describedBy?: string;
  panelClassName?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  labelledBy,
  describedBy,
  panelClassName = "",
  closeOnOverlayClick = true,
  showCloseButton = false,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(236,240,255,0.72)] px-4 py-6 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-[640px] overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(19,27,46,0.14)] ${panelClassName}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2d3650] transition hover:bg-[#f3f5ff]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
