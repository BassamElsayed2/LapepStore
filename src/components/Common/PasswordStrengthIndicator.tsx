"use client";

import React from "react";
import {
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  PasswordStrength,
} from "@/utils/validation";

interface PasswordStrengthIndicatorProps {
  password: string;
  locale?: string;
  showRequirements?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  locale = "en",
  showRequirements = true,
}) => {
  if (!password) return null;

  const validation = validatePassword(password);
  const color = getPasswordStrengthColor(validation.strength);
  const strengthText = getPasswordStrengthText(validation.strength, locale);

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dark-5">
            {locale === "ar" ? "قوة كلمة المرور:" : "Password strength:"}
          </span>
          <span style={{ color }} className="font-medium">
            {strengthText}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${validation.score}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1 text-xs">
          <RequirementItem
            met={validation.feedback.hasMinLength}
            text={
              locale === "ar"
                ? "8 أحرف على الأقل"
                : "At least 8 characters"
            }
          />
          <RequirementItem
            met={validation.feedback.hasUpperCase}
            text={
              locale === "ar"
                ? "حرف كبير (A-Z)"
                : "One uppercase letter (A-Z)"
            }
          />
          <RequirementItem
            met={validation.feedback.hasLowerCase}
            text={
              locale === "ar"
                ? "حرف صغير (a-z)"
                : "One lowercase letter (a-z)"
            }
          />
          <RequirementItem
            met={validation.feedback.hasNumber}
            text={locale === "ar" ? "رقم (0-9)" : "One number (0-9)"}
          />
          <RequirementItem
            met={validation.feedback.hasSpecialChar}
            text={
              locale === "ar"
                ? "رمز مميز (!@#$%...)"
                : "One special character (!@#$%...)"
            }
          />
        </div>
      )}
    </div>
  );
};

interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <svg
          className="w-4 h-4 text-green-500 flex-shrink-0"
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
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className={met ? "text-dark" : "text-dark-5"}>{text}</span>
    </div>
  );
};

export default PasswordStrengthIndicator;

