"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import {
  validatePassword,
  PasswordValidation,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
} from "@/utils/auth";

const Signup = () => {
  const locale = useLocale();
  const t = useTranslations("auth");
  const { signUp, redirectIfAuthenticated, loading, user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      console.log("Signup: User is authenticated, redirecting to profile");
      redirectIfAuthenticated();
    }
  }, [loading, user, redirectIfAuthenticated]);

  // Debug logging
  useEffect(() => {
    console.log("Signup component - loading:", loading, "user:", !!user);
  }, [loading, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("fullNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired");
    } else {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        newErrors.password = t("passwordNotMeetRequirements");
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time password validation
    if (name === "password") {
      if (value.length > 0) {
        const validation = validatePassword(value);
        setPasswordValidation(validation);
        setShowPasswordRequirements(true);
      } else {
        setPasswordValidation(null);
        setShowPasswordRequirements(false);
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (result.success) {
        // Form will be reset and user will be redirected by the auth hook
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={t("createAccount")} pages={[t("createAccount")]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                {t("createAccount")}
              </h2>
              <p>{t("enterDetailsBelow")}</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="fullName" className="block mb-2.5">
                    {t("fullName")}{" "}
                    <span className="text-red">{t("required")}</span>
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t("enterFullName")}
                    className={`rounded-lg border ${
                      errors.fullName ? "border-red-500" : "border-gray-3"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    {t("emailAddress")}{" "}
                    <span className="text-red">{t("required")}</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("enterEmailAddress")}
                    className={`rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-3"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    {t("password")}{" "}
                    <span className="text-red">{t("required")}</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t("enterPassword")}
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      errors.password
                        ? "border-red-500"
                        : passwordValidation?.isValid
                        ? "border-green-500"
                        : passwordValidation && !passwordValidation.isValid
                        ? "border-yellow-500"
                        : "border-gray-3"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />

                  {/* Password Strength Indicator */}
                  {passwordValidation && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${getPasswordStrengthColor(
                            passwordValidation.strength
                          )}`}
                        >
                          {locale === "ar"
                            ? passwordValidation.feedback.ar
                            : passwordValidation.feedback.en}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.round(passwordValidation.score)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBgColor(
                            passwordValidation.strength
                          )}`}
                          style={{ width: `${passwordValidation.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  {showPasswordRequirements && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {t("passwordRequirements")}
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li
                          className={`flex items-center ${
                            passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "length"
                            )
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "length"
                            )
                              ? "✓"
                              : "○"}
                          </span>
                          {t("requirementLength")}
                        </li>
                        <li
                          className={`flex items-center ${
                            passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "uppercase"
                            )
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "uppercase"
                            )
                              ? "✓"
                              : "○"}
                          </span>
                          {t("requirementUppercase")}
                        </li>
                        <li
                          className={`flex items-center ${
                            passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "lowercase"
                            )
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "lowercase"
                            )
                              ? "✓"
                              : "○"}
                          </span>
                          {t("requirementLowercase")}
                        </li>
                        <li
                          className={`flex items-center ${
                            passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "number"
                            )
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "number"
                            )
                              ? "✓"
                              : "○"}
                          </span>
                          {t("requirementNumber")}
                        </li>
                        <li
                          className={`flex items-center ${
                            passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "special"
                            )
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordValidation &&
                            !passwordValidation.missingRequirements.includes(
                              "special"
                            )
                              ? "✓"
                              : "○"}
                          </span>
                          {t("requirementSpecial")}
                        </li>
                      </ul>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    {t("retypePassword")}{" "}
                    <span className="text-red">{t("required")}</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t("retypeYourPassword")}
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-3"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    t("createAccountButton")
                  )}
                </button>

                <p className="text-center mt-6">
                  {t("alreadyHaveAccount")}
                  <Link
                    href={`/${locale}/signin`}
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    {t("signInNow")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
