"use client";
import React from "react";
import { useLocale } from "next-intl";
import Link from "next/link";

const HeroBanner = () => {
  const locale = useLocale();

  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative w-full h-[600px] ">
        <video
          src="/lapip.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.2))",
          }}
        />

        <div className="absolute inset-0 flex items-center ">
          <div
            className={`text-center px-4 max-w-3xl  animate-fade-in ${locale === "ar" ? "text-right mr-5" : "text-left ml-5"}`}
          >
            <span className="inline-flex items-center gap-1.5 mb-4 px-5 py-1.5 rounded-full bg-green/90 text-white text-sm font-semibold tracking-wide backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              {locale === "ar" ? "حصريا لدي لبيب" : "Exclusive to Lapep"}
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-snug font-bold text-white  mb-5">
              {locale === "ar"
                ? "وجهتك الفاخرة لعالم "
                : "Your  destination for the world of "}
              <span className="text-green">
                {locale === "ar" ? " الفيب" : "vaping"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl  mb-8">
              {locale === "ar"
                ? "اكتشف تشكيلة استثنائية تجمع بين الجودة الفائقة والتصميم الأنيق. نقدم لك أحدث نكهات وأجهزة التدخين الإلكتروني في العالم."
                : "We offer you the latest flavors and vaping devices in the world."}
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-green text-white font-semibold text-base hover:bg-green-dark transition-colors duration-300"
              >
                {locale === "ar" ? "تسوق الآن" : "Shop Now"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 rtl:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <Link
                href={`/${locale}/shop`}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-xl font-bold text-lg transition-all"
              >
                {locale === "ar" ? "اكتشف المجموعات" : "Discover Collections"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
