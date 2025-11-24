"use client";

import dynamic from "next/dynamic";
import { ComponentProps, forwardRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Loading component for slider
const SliderLoader = () => (
  <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-dark border-t-transparent mb-2"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// Dynamically import react-slick with proper ref forwarding
const DynamicSlider = dynamic(() => import("react-slick"), {
  loading: () => <SliderLoader />,
  ssr: false,
}) as typeof Slider;

export default DynamicSlider;
