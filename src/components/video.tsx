import React from "react";

export default function video() {
  return (
    <div>
      <video
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
