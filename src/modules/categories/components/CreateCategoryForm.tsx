import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { APP_ROUTES } from "@/config/routes";
import { createCategory } from "@/modules/categories/api";
import { Plus, Shapes } from "lucide-react";

export default function CreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const normalizedName = name.trim();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!normalizedName) {
      setError("Category name is required.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createCategory(normalizedName);
      setSuccess("Category created successfully!");
      setName("");

      window.setTimeout(() => {
        void router.push(APP_ROUTES.adminCategories);
      }, 1000);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create category",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(118,126,255,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(61,97,242,0.08),transparent_26%),linear-gradient(180deg,#f7f5ff_0%,#f9f8ff_100%)] px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute left-[8%] top-16 h-32 w-32 rounded-full bg-[#dfe6ff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[10%] h-40 w-40 rounded-full bg-[#e8ddff] blur-3xl" />

      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-[rgba(255,255,255,0.96)] shadow-[0_32px_90px_rgba(85,92,141,0.16)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(221,229,255,0.8)_0%,rgba(255,255,255,0)_100%)]" />

          <div className="relative px-6 py-8 sm:px-9 sm:py-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.7rem] bg-[linear-gradient(135deg,#edf2ff_0%,#dfe8ff_100%)] text-[#0b4fd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_34px_rgba(11,79,214,0.12)]">
              <Shapes className="h-8 w-8" />
            </div>

            <h1 className="mt-6 text-center font-auth-headline text-[2.45rem] font-extrabold tracking-[-0.06em] text-[#111a32] sm:text-[2.9rem]">
              Add New Category
            </h1>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#93000a] shadow-[0_10px_24px_rgba(147,0,10,0.06)]">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 rounded-[1.25rem] border border-[#dbe1ff] bg-[#eef0ff] px-4 py-3 text-sm font-medium text-[#004ac6] shadow-[0_10px_24px_rgba(0,74,198,0.08)]">
                {success}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-7 space-y-6">
              <label className="block">
                <span className="mb-3 block text-[0.82rem] font-extrabold uppercase tracking-[0.2em] text-[#2a3553]">
                  Category Name
                </span>
                <div className="rounded-[1.6rem] border border-[#d7def5] bg-[#f7f9ff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus-within:border-[#a9bbff] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,74,198,0.08)]">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
                    className="w-full rounded-[1.1rem] border-0 bg-transparent px-4 py-3 text-[1.08rem] font-medium text-[#131b2e] outline-none placeholder:text-[#8a94ad]"
                    placeholder="Enter category name"
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
                <Plus className="h-5 w-5" />
                {submitting ? "Creating..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
