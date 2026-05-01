import { ReactNode, useId } from "react";
import Modal from "@/components/ui/Modal";

type ActionModalTone = "danger" | "primary" | "success" | "neutral";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  eyebrow?: string;
  tone?: ActionModalTone;
  footer?: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  panelClassName?: string;
}

const toneStyles: Record<
  ActionModalTone,
  { iconWrap: string; eyebrow: string }
> = {
  danger: {
    iconWrap: "bg-[#ffd9d5] text-[#c81e1e]",
    eyebrow: "text-[#b42318]",
  },
  primary: {
    iconWrap: "bg-[#dfe7ff] text-[#0b4fd6]",
    eyebrow: "text-[#2445db]",
  },
  success: {
    iconWrap: "bg-[#dff7e8] text-[#157f3d]",
    eyebrow: "text-[#157f3d]",
  },
  neutral: {
    iconWrap: "bg-[#eef1ff] text-[#364152]",
    eyebrow: "text-[#5b6275]",
  },
};

const ActionModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  eyebrow,
  tone = "primary",
  footer,
  children,
  showCloseButton = false,
  closeOnOverlayClick = true,
  panelClassName,
}: ActionModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const activeTone = toneStyles[tone];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
      panelClassName={panelClassName}
    >
      <div className="px-7 pb-8 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-11">
        {icon ? (
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${activeTone.iconWrap}`}
          >
            {icon}
          </div>
        ) : null}

        {eyebrow ? (
          <p
            className={`mt-7 text-[0.72rem] font-bold uppercase tracking-[0.24em] ${activeTone.eyebrow}`}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2
          id={titleId}
          className="mt-7 font-auth-headline text-[2rem] font-bold tracking-[-0.05em] text-[#11182d] sm:text-[2.25rem]"
        >
          {title}
        </h2>

        {description ? (
          <div
            id={descriptionId}
            className="mx-auto mt-5 max-w-[34rem] font-auth-body text-base leading-8 text-[#434655] sm:text-lg"
          >
            {description}
          </div>
        ) : null}

        {children ? <div className="mt-7">{children}</div> : null}
      </div>

      {footer ? (
        <div className="border-t border-[#edf1ff] bg-[#f4f6ff] px-7 py-6 sm:px-8">
          {footer}
        </div>
      ) : null}
    </Modal>
  );
};

export default ActionModal;
