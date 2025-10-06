import React, { useEffect, useState } from "react";
import Table from "./Table"; // Adjust path as needed

interface Category {
  id: number;
  name: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories") // Replace with your actual endpoint
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleRowClick = (row: Category) => console.log("Row clicked:", row);
  const handleEdit = (row: Category) => console.log("Edit clicked:", row);
  const handleDelete = (row: Category) => console.log("Delete clicked:", row);

  return (
    <div className="p-6 pt-15">
      <h2 className="text-2xl font-bold mb-4">Categories List</h2>
      <Table<Category>
        data={categories}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
