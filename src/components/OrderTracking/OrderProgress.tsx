"use client";

import React from "react";
import { useLocale } from "next-intl";
import { cn } from "@/utils/cn";

export interface OrderStatusStep {
  status: string;
  label: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

interface OrderProgressProps {
  steps: OrderStatusStep[];
  className?: string;
}

export function OrderProgress({ steps, className }: OrderProgressProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className={cn("w-full hidden sm:block", className)}>
      <div className={cn("flex items-center justify-between mb-8")}>
        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  "w-10 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-medium transition-all duration-300",
                  step.completed
                    ? "bg-blue text-white"
                    : step.current
                    ? "bg-blue text-white ring-2 sm:ring-4 ring-blue/20"
                    : "bg-gray-3 text-gray-6"
                )}
              >
                {step.completed ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-lg sm:text-xl md:text-2xl">
                    {step.icon}
                  </span>
                )}
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-1/2 h-0.5 -translate-y-1/2 transition-all duration-300",
                    isRTL ? "right-full" : "left-full",
                    step.completed ? "bg-blue" : "bg-gray-3",
                    // Responsive widths
                    "w-[3rem] sm:w-16 md:w-[8rem] lg:w-[10rem] xl:w-[13rem]"
                  )}
                />
              )}
            </div>

            {/* Step Info */}
            <div className="mt-2 sm:mt-4 text-center max-w-16 sm:max-w-20 md:max-w-24">
              <p
                className={cn(
                  "text-xs sm:text-sm font-medium",
                  step.current
                    ? "text-blue"
                    : step.completed
                    ? "text-dark"
                    : "text-gray-6"
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-gray-6 mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
