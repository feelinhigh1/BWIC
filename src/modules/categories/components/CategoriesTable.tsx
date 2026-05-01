import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { APP_ROUTES } from "@/config/routes";
import { showApiErrorToast, showSuccessToast } from "@/lib/toast";
import { deleteCategory, getCategories } from "@/modules/categories/api";
import type { CategorySummary } from "@/modules/categories/types";
import {
  Building2,
  Eye,
  Pencil,
  Plus,
  Shapes,
  Trash2,
  type LucideIcon,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-US");

const formatDisplayName = (value: string): string =>
  value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join(" ");

const formatCategoryReference = (id: number): string =>
  `CAT-${String(id).padStart(3, "0")}`;

const statCardBaseClassName =
  "rounded-[1.75rem] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(93,105,155,0.08)] ring-1 ring-[#edf1ff] sm:px-7 sm:py-7";

const actionButtonClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-[#004ac6]/12";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className={statCardBaseClassName}>
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#0b4fd6]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-[#333e5f]">
        {label}
      </p>
      <p className="mt-5 text-[2.3rem] font-bold tracking-[-0.04em] text-[#111a32]">
        {numberFormatter.format(value)}
      </p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className={`${statCardBaseClassName} animate-pulse overflow-hidden`}
        >
          <div className="mb-7 h-12 w-12 rounded-2xl bg-[#eef3ff]" />
          <div className="h-3 w-32 rounded-full bg-[#edf1ff]" />
          <div className="mt-5 h-10 w-24 rounded-full bg-[#edf1ff]" />
        </div>
      ))}
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgba(85,92,141,0.08)] ring-1 ring-[#edf1ff]">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full">
          <thead className="bg-[#eef1ff]">
            <tr>
              {["ID", "Name", "Property Count", "Actions"].map((label) => (
                <th
                  key={label}
                  className="px-6 py-5 text-left text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#2c3654] sm:px-8"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-[#eef2ff] last:border-b-0"
              >
                <td className="px-6 py-7 sm:px-8">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-[#eef1ff]" />
                </td>
                <td className="px-6 py-7 sm:px-8">
                  <div className="h-5 w-40 animate-pulse rounded-full bg-[#eef1ff]" />
                </td>
                <td className="px-6 py-7 sm:px-8">
                  <div className="h-9 w-32 animate-pulse rounded-full bg-[#dce5ff]" />
                </td>
                <td className="px-6 py-7 sm:px-8">
                  <div className="flex justify-end gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-[#eef1ff]" />
                    <div className="h-10 w-10 animate-pulse rounded-full bg-[#eef1ff]" />
                    <div className="h-10 w-10 animate-pulse rounded-full bg-[#fee7e7]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CategoriesTable() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<CategorySummary | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await getCategories();
      const sortedCategories = [
        ...(Array.isArray(response) ? response : []),
      ].sort((left, right) => left.id - right.id);

      setCategories(sortedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showApiErrorToast(
        error,
        "Unable to load categories right now. Please make sure the backend is running and try again.",
        { id: "categories-load-error" },
      );
      setErrorMessage(
        "Unable to load categories right now. Please make sure the backend is running and try again.",
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const totalProperties = useMemo(
    () =>
      categories.reduce(
        (sum, category) => sum + (Number(category.propertyCount) || 0),
        0,
      ),
    [categories],
  );

  const openCategoryDetails = (categoryId: number) => {
    void router.push(APP_ROUTES.adminCategoryDetail(categoryId));
  };

  const openCategoryEdit = (categoryId: number) => {
    void router.push(APP_ROUTES.adminEditCategory(categoryId));
  };

  const openCategoryCreate = () => {
    void router.push(APP_ROUTES.adminCreateCategory);
  };

  const handleDeleteCategory = async () => {
    if (!pendingDeleteCategory) {
      return;
    }

    setDeletingId(pendingDeleteCategory.id);

    try {
      await deleteCategory(pendingDeleteCategory.id);
      setCategories((previous) =>
        previous.filter((item) => item.id !== pendingDeleteCategory.id),
      );
      setPendingDeleteCategory(null);
      showSuccessToast("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      showApiErrorToast(error, "Failed to delete category. Please try again.", {
        id: "category-delete-error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(118,126,255,0.12),transparent_28%),linear-gradient(180deg,#f7f5ff_0%,#f9f8ff_100%)] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-auth-headline text-[3.25rem] font-extrabold tracking-[-0.06em] text-[#101933] sm:text-[4.4rem]">
              Categories
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#3a4463] sm:text-xl">
              Manage property categories and view category-wise listings.
            </p>
          </div>

          <div className="xl:pt-16">
            <button
              type="button"
              onClick={openCategoryCreate}
              className="inline-flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#0a51d9_0%,#5145e5_100%)] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_35px_rgba(45,74,202,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(45,74,202,0.34)] focus:outline-none focus:ring-4 focus:ring-[#0a51d9]/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/35 bg-white/12">
                <Plus className="h-4 w-4" />
              </span>
              Add Category
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:max-w-4xl">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <>
              <StatCard
                icon={Shapes}
                label="Total Categories"
                value={categories.length}
              />
              <StatCard
                icon={Building2}
                label="Total Properties"
                value={totalProperties}
              />
            </>
          )}
        </div>
        <div className="mt-8">
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgba(85,92,141,0.08)] ring-1 ring-[#edf1ff]">
              {errorMessage ? (
                <div className="px-6 py-10 sm:px-8">
                  <div className="rounded-[1.5rem] border border-[#ffd7d7] bg-[#fff7f7] px-6 py-6 text-[#922828]">
                    <p className="text-lg font-semibold">Unable to load data</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6">
                      {errorMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => void fetchCategories()}
                      className="mt-5 inline-flex items-center rounded-full border border-[#f0b1b1] bg-white px-4 py-2 text-sm font-semibold text-[#922828] transition hover:bg-[#fff1f1]"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex min-h-[18rem] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef3ff] text-[#0b4fd6]">
                    <Shapes className="h-7 w-7" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-[#18213b]">
                    No categories found
                  </h2>
                  <p className="mt-3 max-w-lg text-base leading-7 text-[#667089]">
                    Add a new category to start organizing property listings.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full">
                    <thead className="bg-[#eef1ff]">
                      <tr>
                        <th className="px-6 py-5 text-left text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#2c3654] sm:px-8">
                          ID
                        </th>
                        <th className="px-6 py-5 text-left text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#2c3654] sm:px-8">
                          Name
                        </th>
                        <th className="px-6 py-5 text-left text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#2c3654] sm:px-8">
                          Property Count
                        </th>
                        <th className="px-6 py-5 text-right text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#2c3654] sm:px-8">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef2ff]">
                      {categories.map((category) => {
                        const isDeleting = deletingId === category.id;

                        return (
                          <tr
                            key={category.id}
                            onClick={() => openCategoryDetails(category.id)}
                            className="cursor-pointer transition hover:bg-[#f8f9ff]"
                          >
                            <td className="px-6 py-7 text-base font-semibold text-[#1a233d] sm:px-8">
                              {formatCategoryReference(category.id)}
                            </td>
                            <td className="px-6 py-7 sm:px-8">
                              <span className="text-lg font-semibold text-[#141d34] sm:text-xl">
                                {formatDisplayName(category.name)}
                              </span>
                            </td>
                            <td className="px-6 py-7 sm:px-8">
                              <span className="inline-flex rounded-full bg-[#d9e3ff] px-4 py-2 text-sm font-semibold text-[#0b4fd6]">
                                {numberFormatter.format(category.propertyCount)}{" "}
                                {Number(category.propertyCount) === 1
                                  ? "Property"
                                  : "Properties"}
                              </span>
                            </td>
                            <td className="px-6 py-7 sm:px-8">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openCategoryDetails(category.id);
                                  }}
                                  aria-label={`View ${formatDisplayName(category.name)}`}
                                  className={`${actionButtonClassName} border-[#dbe4ff] bg-[#f3f6ff] text-[#0b4fd6] hover:border-[#c2d0ff] hover:bg-[#eaf0ff]`}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openCategoryEdit(category.id);
                                  }}
                                  aria-label={`Edit ${formatDisplayName(category.name)}`}
                                  className={`${actionButtonClassName} border-[#e4e8f8] bg-white text-[#26304c] hover:border-[#d1daf8] hover:bg-[#f6f8ff]`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setPendingDeleteCategory(category);
                                  }}
                                  aria-label={`Delete ${formatDisplayName(category.name)}`}
                                  disabled={isDeleting}
                                  className={`${actionButtonClassName} ${
                                    isDeleting
                                      ? "cursor-not-allowed border-[#ffdcdc] bg-[#fff3f3] text-[#dd6b6b]"
                                      : "border-[#ffd9d9] bg-[#fff5f5] text-[#c43d3d] hover:border-[#ffbcbc] hover:bg-[#ffecec]"
                                  }`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingDeleteCategory)}
        onClose={() => {
          if (deletingId === null) {
            setPendingDeleteCategory(null);
          }
        }}
        onConfirm={() => void handleDeleteCategory()}
        loading={deletingId !== null}
        loadingLabel="Deleting..."
        confirmLabel="Delete"
        icon={<Trash2 className="h-14 w-14" />}
        title="Delete Category?"
        description={
          pendingDeleteCategory ? (
            <>
              You are about to permanently delete the{" "}
              <span className="font-semibold text-[#11182d]">
                “{formatDisplayName(pendingDeleteCategory.name)}”
              </span>{" "}
              category. This action cannot be undone and may affect associated
              properties within the portfolio.
            </>
          ) : undefined
        }
      />
    </div>
  );
}
