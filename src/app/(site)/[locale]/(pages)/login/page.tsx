"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { identifyLoginType, normalizeEgyptianPhone } from "@/utils/validation";

const LoginPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { signIn, loading } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "", // Email or Phone
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifierType, setIdentifierType] = useState<
    "email" | "phone" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // Detect identifier type (email or phone)
  useEffect(() => {
    if (formData.identifier) {
      const type = identifyLoginType(formData.identifier);
      setIdentifierType(type);
    } else {
      setIdentifierType(null);
    }
  }, [formData.identifier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setAttemptsLeft(null); // Clear previous attempts info

    if (!formData.identifier || !formData.password) {
      setErrorMessage(
        locale === "ar" ? "الرجاء ملء جميع الحقول" : "Please fill all fields"
      );
      return;
    }

    // Validate identifier type
    if (!identifierType) {
      setErrorMessage(
        locale === "ar"
          ? "الرجاء إدخال بريد إلكتروني أو رقم هاتف صحيح"
          : "Please enter a valid email or phone number"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize phone number if it's a phone
      const loginIdentifier =
        identifierType === "phone"
          ? normalizeEgyptianPhone(formData.identifier)
          : formData.identifier;

      const result = await signIn(
        loginIdentifier,
        formData.password,
        formData.rememberMe
      );

      if (!result.success) {
        // Display error in page instead of toast
        const errorMsg =
          result.error ||
          (locale === "ar"
            ? "فشل تسجيل الدخول. تحقق من بياناتك"
            : "Login failed. Check your credentials");
        setErrorMessage(errorMsg);

        // Extract attempts left if available
        if ((result as any).attemptsLeft !== undefined) {
          setAttemptsLeft((result as any).attemptsLeft);
        }

        // Log error for debugging (but don't expose to user)
        console.error("Login failed:", errorMsg);
      }
      // Success toast is handled in useAuth hook
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error types
      let errorMsg =
        locale === "ar"
          ? "حدث خطأ أثناء تسجيل الدخول"
          : "An error occurred during login";

      // Extract attempts left if available
      if (error.attemptsLeft !== undefined) {
        setAttemptsLeft(error.attemptsLeft);
      }

      // Check for network errors
      if (
        error.message?.includes("Network") ||
        error.message?.includes("timeout")
      ) {
        errorMsg =
          locale === "ar"
            ? "خطأ في الاتصال. تحقق من اتصالك بالإنترنت"
            : "Connection error. Check your internet connection";
      } else if (
        error.message?.includes("Rate limit") ||
        error.status === 429
      ) {
        errorMsg =
          locale === "ar"
            ? "تم تجاوز عدد المحاولات المسموح بها. حاول مرة أخرى بعد قليل"
            : "Too many attempts. Please try again later";
      } else if (error.status === 423) {
        // Account locked
        errorMsg =
          locale === "ar"
            ? "تم قفل الحساب مؤقتاً بسبب محاولات تسجيل دخول فاشلة متعددة"
            : "Account temporarily locked due to multiple failed login attempts";
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[570px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-3xl text-dark mb-2">
              {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
            </h2>
            <p className="text-gray-600">
              {locale === "ar"
                ? "مرحباً بعودتك! سجل دخولك للمتابعة"
                : "Welcome back! Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </p>
                    {attemptsLeft !== null && attemptsLeft > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {locale === "ar"
                          ? `عدد المحاولات المتبقية: ${attemptsLeft}`
                          : `Attempts remaining: ${attemptsLeft}`}
                      </p>
                    )}
                    {attemptsLeft === 0 && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">
                        {locale === "ar"
                          ? "⚠️ تحذير: تم قفل حسابك مؤقتاً"
                          : "⚠️ Warning: Your account has been temporarily locked"}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("");
                      setAttemptsLeft(null);
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                </div>
              </div>
            )}

            {/* Email or Phone */}
            <div className="mb-6">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar"
                  ? "البريد الإلكتروني أو رقم الهاتف"
                  : "Email or Phone Number"}
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
                className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                placeholder={
                  locale === "ar"
                    ? "example@gmail.com أو 01012345678"
                    : "example@gmail.com or 01012345678"
                }
                required
              />
              {identifierType && (
                <p className="text-xs mt-1 flex items-center gap-1">
                  {identifierType === "email" ? (
                    <>
                      <svg
                        className="w-3 h-3 text-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-blue">
                        {locale === "ar"
                          ? "سيتم استخدام البريد الإلكتروني"
                          : "Using email"}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-green-600">
                        {locale === "ar"
                          ? "سيتم استخدام رقم الهاتف"
                          : "Using phone number"}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                placeholder={
                  locale === "ar" ? "أدخل كلمة المرور" : "Enter your password"
                }
                required
              />
            </div>

            {/* Remember Me */}
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue focus:ring-2"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                {locale === "ar" ? "تذكرني " : "Remember me "}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue py-3 px-6 text-base font-medium text-white transition hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {locale === "ar" ? "جاري تسجيل الدخول..." : "Signing in..."}
                </span>
              ) : locale === "ar" ? (
                "تسجيل الدخول"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {locale === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <Link
                href={`/${locale}/register`}
                className="text-blue font-medium hover:underline"
              >
                {locale === "ar" ? "سجل الآن" : "Register now"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
