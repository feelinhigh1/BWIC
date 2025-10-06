import React, { useEffect, useState } from "react";
import Table from "./Table"; // Adjust path as needed

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
    fetch("http://localhost:3000/api/properties") // Replace with your actual endpoint
      .then((res) => res.json())
      .then((data: Property[]) => {
        // Optional: remove unwanted fields like createdAt and updatedAt
        const cleaned = data.map(({ createdAt, updatedAt, ...rest }) => ({
          ...rest,
          category: rest.category?.name ?? "N/A",
          images: `${rest.images.length} image(s)`,
        }));

        setProperties(cleaned);
      })
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, []);

  const handleRowClick = (row: Property) => console.log("Row clicked:", row);
  const handleEdit = (row: Property) => console.log("Edit clicked:", row);
  const handleDelete = (row: Property) => console.log("Delete clicked:", row);

  return (
    <div className="p-6 pt-15">
      <h2 className="text-2xl font-bold mb-4">Property List</h2>
      <Table<Property>
        data={properties}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
