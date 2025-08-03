import React, { useEffect, useState } from "react";
import { getProperties } from "@/pages/api/rest_api";

interface Property {
  id: number;
  title: string;
  category: string;
  location: string;
  price: string;
  roi: string;
  status: string;
  area: string;
  areaNepali?: string;
  distanceFromHighway?: number;
  image: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Static categories
  const [categories] = useState<Category[]>([
    { id: "all", name: "All Properties", count: 5 },
    { id: "apartment", name: "Apartments", count: 2 },
    { id: "land", name: "Land Plots", count: 3 },
    { id: "commercial", name: "Commercial", count: 1 },
  ]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties =
    selectedCategory === "all"
      ? properties
      : properties.filter((prop) => prop.category === selectedCategory);

  return (
    <section className="bg-slate-800 py-16 px-4">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
          Discover Profitable{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Investment Properties
          </span>{" "}
          in Nepal
        </h2>
        <p className="text-slate-400 text-lg">
          Handpicked real estate opportunities with high returns and growth
          potential — for both new and seasoned investors.
        </p>
        <div className="mt-6 flex justify-center flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full border font-medium transition ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-slate-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex flex-col"
          >
            <div className="text-5xl text-center mb-4">{property.image}</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {property.title}
            </h3>
            <p className="text-sm text-slate-500 mb-2">{property.location}</p>
            <p className="text-slate-600 text-sm mb-4">
              {property.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 mt-auto">
              <div>
                <p className="font-medium">{property.price}</p>
                <p className="text-xs text-slate-500">Price</p>
              </div>
              <div>
                <p className="font-medium">{property.roi}</p>
                <p className="text-xs text-slate-500">Expected ROI</p>
              </div>
              <div>
                <p className="font-medium">{property.area}</p>
                <p className="text-xs text-slate-500">Area (sq ft)</p>
              </div>
              {property.areaNepali && (
                <div>
                  <p className="font-medium">{property.areaNepali}</p>
                  <p className="text-xs text-slate-500">Area (R-A-P-D)</p>
                </div>
              )}
              {property.distanceFromHighway !== undefined && (
                <div>
                  <p className="font-medium">
                    {property.distanceFromHighway} m
                  </p>
                  <p className="text-xs text-slate-500">From Highway</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Ready to Invest?</h3>
        <p className="text-slate-400 max-w-xl mx-auto mb-6">
          Schedule a call with our experts or view all available listings to get
          started.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Make a Call
          </button>
          <button className="border border-slate-300 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default Properties;
