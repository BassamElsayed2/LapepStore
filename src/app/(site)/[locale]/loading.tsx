"use client";
import React from "react";
import FullPageLoader from "@/components/Common/FullPageLoader";
import { useTranslations, useLocale } from "next-intl";

export default function LocalizedLoading() {
  const t = useTranslations("loading");
  const locale = useLocale();

  return (
    <div
      className="fixed inset-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white"
      role="status"
      aria-label={t("loading")}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <FullPageLoader message={t("preparingStore")} />
    </div>
  );
}
