import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import CategoryEditorCard from "@/modules/categories/components/CategoryEditorCard";
import { APP_ROUTES } from "@/config/routes";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { getCategory, updateCategory } from "@/modules/categories/api";
import { Pencil } from "lucide-react";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const categoryId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  const fetchCategory = useCallback(async () => {
    if (!categoryId) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const category = await getCategory(categoryId);
      setName(category.name);
    } catch {
      showErrorToast("Failed to load category data", {
        id: "category-load-error",
      });
      setError("Failed to load category data");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!categoryId) {
      setLoading(false);
      setError("Category ID is missing.");
      return;
    }

    void fetchCategory();
  }, [categoryId, fetchCategory, router.isReady]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!categoryId) {
      setError("Category ID is missing.");
      return;
    }

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("Category name is required.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await updateCategory(categoryId, normalizedName);
      showSuccessToast("Category updated successfully.");
      window.setTimeout(() => {
        void router.push(APP_ROUTES.adminCategories);
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update category";
      setError(errorMessage);
      showErrorToast(errorMessage, { id: "category-update-error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CategoryEditorCard
      title="Edit Category"
      name={name}
      onNameChange={setName}
      onSubmit={handleSubmit}
      errorMessage={error === "Category name is required." ? "" : error}
      successMessage={success}
      nameError={error === "Category name is required." ? error : undefined}
      submitting={submitting}
      loading={loading}
      loadingMessage="Loading category details..."
      submitLabel="Update Category"
      submittingLabel="Updating..."
      icon={Pencil}
      submitIcon={Pencil}
    />
  );
};

export default EditCategory;
