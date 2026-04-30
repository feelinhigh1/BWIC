import Head from "next/head";
import { useRouter } from "next/router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid2x2,
  Images,
  MapPin,
  Ruler,
  Waypoints,
} from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import { assetUrl } from "@/lib/api/client";
import FavoriteButton from "@/modules/favorites/components/FavoriteButton";
import { getProperty } from "@/modules/properties/api";
import {
  formatPropertyStatus,
  getPropertyStatusBadgeClass,
} from "@/modules/properties/status";
import {
  getSafeReturnTo,
  isRecommendationReturnSource,
} from "@/modules/recommendations/navigation";
import { capitalize } from "@/utils/Capitalize";
import type { PropertyDetail as PropertyDetailType } from "@/modules/properties/types";

const PROPERTY_PLACEHOLDER_IMAGE = "/images/hero_section.png";

const parseNumericValue = (value?: string | number | null): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNepaliPrice = (raw?: string | number | null): string => {
  const parsed = parseNumericValue(raw);
  if (parsed === null) {
    return "Not specified";
  }

  return `NRs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(parsed)}`;
};

const formatPercent = (raw?: string | number | null): string => {
  const parsed = parseNumericValue(raw);
  if (parsed === null) {
    return "Not specified";
  }

  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: parsed % 1 === 0 ? 0 : 1,
    minimumFractionDigits: parsed % 1 === 0 ? 0 : 1,
  }).format(parsed)}%`;
};

const formatDate = (iso?: string | null): string => {
  if (!iso) {
    return "Not specified";
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatArea = (raw?: string | number | null): string => {
  const parsed = parseNumericValue(raw);
  if (parsed === null) {
    return "Not specified";
  }

  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: parsed % 1 === 0 ? 0 : 1,
    minimumFractionDigits: parsed % 1 === 0 ? 0 : 1,
  }).format(parsed)} sq ft`;
};

