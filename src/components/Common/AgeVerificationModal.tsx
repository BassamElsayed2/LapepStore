"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

const AgeVerificationModal = () => {
  const [showModal, setShowModal] = useState(false);
  const locale = useLocale();
  const t = useTranslations("ageVerification");

  useEffect(() => {
    // Check if user has already verified their age
    const isVerified = localStorage.getItem("ageVerified");
    if (!isVerified) {
      setShowModal(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleYes = () => {
    // Save verification to localStorage
    localStorage.setItem("ageVerified", "true");
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const handleNo = () => {
    // Don't save anything to localStorage so the modal will show again
    // Show alert and try to close/redirect
    alert(
      locale === "ar"
        ? "عذراً، يجب أن تكون 18 عاماً أو أكبر لدخول هذا الموقع."
        : "Sorry, you must be 18 years or older to access this website."
    );
    
    // Try multiple methods to close/redirect
    // Method 1: Try to close the window
    window.close();
    
    // Method 2: If close doesn't work, redirect after a short delay
    setTimeout(() => {
      // Redirect to Google or another safe page
      window.location.replace("https://www.google.com");
    }, 100);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all ${
          showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#22AD5C]/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#22AD5C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {t("title")}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8 leading-relaxed">
          {t("message")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleYes}
            className="flex-1 bg-[#22AD5C] hover:bg-[#1e9d52] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t("yes")}
          </button>
          <button
            onClick={handleNo}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {t("no")}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {t("note")}
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;

