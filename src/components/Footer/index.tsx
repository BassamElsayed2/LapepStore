import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="overflow-hidden">
      {/* <!-- footer bottom start --> */}
      <div className="py-5 xl:py-7.5 bg-gray-1 mt-5">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year}.
              {locale === "ar"
                ? "جميع الحقوق محفوظة لشركة "
                : "All rights reserved for "}
              <Link href="https://ens.eg" target="_blank">
                ENS
              </Link>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-1">
                {locale === "ar"
                  ? "تصميم وتطوير بواسطة"
                  : "Designed and Developed by"}
                <Link href="https://ens.eg" target="_blank">
                  ENS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
