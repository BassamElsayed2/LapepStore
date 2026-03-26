"use client";

import { useEffect } from "react";

export default function SetLocaleAttributes({
  locale,
  fontVariable,
  fontClassName,
}: {
  locale: string;
  fontVariable: string;
  fontClassName: string;
}) {
  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.add(fontVariable);
    document.body.classList.add(dir, fontClassName);

    return () => {
      document.documentElement.classList.remove(fontVariable);
      document.body.classList.remove(dir, fontClassName);
    };
  }, [locale, fontVariable, fontClassName]);

  return null;
}
