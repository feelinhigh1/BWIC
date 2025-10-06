"use client";

import React, { useState, useEffect } from "react";

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
  description: "",
};

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories/");
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      const totalFiles = formData.images.length + selectedFiles.length;
      if (totalFiles > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }));

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });

    setPreviews((prev) => {
      const updatedPreviews = [...prev];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

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

    if (
      formData.areaNepali &&
      !/^\d+-\d+-\d+-\d+(\.\d+)?$/.test(formData.areaNepali)
    ) {
      newErrors.areaNepali = "Invalid format (e.g., 0-0-0-0.0)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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

      const res = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to create property");
      const data = await res.json();

      alert("Property submitted successfully!");
      console.log("Created property:", data);

      setFormData(initialFormData);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      alert("Failed to submit property");
    }
  };

  return (
    <div className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New Property
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
              Price
            </label>
            <input
              type="text"
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
            <label className="block font-medium text-gray-700 mb-1">ROI</label>
            <input
              type="text"
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
              type="text"
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
              Area (Nepali format)
            </label>
            <input
              type="text"
              name="areaNepali"
              value={formData.areaNepali}
              onChange={handleChange}
              placeholder="e.g. 0-0-0-0.0"
              className="w-full border rounded px-3 py-2"
            />
            {errors.areaNepali && (
              <p className="text-sm text-red-500 mt-1">{errors.areaNepali}</p>
            )}
          </div>

          {/* Distance From Highway */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Distance From Highway (m)
            </label>
            <input
              type="number"
              name="distanceFromHighway"
              value={formData.distanceFromHighway ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
              className="w-full"
              disabled={formData.images.length >= 10}
            />
            <div className="mt-3 flex flex-wrap gap-4">
              {previews.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${i}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
