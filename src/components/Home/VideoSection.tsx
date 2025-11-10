"use client";
import React, { useEffect, useRef, useState } from "react";

const VideoSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // حساب مدى ظهور السيكشن في الشاشة
      const sectionTop = rect.top;

      // لما السيكشن يبدأ يظهر في الشاشة
      // التأثير يكتمل لما يوصل لنص الشاشة تقريباً
      if (sectionTop < windowHeight) {
        // حساب النسبة المئوية - يكتمل لما يوصل السيكشن لـ 60% من الشاشة
        const progress = Math.min(
          Math.max((windowHeight - sectionTop) / (windowHeight * 0.6), 0),
          1
        );
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    handleScroll(); // تشغيل مرة واحدة في البداية
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // حساب العرض بناءً على scroll progress
  const maxWidth = 1180 + scrollProgress * 180; // من 1180px ل 1400px

  // التحكم في play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={sectionRef} className="w-full pt-10">
      <div className="relative w-full h-auto flex justify-center">
        <div
          className="relative"
          style={{ maxWidth: `${maxWidth}px`, width: "100%" }}
        >
          <video
            ref={videoRef}
            src="/lapip.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-[30px] h-auto object-cover mb-10 mt-10 lg:mt-0 transition-all duration-300 ease-out"
          >
            Your browser does not support the video tag.
          </video>

          {/* زرار Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="absolute top-14 lg:top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              // أيقونة Pause
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // أيقونة Play
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
