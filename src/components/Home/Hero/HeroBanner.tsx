"use client";
import React from "react";
import { useLocale } from "next-intl";

const HeroBanner = () => {
  const locale = useLocale();

  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative w-full h-[500px]">
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
      </div>
    </section>
  );
};

export default HeroBanner;
