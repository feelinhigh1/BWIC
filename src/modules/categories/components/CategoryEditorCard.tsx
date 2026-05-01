import { Loader2, Shapes, type LucideIcon } from "lucide-react";
import type { FormEvent } from "react";

interface CategoryEditorCardProps {
  title: string;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  errorMessage?: string;
  successMessage?: string;
  submitting?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  inputPlaceholder?: string;
  icon?: LucideIcon;
  submitIcon?: LucideIcon;
}

const CategoryEditorCard = ({
  title,
  name,
  onNameChange,
  onSubmit,
  submitLabel,
  submittingLabel,
  errorMessage,
  successMessage,
  submitting = false,
  loading = false,
  loadingMessage = "Loading category details...",
  inputPlaceholder = "Enter category name",
  icon: HeaderIcon = Shapes,
  submitIcon: SubmitIcon,
}: CategoryEditorCardProps) => {
  return (
    <section className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(118,126,255,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(61,97,242,0.08),transparent_26%),linear-gradient(180deg,#f7f5ff_0%,#f9f8ff_100%)] px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute left-[8%] top-16 h-32 w-32 rounded-full bg-[#dfe6ff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[10%] h-40 w-40 rounded-full bg-[#e8ddff] blur-3xl" />

      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-[rgba(255,255,255,0.96)] shadow-[0_32px_90px_rgba(85,92,141,0.16)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(221,229,255,0.8)_0%,rgba(255,255,255,0)_100%)]" />

          <div className="relative px-6 py-8 sm:px-9 sm:py-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.7rem] bg-[linear-gradient(135deg,#edf2ff_0%,#dfe8ff_100%)] text-[#0b4fd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_34px_rgba(11,79,214,0.12)]">
              <HeaderIcon className="h-8 w-8" />
            </div>

            <h1 className="mt-6 text-center font-auth-headline text-[2.45rem] font-extrabold tracking-[-0.06em] text-[#111a32] sm:text-[2.9rem]">
              {title}
            </h1>

            {errorMessage ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#93000a] shadow-[0_10px_24px_rgba(147,0,10,0.06)]">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#dbe1ff] bg-[#eef0ff] px-4 py-3 text-sm font-medium text-[#004ac6] shadow-[0_10px_24px_rgba(0,74,198,0.08)]">
                {successMessage}
              </div>
            ) : null}

            {loading ? (
              <div className="mt-7 rounded-[1.75rem] border border-[#dfe5fb] bg-[#f7f9ff] px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0b4fd6] shadow-[0_12px_28px_rgba(11,79,214,0.12)]">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <p className="mt-5 text-base font-semibold text-[#2a3553]">
                  {loadingMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-7 space-y-6">
                <label className="block">
                  <span className="mb-3 block text-[0.82rem] font-extrabold uppercase tracking-[0.2em] text-[#2a3553]">
                    Category Name
                  </span>
                  <div className="rounded-[1.6rem] border border-[#d7def5] bg-[#f7f9ff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus-within:border-[#a9bbff] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,74,198,0.08)]">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(event) => onNameChange(event.target.value)}
                      className="w-full rounded-[1.1rem] border-0 bg-transparent px-4 py-3 text-[1.08rem] font-medium text-[#131b2e] outline-none placeholder:text-[#8a94ad]"
                      placeholder={inputPlaceholder}
                      autoComplete="off"
                      required
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-[linear-gradient(135deg,#004ac6_0%,#2f63eb_52%,#4b41e1_100%)] px-6 py-4 text-[1.02rem] font-bold text-white shadow-[0_18px_40px_rgba(30,64,175,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(30,64,175,0.34)] focus:outline-none focus:ring-4 focus:ring-[#004ac6]/16 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : SubmitIcon ? (
                    <SubmitIcon className="h-5 w-5" />
                  ) : null}
                  {submitting ? submittingLabel : submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryEditorCard;
