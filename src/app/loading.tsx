import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white"
      role="status"
      aria-label="Loading content"
    >
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Image
              src="/images/logo/logo.svg"
              alt="NextCommerce Logo"
              width={171}
              height={36}
              priority
              className="h-auto w-auto max-w-[200px]"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-6 flex justify-center">
          <div
            className="h-16 w-16 motion-safe:animate-spin motion-reduce:rotate-45 rounded-full border-4 border-solid border-blue border-t-transparent"
            role="progressbar"
            aria-label="Loading progress"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-dark">Loading...</h2>
          <p className="text-dark-4 max-w-md mx-auto">
            Please wait while we prepare your shopping experience
          </p>
        </div>

        {/* Progressive Loading Dots */}
        <div className="mt-8 flex justify-center space-x-1">
          <div className="h-2 w-2 bg-blue rounded-full motion-safe:animate-pulse"></div>
          <div className="h-2 w-2 bg-blue rounded-full motion-safe:animate-pulse motion-safe:delay-75"></div>
          <div className="h-2 w-2 bg-blue rounded-full motion-safe:animate-pulse motion-safe:delay-150"></div>
        </div>
      </div>
    </div>
  );
}
