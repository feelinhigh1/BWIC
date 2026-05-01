"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/admin/Table";
import { APP_ROUTES } from "@/config/routes";
import { showApiErrorToast, showSuccessToast } from "@/lib/toast";
import { getCategory } from "@/modules/categories/api";
import { deleteProperty, getProperties } from "@/modules/properties/api";
import {
  formatPropertyTableRows,
  PropertyTableRow,
} from "@/modules/properties/table-rows";
import type { CategoryDetail } from "@/modules/categories/types";

interface CategoryState extends CategoryDetail {
  properties: PropertyTableRow[];
}

export default function CategoryPropertiesPage() {
  const router = useRouter();
  const { id } = router.query;

  const [category, setCategory] = useState<CategoryState | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteRow, setPendingDeleteRow] =
    useState<PropertyTableRow | null>(null);

  useEffect(() => {
    if (id) fetchCategoryProperties();
  }, [id]);

  const fetchCategoryProperties = async () => {
    try {
      const [data, propertiesPayload] = await Promise.all([
        getCategory(String(id)),
        getProperties({ categoryId: String(id) }),
      ]);

      const cleanedProperties = formatPropertyTableRows(propertiesPayload.data ?? []);

      setCategory({
        ...data,
        properties: cleanedProperties,
      });
    } catch (err) {
      console.error("Error fetching category properties:", err);
      showApiErrorToast(
        err,
        "Unable to load the category properties right now.",
        { id: "category-properties-load-error" },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row: PropertyTableRow) =>
    console.log("Property clicked:", row);

  const handleEdit = (row: PropertyTableRow) =>
    router.push(APP_ROUTES.adminEditProperty(row.id));

  const handleDelete = async () => {
    if (!pendingDeleteRow) {
      return;
    }

    try {
      setDeletingId(pendingDeleteRow.id);
      await deleteProperty(pendingDeleteRow.id);
      setPendingDeleteRow(null);
      showSuccessToast("Property deleted successfully.");
      void fetchCategoryProperties();
    } catch (err) {
      console.error("Failed to delete property:", err);
      showApiErrorToast(
        err,
        "We couldn't delete this property right now. Please try again in a moment.",
        { id: "category-property-delete-error" },
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (!category)
    return (
      <p className="text-center mt-10 text-gray-600">Category not found.</p>
    );

  return (
    <div className="p-6 pt-15">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold mb-4 capitalize">
          Category: {category.name}
        </h2>
        <button
          className="text-l font-bold text-white bg-gray-500 px-4 py-2 rounded hover:cursor-pointer"
          onClick={() => router.back()}
        >
          ← Back
        </button>
      </div>

      {category.properties.length > 0 ? (
        <Table<PropertyTableRow>
          data={category.properties}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={(row) => setPendingDeleteRow(row)}
        />
      ) : (
        <p className="text-gray-600 italic text-center">
          No properties available for this category.
        </p>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingDeleteRow)}
        onClose={() => {
          if (deletingId === null) {
            setPendingDeleteRow(null);
          }
        }}
        onConfirm={() => void handleDelete()}
        loading={deletingId !== null}
        loadingLabel="Deleting..."
        confirmLabel="Delete Property"
        icon={<Trash2 className="h-14 w-14" />}
        title="Delete Property?"
        description={
          pendingDeleteRow ? (
            <>
              You are about to permanently delete the property{" "}
              <span className="font-semibold text-[#11182d]">
                “{pendingDeleteRow.title}”
              </span>
              . This action cannot be undone.
            </>
          ) : undefined
        }
      />
    </div>
  );
}
