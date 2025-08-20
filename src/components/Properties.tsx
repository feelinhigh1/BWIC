// pages/properties/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getProperties } from "@/pages/api/rest_api";
import { baseUrl } from "@/pages/api/rest_api";
import { capitalize } from "@/utils/Capitalize";
import { contactInfo } from "@/utils/ContactInformation";

interface Property {
  id: number;
  title: string;
  categoryId: number;
  location: string;
  price: string;
  roi: string;
  status: string;
  area: string;
  areaNepali?: string;
  distanceFromHighway?: number;
  images: string[];
  description: string;
  category: {
    name: string;
  };
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<
    { id: string; name: string; count: number }[]
  >([]);

  const router = useRouter();
  const propertyListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperties();

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setProperties([]);
          setCategories([{ id: "all", name: "All Properties", count: 0 }]);
          return;
        }

        setProperties(data);

        const categoryMap: Record<string, number> = {};
        data.forEach((property: Property) => {
          const name = property.category?.name || "Unknown";
          categoryMap[name] = (categoryMap[name] || 0) + 1;
        });

        const dynamicCategories = Object.entries(categoryMap).map(
          ([name, count]) => ({
            id: name,
            name,
            count,
          })
        );

        setCategories([
          { id: "all", name: "All Properties", count: data.length },
          ...dynamicCategories,
        ]);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchData();
  }, []);

  const filteredProperties =
    selectedCategory === "all"
      ? properties
      : properties.filter((p) => p.category?.name === selectedCategory);

  const handleScrollToProperties = () => {
    setSelectedCategory("all");
    propertyListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "text-green-600";
      case "sold":
        return "text-red-600";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-slate-600";
    }
  };

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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full border font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50"
              }`}
            >
              {capitalize(cat.name)} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div
        ref={propertyListRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => router.push(`/properties/${property.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
          >
            {property.images?.length > 0 && (
              <img
                src={`${baseUrl}/${property.images[0]}`}
                alt={property.title}
                className="w-full h-52 object-cover rounded-xl mb-4"
              />
            )}
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {property.title}
            </h3>
            <p className="text-sm text-slate-500 mb-2">{property.location}</p>
            <p className="text-slate-600 text-sm mb-4 truncate">
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
              <div>
                <p className={`font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </p>
                <p className="text-xs text-slate-500">Status</p>
              </div>
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
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            <a href={`tel: ${contactInfo.phone}`}>Make a Call</a>
          </button>
          <button
            onClick={handleScrollToProperties}
            className="border border-slate-300 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default Properties;
