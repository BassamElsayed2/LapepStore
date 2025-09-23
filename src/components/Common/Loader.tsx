"use client";
import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  showText?: boolean;
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  showLogo = true,
  showText = true,
  message,
  className = "",
}) => {
  const locale = useLocale();
  const t = useTranslations("loading");

  const sizeClasses = {
    sm: {
      spinner: "h-8 w-8",
      logo: "max-w-[120px]",
      text: "text-sm",
      dots: "h-1 w-1",
      spacing: "mb-4",
    },
    md: {
      spinner: "h-16 w-16",
      logo: "max-w-[200px]",
      text: "text-xl",
      dots: "h-1.5 w-1.5",
      spacing: "mb-6",
    },
    lg: {
      spinner: "h-24 w-24",
      logo: "max-w-[250px]",
      text: "text-2xl",
      dots: "h-2 w-2",
      spacing: "mb-8",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`text-center ${className}`}
      role="status"
      aria-label={t("loading")}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Loading Spinner */}
      <div
        className={`flex justify-center ${showText ? currentSize.spacing : ""}`}
      >
        <div
          className={`${currentSize.spinner} motion-safe:animate-spin motion-reduce:rotate-45 rounded-full border-4 border-solid border-blue border-t-transparent`}
          role="progressbar"
          aria-label={t("loading")}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="space-y-2">
          <h2 className={`${currentSize.text} font-semibold text-dark`}>
            {t("loading")}
          </h2>
          <p className="text-dark-4 max-w-md mx-auto">
            {message || t("loadingMessage")}
          </p>
        </div>
      )}

      {/* Progressive Loading Dots */}
      {showText && (
        <div
          className={`mt-${
            size === "sm" ? "4" : size === "md" ? "6" : "8"
          } flex justify-center space-x-1`}
        >
          <div
            className={`${currentSize.dots} bg-blue rounded-full motion-safe:animate-pulse`}
          ></div>
          <div
            className={`${currentSize.dots} bg-blue rounded-full motion-safe:animate-pulse motion-safe:delay-75`}
          ></div>
          <div
            className={`${currentSize.dots} bg-blue rounded-full motion-safe:animate-pulse motion-safe:delay-150`}
          ></div>
        </div>
      )}

      {/* Reduced motion handled by Tailwind's motion-safe/motion-reduce prefixes */}
    </div>
  );
};

export default Loader;
