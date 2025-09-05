// components/CreatePropertyForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface Category {
  id: number;
  name: string;
}

const CreatePropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    location: "",
    price: "",
    roi: "",
    status: "",
    area: "",
    areaNepali: "",
    distanceFromHighway: "",
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  // ✅ Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories")
      .then((res) => setCategories(res.data as Category[]))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // ✅ Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image selection (limit 10)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }
      setImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  // ✅ Remove selected image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    images.forEach((file) => data.append("images", file));

    try {
      await axios.post("http://localhost:3000/api/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Property created successfully!");
      // router.push("/properties");
    } catch (error: any) {
      console.error(error);
      alert("❌ Failed to create property");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-2xl my-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🏡 Create New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Property Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* ROI + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ROI</label>
            <input
              type="text"
              name="roi"
              value={formData.roi}
              onChange={handleChange}
              placeholder="Return on Investment"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
        </div>

        {/* Area + Area Nepali + Distance */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Area (sq.ft)
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Area (Nepali)
            </label>
            <input
              type="text"
              name="areaNepali"
              value={formData.areaNepali}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Distance from Highway (m)
            </label>
            <input
              type="number"
              name="distanceFromHighway"
              value={formData.distanceFromHighway}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Images (max 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          {/* ✅ Preview with remove option */}
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {images.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Property
        </button>
      </form>
    </div>
  );
};

export default CreatePropertyForm;
