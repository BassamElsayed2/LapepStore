"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Branch } from "@/types/branch";
import { getBranches } from "@/services/apiBranches";
// Icons as inline SVG components
const MapPinIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);
import Image from "next/image";

const Branches = () => {
  const t = useTranslations("branches");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await getBranches();
        setBranches(data);
      } catch (err) {
        setError("Failed to load branches");
        console.error("Error fetching branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Branches Grid */}
      {branches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("noBranches")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Branch Image */}
              {branch.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={branch.image}
                    alt={branch.name_ar || branch.name_en || "Branch"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Branch Content */}
              <div className="p-6">
                {/* Branch Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {branch.name_ar || branch.name_en || "Branch"}
                </h3>

                {/* Area */}
                {(branch.area_ar || branch.area_en) && (
                  <div className="flex items-center mb-3">
                    <div className="text-primary mr-2">
                      <MapPinIcon />
                    </div>
                    <span className="text-gray-600">
                      {branch.area_ar || branch.area_en}
                    </span>
                  </div>
                )}

                {/* Address */}
                {(branch.address_ar || branch.address_en) && (
                  <div className="mb-3">
                    <p className="text-gray-600 text-sm">
                      {branch.address_ar || branch.address_en}
                    </p>
                  </div>
                )}

                {/* Working Hours */}
                {branch.works_hours && (
                  <div className="flex items-center mb-3">
                    <div className="text-primary mr-2">
                      <ClockIcon />
                    </div>
                    <span className="text-gray-600 text-sm">
                      {branch.works_hours}
                    </span>
                  </div>
                )}

                {/* Phone */}
                {branch.phone && (
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-2">
                      <PhoneIcon />
                    </div>
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </div>
                )}

                {/* Google Map Link */}
                {branch.google_map && (
                  <a
                    href={branch.google_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    <div className="mr-1">
                      <ExternalLinkIcon />
                    </div>
                    {t("viewOnMap")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Branches;
