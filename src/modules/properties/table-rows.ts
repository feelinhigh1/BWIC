import type { PropertySummary } from "@/modules/properties/types";

export interface PropertyTableRow {
  id: number;
  title: string;
  location: string;
  price: string;
  roi: string;
  status: string;
  area: string;
  areaNepali?: string;
  distanceFromHighway: string;
  images: string;
  category?: string;
}

export const formatPropertyTableRows = (
  properties: PropertySummary[],
): PropertyTableRow[] =>
  properties.map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: `Nrs. ${property.price} `,
    roi: `${property.roi}%`,
    status: property.status,
    area: `${property.area} sq ft`,
    areaNepali: property.areaNepali,
    distanceFromHighway:
      property.distanceFromHighway !== undefined
        ? `${property.distanceFromHighway}m`
        : "N/A",
    images: `${property.images.length} image(s)`,
    category: property.category?.name ?? "N/A",
  }));
