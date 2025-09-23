"use client";
import React from "react";
import Loader from "./Loader";

interface FullPageLoaderProps {
  message?: string;
  backgroundColor?: string;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message,
  backgroundColor = "bg-white",
}) => {
  return (
    <div
      className={`fixed inset-0 z-[999999] flex h-screen w-screen items-center justify-center ${backgroundColor}`}
      role="status"
      aria-label="Loading page content"
    >
      <Loader size="lg" showLogo={true} showText={true} message={message} />
    </div>
  );
};

export default FullPageLoader;
