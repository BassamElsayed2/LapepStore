"use client";
import React from "react";

export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes vape-smoke {
          0% {
            transform: translateY(0) translateX(-50%) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.5;
            transform: translateY(-100px) translateX(-50%) scale(1.5);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) translateX(-50%) scale(2);
          }
        }

        @keyframes vape-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-60px);
          }
        }

        @keyframes vape-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        .smoke-particle-0 { animation: vape-smoke 2s ease-out infinite; animation-delay: 0s; }
        .smoke-particle-1 { animation: vape-smoke 2.5s ease-out infinite; animation-delay: 0.4s; }
        .smoke-particle-2 { animation: vape-smoke 3s ease-out infinite; animation-delay: 0.8s; }
        .smoke-particle-3 { animation: vape-smoke 3.5s ease-out infinite; animation-delay: 1.2s; }
        .smoke-particle-4 { animation: vape-smoke 4s ease-out infinite; animation-delay: 1.6s; }
        .smoke-particle-5 { animation: vape-smoke 4.5s ease-out infinite; animation-delay: 2s; }

        .float-particle-0 { animation: vape-float 3s ease-in-out infinite; animation-delay: 0s; }
        .float-particle-1 { animation: vape-float 3.5s ease-in-out infinite; animation-delay: 0.6s; }
        .float-particle-2 { animation: vape-float 4s ease-in-out infinite; animation-delay: 1.2s; }

        .pulse-dot-0 { animation: vape-pulse 1.5s ease-in-out infinite; animation-delay: 0s; }
        .pulse-dot-1 { animation: vape-pulse 1.5s ease-in-out infinite; animation-delay: 0.2s; }
        .pulse-dot-2 { animation: vape-pulse 1.5s ease-in-out infinite; animation-delay: 0.4s; }
      `}</style>

      <div
        className="fixed inset-0 z-[999999] flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
        role="status"
        aria-label="Loading content"
      >
        {/* Animated Smoke/Vape Effect */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Multiple Smoke Puffs */}
          <div className="relative h-48 w-48 mb-8">
            {/* Vape Device Icon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
              <div className="w-6 h-16 bg-gradient-to-t from-slate-400 to-slate-300 rounded-lg shadow-lg">
                <div className="w-6 h-2 bg-blue-400 rounded-t-lg shadow-lg animate-pulse"></div>
              </div>
            </div>

            {/* Smoke Particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 smoke-particle-${i}`}
              >
                <div
                  className="w-20 h-20 rounded-full blur-xl opacity-70"
                  style={{
                    background: `radial-gradient(circle, ${
                      i % 3 === 0
                        ? "rgba(139, 92, 246, 0.3)"
                        : i % 3 === 1
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(168, 85, 247, 0.3)"
                    } 0%, transparent 70%)`,
                  }}
                ></div>
              </div>
            ))}

            {/* Additional Floating Particles */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className={`absolute bottom-0 float-particle-${i}`}
                style={{
                  left: `${40 + i * 10}%`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full blur-lg opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3 z-20">
            <h2 className="text-3xl font-bold text-white tracking-wider animate-pulse">
              Loading...
            </h2>
            <p className="text-slate-300 text-sm">
              Preparing your vape experience
            </p>
          </div>

          {/* Pulsing Dots */}
          <div className="mt-6 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`dot-${i}`}
                className={`w-2 h-2 bg-blue-400 rounded-full pulse-dot-${i}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
