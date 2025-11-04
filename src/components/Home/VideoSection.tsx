"use client";
import React from "react";

const VideoSection = () => {
  return (
    <section className="w-full pt-2">
      <div className="relative w-full h-auto ">
        <video
          src="/lapip.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover max-w-[1180px] mx-auto mb-10 mt-10 lg:mt-0 md:rounded-[30px] "
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoSection;
