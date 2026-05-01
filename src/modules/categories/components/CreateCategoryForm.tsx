import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { APP_ROUTES } from "@/config/routes";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast";
import { createCategory } from "@/modules/categories/api";
import CategoryEditorCard from "@/modules/categories/components/CategoryEditorCard";
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
      showWarningToast("Category name is required.", {
        id: "category-create-validation",
      });
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createCategory(normalizedName);
      showSuccessToast("Category added successfully.");
      setName("");

      window.setTimeout(() => {
        void router.push(APP_ROUTES.adminCategories);
      }, 1000);
    } catch (submitError: unknown) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create category";
      setError(errorMessage);
      showErrorToast(errorMessage, { id: "category-create-error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CategoryEditorCard
      title="Add New Category"
      name={name}
      onNameChange={setName}
      onSubmit={handleSubmit}
      errorMessage={error}
      successMessage={success}
      submitting={submitting}
      submitLabel="Add Category"
      submittingLabel="Creating..."
      icon={Shapes}
      submitIcon={Plus}
    />
  );
}