const formatDistance = (raw?: number | null): string => {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return "Not specified";
  }

  if (raw >= 1000) {
    const kilometers = raw / 1000;
    return `${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: kilometers % 1 === 0 ? 0 : 1,
      minimumFractionDigits: kilometers % 1 === 0 ? 0 : 1,
    }).format(kilometers)} km From Highway`;
  }

  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(raw)}m From Highway`;
};

const normalizeText = (
  value?: string | null,
  fallback = "Not specified",
): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const resolveImageSrc = (path?: string | null): string => {
  if (!path) {
    return PROPERTY_PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(path) || path.startsWith("/images/")) {
    return path;
  }

  return assetUrl(path);
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  if (!event.currentTarget.src.endsWith(PROPERTY_PLACEHOLDER_IMAGE)) {
    event.currentTarget.src = PROPERTY_PLACEHOLDER_IMAGE;
  }
};

const PropertyDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const cameFromRecommendations = isRecommendationReturnSource(
    router.query.from,
  );
  const returnTo = getSafeReturnTo(router.query.returnTo);
  const listingRoute = cameFromRecommendations
    ? APP_ROUTES.recommendations
    : APP_ROUTES.properties;
  const listingLabel = cameFromRecommendations
    ? "Recommendations"
    : "Properties";
  const backButtonLabel = cameFromRecommendations
    ? "Back to Recommendations"
    : "Back to Properties";

  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const handleNavigateBack = () => {
    if (returnTo) {
      void router.push(returnTo);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    void router.push(listingRoute);
  };

  const handleFullscreenToggle = () => {
    if (typeof document === "undefined") {
      return;
    }

    if (!document.fullscreenElement) {
      imageRef.current?.requestFullscreen().catch((error) => {
        console.error("Failed to enter fullscreen:", error);
      });
      return;
    }

    void document.exitFullscreen();
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!id) {
      setLoading(false);
      setProperty(null);
      return;
    }

    let cancelled = false;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getProperty(String(id));

        if (!cancelled) {
          setProperty(data);
          setSelectedImage(0);
        }
      } catch (error) {
        console.error("Failed to fetch property", error);

        if (!cancelled) {
          setProperty(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProperty();

    return () => {
      cancelled = true;
    };
  }, [id, router.isReady]);

  const galleryImages = useMemo(() => {
    if (!property) {
      return [PROPERTY_PLACEHOLDER_IMAGE];
    }

    const uniqueImages = Array.from(
      new Set(
        [property.primaryImage, ...(property.images ?? [])].filter(
          (image): image is string => Boolean(image?.trim()),
        ),
      ),
    );

    return uniqueImages.length > 0
      ? uniqueImages
      : [PROPERTY_PLACEHOLDER_IMAGE];
  }, [property]);

  useEffect(() => {
    setSelectedImage((currentIndex) =>
      Math.min(currentIndex, Math.max(galleryImages.length - 1, 0)),
    );
  }, [galleryImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] px-6 py-24 font-auth-body text-[#131b2e]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-[28px] border border-[#e7e8f1] bg-white/90 px-8 py-20 text-center shadow-[0_22px_60px_rgba(19,27,46,0.08)]">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#0b46cf] border-t-transparent" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#737686]">
            Loading Property
          </p>
          <h1 className="mt-3 font-auth-headline text-3xl font-bold text-[#131b2e]">
            Preparing the investment overview
          </h1>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#faf8ff] px-6 py-24 font-auth-body text-[#131b2e]">
        <div className="mx-auto max-w-xl rounded-[28px] border border-[#f0d3d3] bg-white px-8 py-14 text-center shadow-[0_22px_60px_rgba(19,27,46,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b42318]">
            Property unavailable
          </p>
          <h1 className="mt-4 font-auth-headline text-4xl font-bold text-[#131b2e]">
            We couldn&apos;t find that listing.
          </h1>
          <p className="mt-4 text-base leading-8 text-[#5b6174]">
            This property doesn&apos;t exist or may have been removed.
          </p>
          <button
            type="button"
            onClick={handleNavigateBack}
            className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-[#0d1b3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c9843a]"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButtonLabel}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = formatPropertyStatus(property.status);
  const categoryName = capitalize(
    normalizeText(property.category?.name, "Property"),
  );
  const locationLabel = normalizeText(property.location);
  const description = normalizeText(
    property.description,
    "No property description has been provided for this listing yet.",
  );
  const priceLabel = formatNepaliPrice(property.price);
  const roiLabel = formatPercent(property.roi);
  const areaLabel = formatArea(property.area);
  const localAreaLabel = normalizeText(property.areaNepali);
  const distanceLabel = formatDistance(property.distanceFromHighway);
  const listedOnLabel = formatDate(property.createdAt);
  const activeImage = resolveImageSrc(galleryImages[selectedImage]);
  const hasMultipleImages = galleryImages.length > 1;
  const roiProgress = Math.max(
    8,
    Math.min(100, Math.round(parseNumericValue(property.roi) ?? 0)),
  );

  return (
    <>
      <Head>
        <title>{`${property.title} | Blue Whale Investment`}</title>
      </Head>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(75,65,225,0.08),transparent_30%),linear-gradient(180deg,#f7f6ff_0%,#faf8ff_100%)] pb-20 pt-12 font-auth-body text-[#131b2e]">
        <main className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[#737686]">
              <button
                type="button"
                onClick={() => void router.push(APP_ROUTES.home)}
                className="transition-colors hover:text-[#0b46cf]"
              >
                Home
              </button>
              <ChevronRight className="h-4 w-4 text-[#a7adbf]" />
              <button
                type="button"
                onClick={handleNavigateBack}
                className="transition-colors hover:text-[#0b46cf]"
              >
                {listingLabel}
              </button>
              <ChevronRight className="h-4 w-4 text-[#a7adbf]" />
              <span className="text-[#131b2e]">{property.title}</span>
            </nav>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="font-auth-headline text-[44px] font-bold tracking-[-0.05em] text-[#131b2e] sm:text-[60px]">
                    {property.title}
                  </h1>
                  <span
                    className={`inline-flex rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${getPropertyStatusBadgeClass(
                      property.status,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-2 text-[#434655]">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#0b46cf]" />
                  <p className="max-w-3xl text-lg leading-relaxed">
                    {locationLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FavoriteButton
                  propertyId={property.id}
                  variant="inline"
                  showLabel
                  className="rounded-[12px] px-5 py-3"
                />
              </div>
            </div>
          </div>

          <section className="mx-auto mb-16 w-full max-w-[1080px] overflow-hidden rounded-[24px] border border-[#dbe1ff] bg-[#dfe5ff] shadow-[0_20px_46px_rgba(19,27,46,0.10)]">
            <div
              ref={imageRef}
              className="relative aspect-[4/3] bg-[#131b2e] sm:aspect-[16/10] lg:aspect-[16/9]"
            >
              <img
                src={activeImage}
                alt={property.title}
                onError={handleImageError}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {hasMultipleImages && (
                <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                  <span className="rounded-full bg-[#131b2e]/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    Image {selectedImage + 1} of {galleryImages.length}
                  </span>
                </div>
              )}

              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <button
                  type="button"
                  onClick={handleFullscreenToggle}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#131b2e]/70 text-white shadow-[0_10px_20px_rgba(19,27,46,0.16)] backdrop-blur-sm transition hover:bg-[#131b2e]/85"
                  title="View image fullscreen"
                  aria-label="View image fullscreen"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((current) => current - 1)}
                    disabled={selectedImage === 0}
                    className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#131b2e]/60 text-white backdrop-blur-sm transition hover:bg-[#131b2e]/80 disabled:cursor-not-allowed disabled:opacity-40 sm:left-6"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedImage((current) => current + 1)}
                    disabled={selectedImage === galleryImages.length - 1}
                    className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#131b2e]/60 text-white backdrop-blur-sm transition hover:bg-[#131b2e]/80 disabled:cursor-not-allowed disabled:opacity-40 sm:right-6"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 sm:bottom-6 sm:left-6">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  {roiLabel} ROI
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  {areaLabel}
                </span>
              </div>
            </div>

            {hasMultipleImages && (
              <div className="flex items-center gap-3 overflow-x-auto border-t border-[#e7e8f1] bg-white px-4 py-4">
                <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b46cf]">
                  <Images className="h-4 w-4" />
                  {galleryImages.length} Images
                </div>

                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-[10px] border-2 transition ${
                      index === selectedImage
                        ? "border-[#0b46cf] shadow-[0_10px_20px_rgba(11,70,207,0.12)]"
                        : "border-transparent opacity-70 hover:border-[#c9843a] hover:opacity-100"
                    }`}
                  >
                    <img
                      src={resolveImageSrc(image)}
                      alt={`${property.title} image ${index + 1}`}
                      onError={handleImageError}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-14 lg:col-span-8">
              <section>
                <h2 className="mb-6 flex items-center gap-3 font-auth-headline text-[28px] font-bold text-[#131b2e]">
                  <span className="h-1 w-8 rounded-full bg-[#0b46cf]" />
                  Property Description
                </h2>

                <div className="rounded-[18px] border border-[#ece7df] bg-white p-8 shadow-[0_12px_30px_rgba(19,27,46,0.04)]">
                  <p className="mb-4 text-[28px] italic leading-tight text-[#0b46cf]">
                    “{categoryName} Investment Opportunity”
                  </p>
                  <p className="whitespace-pre-line text-[18px] leading-9 text-[#434655]">
                    {description}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-6 flex items-center gap-3 font-auth-headline text-[28px] font-bold text-[#131b2e]">
                  <span className="h-1 w-8 rounded-full bg-[#0b46cf]" />
                  Technical Specifications
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      label: "Property Category",
                      value: categoryName,
                      icon: Building2,
                    },
                    {
                      label: "Highway Access",
                      value: distanceLabel,
                      icon: Waypoints,
                    },
                    {
                      label: "Square Footage",
                      value: areaLabel,
                      icon: Ruler,
                    },
                    {
                      label: "Traditional Measurement",
                      value: localAreaLabel,
                      icon: Grid2x2,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.label}
                        className="rounded-[18px] border border-[#dfe5ff] bg-[#f4f6ff] p-6 shadow-[0_10px_26px_rgba(19,27,46,0.04)]"
                      >
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737686]">
                          {item.label}
                        </p>
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-[#0b46cf]" />
                          <span className="text-[18px] font-semibold text-[#131b2e]">
                            {item.value}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNavigateBack}
                  className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[#0b46cf]"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {backButtonLabel}
                </button>
              </div>
            </div>

            <aside className="space-y-8 lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-8">
                <section className="rounded-[20px] border border-[#ece7df] bg-white p-8 shadow-[0_20px_40px_rgba(19,27,46,0.06)]">
                  <div className="mb-8">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#737686]">
                      Investment Value
                    </p>
                    <div className="font-auth-headline text-[44px] font-extrabold tracking-[-0.04em] text-[#131b2e]">
                      {priceLabel}
                    </div>
                  </div>

                  <div className="mb-8 rounded-[18px] bg-[#f3f5ff] p-6">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-[#434655]">
                        Expected ROI
                      </span>
                      <span className="text-[32px] font-bold text-[#0b46cf]">
                        {roiLabel}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#d7ddf0]">
                      <div
                        className="h-full rounded-full bg-[#0b46cf]"
                        style={{ width: `${roiProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-8 space-y-2">
                    {[
                      { label: "Property Type", value: categoryName },
                      { label: "Property Status", value: statusLabel },
                      { label: "Listed On", value: listedOnLabel },
                    ].map((row, index) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between gap-4 py-3 ${
                          index < 2 ? "border-b border-[#ebe6de]" : ""
                        }`}
                      >
                        <span className="text-sm text-[#5b6174]">
                          {row.label}
                        </span>
                        <span className="text-sm font-bold text-[#131b2e]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => void router.push(APP_ROUTES.contact)}
                    className="w-full rounded-[12px] bg-[linear-gradient(135deg,#0b46cf_0%,#4b41e1_100%)] px-5 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_26px_rgba(11,70,207,0.22)] transition hover:brightness-[1.04]"
                  >
                    Contact Agent
                  </button>
                </section>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default PropertyDetail;
