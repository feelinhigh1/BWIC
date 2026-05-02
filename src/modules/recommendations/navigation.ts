import type { UrlObject } from "url";
import { APP_ROUTES } from "@/config/routes";
import {
  getCoordinatesFromPayload,
  getLocationNamesFromPayload,
  parseLocationCoordinate,
  serializeLocationCoordinate,
} from "@/modules/recommendations/location-utils";
import type {
  RecommendationPlaceDetails,
  RecommendationPreferences,
  RecommendationParsedBriefMetadata,
  RecommendationQuery,
} from "@/modules/recommendations/types";

export const RECOMMENDATIONS_RETURN_SOURCE = "recommendations";

interface RecommendationDetailNavigationContext {
  appliedValues: RecommendationPreferences;
  appliedPlaceDetails?: RecommendationPlaceDetails[];
  parsedBrief?: RecommendationParsedBriefMetadata | null;
}

const getSingleQueryValue = (
  value: string | string[] | undefined,
): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
};

export const isRecommendationReturnSource = (
  value: string | string[] | undefined,
): boolean => getSingleQueryValue(value) === RECOMMENDATIONS_RETURN_SOURCE;

export const getSafeReturnTo = (
  value: string | string[] | undefined,
): string | null => {
  const returnTo = getSingleQueryValue(value);

  if (!returnTo || !returnTo.startsWith("/")) {
    return null;
  }

  return returnTo;
};

export const buildRecommendationDetailHref = (
  propertyId: string | number,
  returnTo: string,
  context?: RecommendationDetailNavigationContext,
): UrlObject => ({
  pathname: APP_ROUTES.recommendationDetail(propertyId),
  query: {
    from: RECOMMENDATIONS_RETURN_SOURCE,
    returnTo: returnTo || APP_ROUTES.recommendations,
    ...buildRecommendationDetailQuery(context),
  },
});

const setIfFilled = (
  query: Record<string, string | string[]>,
  key: string,
  value: string | number | undefined,
) => {
  if (value === undefined) {
    return;
  }

  const normalized = String(value).trim();
  if (normalized) {
    query[key] = normalized;
  }
};

const setIfFilledList = (
  query: Record<string, string | string[]>,
  key: string,
  values: string[],
) => {
  if (values.length === 0) {
    return;
  }

  query[key] = values.length === 1 ? values[0] : values;
};

const buildRecommendationDetailQuery = (
  context?: RecommendationDetailNavigationContext,
): Record<string, string | string[]> => {
  if (!context) {
    return {};
  }

  const { appliedValues, appliedPlaceDetails, parsedBrief } = context;
  const query: Record<string, string | string[]> = {};

  if (parsedBrief) {
    const { appliedFilters, appliedPreferences } = parsedBrief;
    const filterLocations = getLocationNamesFromPayload(appliedFilters);
    const preferenceLocations = getLocationNamesFromPayload(appliedPreferences);
    const coordinates = getCoordinatesFromPayload(appliedPreferences);

    setIfFilled(query, "mustHaveCategoryId", appliedFilters.categoryId);
    setIfFilled(query, "mustHaveCategory", appliedFilters.category);
    setIfFilledList(query, "mustHaveLocation", filterLocations);
    setIfFilled(query, "maxPrice", appliedFilters.maxPrice);
    setIfFilled(query, "minRoi", appliedFilters.minRoi);
    setIfFilled(query, "minArea", appliedFilters.minArea);
    setIfFilled(
      query,
      "mustHaveMaxDistanceFromHighway",
      appliedFilters.maxDistanceFromHighway,
    );
    setIfFilled(query, "mustHaveStatus", appliedFilters.status);
    setIfFilled(query, "categoryId", appliedPreferences.categoryId);
    setIfFilled(query, "category", appliedPreferences.category);
    setIfFilledList(query, "location", preferenceLocations);
    setIfFilledList(
      query,
      "coordinates",
      coordinates.map((coordinate) => serializeLocationCoordinate(coordinate)),
    );
    setIfFilledList(query, "placeId", appliedPreferences.placeIds ?? []);
    if (coordinates.length === 1) {
      setIfFilled(query, "latitude", coordinates[0]?.latitude);
      setIfFilled(query, "longitude", coordinates[0]?.longitude);
    }
    setIfFilled(query, "locationRadiusKm", appliedPreferences.locationRadiusKm);
    setIfFilled(query, "price", appliedPreferences.price);
    setIfFilled(query, "roi", appliedPreferences.roi);
    setIfFilled(query, "area", appliedPreferences.area);
    setIfFilled(
      query,
      "maxDistanceFromHighway",
      appliedPreferences.maxDistanceFromHighway,
    );
    setIfFilled(query, "status", appliedPreferences.status);

    if (Object.keys(query).length > 0) {
      return query;
    }
  }

  const selectedLocations = appliedPlaceDetails?.map((place) => place.primaryText) ?? [];
  const coordinates =
    appliedPlaceDetails?.map((place) =>
      serializeLocationCoordinate({
        latitude: place.location.lat,
        longitude: place.location.lng,
      }),
    ) ?? [];

  setIfFilled(query, "brief", appliedValues.brief);
  setIfFilledList(
    query,
    "location",
    selectedLocations.length > 0
      ? selectedLocations
      : getLocationNamesFromPayload({ location: appliedValues.location }),
  );
  setIfFilled(query, "price", appliedValues.price);
  setIfFilled(query, "roi", appliedValues.roi);
  setIfFilled(query, "area", appliedValues.area);
  setIfFilled(
    query,
    "maxDistanceFromHighway",
    appliedValues.maxDistanceFromHighway,
  );
  setIfFilledList(query, "coordinates", coordinates);
  setIfFilledList(
    query,
    "placeId",
    appliedPlaceDetails?.map((place) => place.id) ?? [],
  );
  if (appliedPlaceDetails?.length === 1) {
    setIfFilled(query, "latitude", appliedPlaceDetails[0]?.location.lat);
    setIfFilled(query, "longitude", appliedPlaceDetails[0]?.location.lng);
  }

  return query;
};

