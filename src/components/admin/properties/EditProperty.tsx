"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Category {
  id: number;
  name: string;
}

interface PropertyFormData {
  title: string;
  categoryId: number;
  location: string;
  price: string;
  roi: string;
  status: string;
  area: string;
  areaNepali?: string;
  distanceFromHighway?: number;
  images: File[];
  existingImages?: string[];
  description: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  categoryId: 0,
  location: "",
  price: "",
  roi: "",
  status: "",
  area: "",
  areaNepali: "",
  distanceFromHighway: undefined,
  images: [],
  existingImages: [],
  description: "",
};

const EditProperty: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories + property data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [catRes, propRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch(`http://localhost:3000/api/properties/${id}`),
        ]);

        if (!catRes.ok || !propRes.ok) throw new Error("Failed to fetch data");

        const imageBaseUrl = "http://localhost:3000";
        const categories = await catRes.json();
        const property = await propRes.json();

        const existing = (property.images || []).map((img: string) =>
          img.startsWith("http") ? img : `${imageBaseUrl}${img}`
        );

        setCategories(categories);
        setFormData({
          ...initialFormData,
          ...property,
          existingImages: existing,
        });
        setPreviews(existing); // start with existing previews
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle cleanup (revoke blob URLs)
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p && p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
  }, [previews]);

  // Handle text/number inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "distanceFromHighway" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const totalFiles =
      (formData.existingImages?.length || 0) +
      formData.images.length +
      selectedFiles.length;
    if (totalFiles > 10) {
      alert("You can only upload up to 10 images.");
      return;
    }

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image (existing or new)
  const removeImage = (index: number, isExisting = false) => {
    setFormData((prev) => {
      if (isExisting) {
        const updatedExisting = [...(prev.existingImages || [])];
        updatedExisting.splice(index, 1);
        return { ...prev, existingImages: updatedExisting };
      } else {
        const updatedNew = [...prev.images];
        updatedNew.splice(index, 1);
        return { ...prev, images: updatedNew };
      }
    });

    setPreviews((prev) => {
      const updated = [...prev];
      const existingCount = formData.existingImages?.length || 0;
      const previewIndex = isExisting ? index : existingCount + index;
      const urlToRevoke = updated[previewIndex];
      if (urlToRevoke && urlToRevoke.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRevoke);
      }
      updated.splice(previewIndex, 1);
      return updated;
    });
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.roi.trim()) newErrors.roi = "ROI is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("categoryId", String(formData.categoryId));
      form.append("location", formData.location);
      form.append("price", formData.price);
      form.append("roi", formData.roi);
      form.append("status", formData.status);
      form.append("area", formData.area);
      if (formData.areaNepali) form.append("areaNepali", formData.areaNepali);
      if (formData.distanceFromHighway !== undefined)
        form.append(
          "distanceFromHighway",
          String(formData.distanceFromHighway)
        );
      form.append("description", formData.description);

      formData.images.forEach((file) => {
        form.append("images", file);
      });

      if (formData.existingImages && formData.existingImages.length > 0) {
        form.append("existingImages", JSON.stringify(formData.existingImages));
      }

      const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update property");

      alert("Property updated successfully!");
      router.push("/admin/properties");
    } catch (error) {
      console.error(error);
      alert("Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Property
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={loadingCategories}
            >
              <option value={0}>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price per aana
            </label>
            <input
              step={100000}
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">{errors.price}</p>
            )}
          </div>

          {/* ROI */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              ROI (in %)
            </label>
            <input
              type="number"
              name="roi"
              value={formData.roi}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.roi && (
              <p className="text-sm text-red-500 mt-1">{errors.roi}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status}</p>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Area</label>
            <input
              step={10}
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.area && (
              <p className="text-sm text-red-500 mt-1">{errors.area}</p>
            )}
          </div>

          {/* Area Nepali */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Area (R-A-P-D)
            </label>
            <input
              type="text"
              name="areaNepali"
              value={formData.areaNepali}
              onChange={handleChange}
              placeholder="e.g. 0-0-0-0.0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Distance From Highway */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Distance From Highway (m)
            </label>
            <input
              type="number"
              step={100}
              name="distanceFromHighway"
              value={formData.distanceFromHighway ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* --- Image Upload & Preview --- */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Images
            </label>

            {/* Unified Previews */}
            {previews.length > 0 && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previews.map((src, idx) => {
                  const existingCount = formData.existingImages?.length || 0;
                  const isExisting = idx < existingCount;
                  const indexInSource = isExisting ? idx : idx - existingCount;

                  return (
                    <div
                      key={`preview-${idx}`}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(indexInSource, isExisting)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload New */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition
      ${
        formData.images.length + (formData.existingImages?.length || 0) >= 10
          ? "border-gray-300 bg-gray-50 cursor-not-allowed"
          : "border-gray-400 hover:border-yellow-500 bg-gray-50 hover:bg-yellow-50"
      }`}
            >
              <input
                type="file"
                name="images"
                multiple
                id="image-upload"
                onChange={handleImageChange}
                className="hidden"
                disabled={
                  formData.images.length +
                    (formData.existingImages?.length || 0) >=
                  10
                }
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-yellow-600 hover:text-yellow-500 text-center"
              >
                Upload images
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={submitting}
              className={`${
                submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-2 px-6 rounded transition`}
            >
              {submitting ? "Updating..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
