"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import PasswordStrengthIndicator from "@/components/Common/PasswordStrengthIndicator";
import {
  isRealEmail,
  isEgyptianPhone,
  normalizeEgyptianPhone,
  validatePassword,
} from "@/utils/validation";

const RegisterPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { signUp, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Real-time email validation
  useEffect(() => {
    if (formData.email) {
      if (!isRealEmail(formData.email)) {
        setEmailError(
          locale === "ar"
            ? "الرجاء إدخال بريد إلكتروني حقيقي"
            : "Please enter a real email "
        );
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [formData.email, locale]);

  // Real-time phone validation
  useEffect(() => {
    if (formData.phone) {
      if (!isEgyptianPhone(formData.phone)) {
        setPhoneError(
          locale === "ar"
            ? "الرجاء إدخال رقم  صحيح (01xxxxxxxxx)"
            : "Please enter a valid Egyptian phone number (01xxxxxxxxx)"
        );
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  }, [formData.phone, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Show password strength when user starts typing password
    if (name === "password" && value) {
      setShowPasswordStrength(true);
    } else if (name === "password" && !value) {
      setShowPasswordStrength(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name
    ) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء جميع الحقول المطلوبة"
          : "Please fill all required fields"
      );
      return;
    }

    // Validate email (real email, not fake)
    if (!isRealEmail(formData.email)) {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال بريد إلكتروني حقيقي (ليس مؤقت)"
          : "Please enter a real email (not disposable)"
      );
      return;
    }

    // Validate phone if provided
    if (formData.phone && !isEgyptianPhone(formData.phone)) {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال رقم هاتف مصري صحيح"
          : "Please enter a valid Egyptian phone number"
      );
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error(
        locale === "ar"
          ? "كلمة المرور يجب أن تحتوي على: 8 أحرف، حرف كبير، حرف صغير، رقم، ورمز مميز"
          : "Password must contain: 8 characters, uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(
        locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize phone number if provided
      const normalizedPhone = formData.phone
        ? normalizeEgyptianPhone(formData.phone)
        : "";

      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: `${formData.first_name} ${formData.last_name}`,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: normalizedPhone,
      });

      if (result.success) {
        toast.success(
          locale === "ar" ? "تم التسجيل بنجاح!" : "Registration successful!"
        );
        router.push(`/${locale}/profile`);
      }
    } catch (error) {
      console.error("Registration error:", error);
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
              {locale === "ar" ? "إنشاء حساب" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {locale === "ar"
                ? "سجل الآن للبدء بالتسوق"
                : "Register now to start shopping"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-dark mb-2"
                >
                  {locale === "ar" ? "الاسم الأول" : "First Name"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                  placeholder={
                    locale === "ar" ? "أدخل الاسم الأول" : "Enter first name"
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-dark mb-2"
                >
                  {locale === "ar" ? "الاسم الأخير" : "Last Name"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                  placeholder={
                    locale === "ar" ? "أدخل الاسم الأخير" : "Enter last name"
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`w-full rounded-md border ${
                  emailError ? "border-red-500" : "border-stroke"
                } bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input`}
                placeholder={
                  locale === "ar" ? "example@gmail.com" : "example@gmail.com"
                }
                required
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
              {formData.email && !emailError && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
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
                  {locale === "ar" ? "بريد إلكتروني صحيح" : "Valid email"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar"
                  ? "رقم الهاتف المصري"
                  : "Egyptian Phone Number"}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className={`w-full rounded-md border ${
                  phoneError ? "border-red-500" : "border-stroke"
                } bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input`}
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
              {phoneError && (
                <p className="text-xs text-red-500 mt-1">{phoneError}</p>
              )}
              {formData.phone && !phoneError && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
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
                  {locale === "ar" ? "رقم هاتف صحيح" : "Valid phone number"}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar" ? "كلمة المرور" : "Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                placeholder={
                  locale === "ar" ? "أدخل كلمة المرور" : "Enter your password"
                }
                required
              />
              {showPasswordStrength && (
                <PasswordStrengthIndicator
                  password={formData.password}
                  locale={locale}
                  showRequirements={true}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-dark mb-2"
              >
                {locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-md border border-stroke bg-white py-3 px-6 text-base text-dark outline-none transition focus:border-blue focus:shadow-input"
                placeholder={
                  locale === "ar"
                    ? "أعد إدخال كلمة المرور"
                    : "Re-enter password"
                }
                required
              />
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
                  {locale === "ar"
                    ? "جاري إنشاء الحساب..."
                    : "Creating account..."}
                </span>
              ) : locale === "ar" ? (
                "إنشاء حساب"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {locale === "ar"
                ? "لديك حساب بالفعل؟"
                : "Already have an account?"}{" "}
              <Link
                href={`/${locale}/login`}
                className="text-blue font-medium hover:underline"
              >
                {locale === "ar" ? "سجل دخولك" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
