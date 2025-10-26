import React, { useEffect, useState } from "react";
import Table from "../Table"; // Adjust path as needed
import router from "next/router";

interface Category {
  id: number;
  name: string;
}

interface Property {
  id: number;
  title: string;
  categoryId: number;
  category?: Category;
  location: string;
  price: string;
  roi: string;
  status: string;
  area: string;
  areaNepali?: string;
  distanceFromHighway?: number;
  images: string[];
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function PropertyTable() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/properties")
      .then((res) => res.json())
      .then((data: Property[]) => {
        // Optional: remove unwanted fields like createdAt and updatedAt
        const cleaned: any = data.map(
          ({ createdAt, updatedAt, categoryId, description, ...rest }) => ({
            ...rest,
            area: `${rest.area} sq ft`,
            distanceFromHighway: `${rest.distanceFromHighway}m`,
            roi: `${rest.roi}%`,
            price: `Nrs. ${rest.price} per aana`,
            category: rest.category?.name ?? "N/A",
            images: `${rest.images.length} image(s)`,
          })
        );

        setProperties(cleaned);
      })
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, []);

  const handleRowClick = (row: Property) => console.log("Row clicked:", row);
  const handleEdit = (row: Property) =>
    router.push(`/admin/editProperty/${row.id}`);
  const handleDelete = async (row: Property) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/properties/${row.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete property");
      alert("Property deleted successfully");
      router.reload();
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property");
    }
  };

  return (
    <div className="p-6 pt-15">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold mb-4">Property List</h2>
        <button
          className="text-l font-bold text-white bg-green-500 px-4 py-2 rounded hover:cursor-pointer"
          onClick={() => router.push("/admin/addProperty")}
        >
          + Add Property
        </button>
      </div>

      <Table<Property>
        data={properties}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
