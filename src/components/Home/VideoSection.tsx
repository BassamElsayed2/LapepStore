"use client";
import React from "react";

const VideoSection = () => {
  return (
    <section className="w-full">
      <div className="relative w-full h-auto ">
        <video
          src="/lapip.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover max-w-[1180px] mx-auto my-10 rounded-[30px]"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoSection;