const getQueryNumber = (
  value: string | string[] | undefined,
): number | undefined => {
  const raw = getSingleQueryValue(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Number.parseFloat(raw.replace(/,/g, ""));
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getMultiQueryValues = (
  value: string | string[] | undefined,
): string[] => {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.trim().length > 0,
  );
};

export const buildRecommendationQueryFromRouteQuery = (
  query: Record<string, string | string[] | undefined>,
): RecommendationQuery => {
  const mustHaveLocations = getLocationNamesFromPayload({
    locations: [
      ...getMultiQueryValues(query.mustHaveLocation),
      ...getMultiQueryValues(query.mustHaveLocations),
    ],
  });
  const preferenceLocations = getLocationNamesFromPayload({
    locations: [
      ...getMultiQueryValues(query.location),
      ...getMultiQueryValues(query.locations),
      ...getMultiQueryValues(query.preferredLocation),
      ...getMultiQueryValues(query.preferredLocations),
    ],
  });
  const coordinateCandidates = [
    ...getMultiQueryValues(query.coordinates),
    ...getMultiQueryValues(query.coordinate),
  ]
    .map((value) => parseLocationCoordinate(value))
    .filter((value): value is NonNullable<typeof value> => value !== null);
  const legacyLatitude =
    getQueryNumber(query.latitude) ?? getQueryNumber(query.preferredLatitude);
  const legacyLongitude =
    getQueryNumber(query.longitude) ?? getQueryNumber(query.preferredLongitude);
  const coordinates =
    coordinateCandidates.length > 0
      ? coordinateCandidates
      : legacyLatitude !== undefined && legacyLongitude !== undefined
        ? [{ latitude: legacyLatitude, longitude: legacyLongitude }]
        : [];
  const placeIds = [
    ...getMultiQueryValues(query.placeId),
    ...getMultiQueryValues(query.placeIds),
  ];

  return {
    brief: getSingleQueryValue(query.brief) ?? undefined,
    mustHave: {
      categoryId: getQueryNumber(query.mustHaveCategoryId),
      category: getSingleQueryValue(query.mustHaveCategory) ?? undefined,
      location: mustHaveLocations[0] ?? undefined,
      locations: mustHaveLocations,
      maxPrice: getQueryNumber(query.maxPrice),
      minRoi: getQueryNumber(query.minRoi),
      minArea: getQueryNumber(query.minArea),
      maxDistanceFromHighway: getQueryNumber(
        query.mustHaveMaxDistanceFromHighway,
      ),
      status: getSingleQueryValue(query.mustHaveStatus) ?? undefined,
    },
    preferences: {
      categoryId: getQueryNumber(query.categoryId),
      category: getSingleQueryValue(query.category) ?? undefined,
      location: preferenceLocations[0] ?? undefined,
      locations: preferenceLocations,
      latitude: coordinates[0]?.latitude,
      longitude: coordinates[0]?.longitude,
      coordinates,
      placeIds,
      locationRadiusKm: getQueryNumber(query.locationRadiusKm),
      price: getQueryNumber(query.price),
      roi: getQueryNumber(query.roi) ?? getQueryNumber(query.preferredRoi),
      area: getQueryNumber(query.area) ?? getQueryNumber(query.preferredArea),
      maxDistanceFromHighway:
        getQueryNumber(query.maxDistanceFromHighway) ??
        getQueryNumber(query.preferredMaxDistance),
      status: getSingleQueryValue(query.status) ?? undefined,
    },
  };
};
