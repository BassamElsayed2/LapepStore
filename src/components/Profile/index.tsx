"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";
import supabase from "@/services/supabase";
import toast from "react-hot-toast";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  profile_image_url: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderData {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total_price: number;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, requireAuth, signOut, loading } = useAuth();
  const locale = useLocale();
  const t = useTranslations("profile");
  const commonT = useTranslations("common");

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  const fetchProfileData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);

        if (error.code === "PGRST116") {
          // No rows returned - profile doesn't exist
          toast.error(
            "Profile not found. Please try creating an account again."
          );
        } else {
          toast.error(`Failed to load profile data: ${error.message}`);
        }
        return;
      }

      setProfileData(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postal_code: data.postal_code || "",
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error(
        `Failed to load profile data: ${error.message || "Unknown error"}`
      );
    }
  }, [user?.id]);

  const fetchOrdersData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders data");
        return;
      }

      setOrdersData(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders data");
    }
  }, [user?.id]);

  // Require authentication to access this page
  useEffect(() => {
    if (!loading && !user) {
      requireAuth();
    }
  }, [loading, user, requireAuth]);

  // Fetch profile data when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      fetchProfileData();
      fetchOrdersData();
    }
  }, [user, loading, fetchProfileData, fetchOrdersData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        full_name: formData.full_name.trim(),
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        country: formData.country?.trim() || null,
        postal_code: formData.postal_code?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user?.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        toast.error(`Failed to update profile: ${error.message}`);
      } else if (!data || data.length === 0) {
        toast.error("No profile was updated. Please try again.");
      } else {
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Update local state immediately with the returned data
        setProfileData(data[0]);
        setFormData({
          full_name: data[0].full_name || "",
          phone: data[0].phone || "",
          address: data[0].address || "",
          city: data[0].city || "",
          state: data[0].state || "",
          country: data[0].country || "",
          postal_code: data[0].postal_code || "",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        `Failed to update profile: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "paid":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("pending");
      case "paid":
        return t("paid");
      case "shipped":
        return t("shipped");
      case "delivered":
        return t("delivered");
      case "cancelled":
        return t("cancelled");
      default:
        return status;
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will be redirected)
  if (!user) {
    return null;
  }

  return (
    <>
      <Breadcrumb title={t("profile")} pages={[t("profile")]} />
      <section className="overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {t("profile")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("manageYourProfile")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Not Found Error */}
            {!profileData && !loading && (
              <div className="lg:col-span-3 bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-600"
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
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      {locale === "ar"
                        ? "لم يتم العثور على الملف الشخصي"
                        : "Profile Not Found"}
                    </h3>
                    <p className="text-red-700 mb-4">
                      {locale === "ar"
                        ? "يبدو أنك لم تقم بإنشاء حساب. قد يحدث هذا إذا قمت بتسجيل الدخول بدون إنشاء حساب أولاً."
                        : "It seems you haven't created an account. This might happen if you signed in without creating an account first."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={fetchProfileData}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        {locale === "ar"
                          ? "إعادة المحاولة"
                          : "Retry Loading Profile"}
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          window.location.href = `/${locale}/signup`;
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        {locale === "ar"
                          ? "إنشاء حساب جديد"
                          : "Create New Account"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("basicInformation")}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t("email")}
                    </label>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t("accountCreated")}
                    </label>
                    <p className="text-gray-900">
                      {new Date(user.created_at).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t("emailVerified")}
                    </label>
                    <div className="flex items-center">
                      {user.email_confirmed_at ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-700 font-medium">
                            {t("yes")}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-yellow-700 font-medium">
                            {t("no")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t("personalInformation")}
                    </h3>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      {t("edit")}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="full_name"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("fullName")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterFullName")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("phone")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterPhone")}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-semibold text-gray-700 mb-3"
                      >
                        {t("address")}
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={t("enterAddress")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("city")}
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterCity")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("state")}
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterState")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("country")}
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterCountry")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          {t("postalCode")}
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={t("enterPostalCode")}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-2 animate-spin"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            {t("saving")}
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
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
                            {t("saveChanges")}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data to original values
                          if (profileData) {
                            setFormData({
                              full_name: profileData.full_name || "",
                              phone: profileData.phone || "",
                              address: profileData.address || "",
                              city: profileData.city || "",
                              state: profileData.state || "",
                              country: profileData.country || "",
                              postal_code: profileData.postal_code || "",
                            });
                          }
                        }}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        {t("cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("fullName")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.full_name || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("phone")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.phone || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        {t("address")}
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData?.address || (
                          <span className="text-gray-400 italic">
                            {t("notProvided")}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("city")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.city || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("state")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.state || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("country")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.country || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          {t("postalCode")}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData?.postal_code || (
                            <span className="text-gray-400 italic">
                              {t("notProvided")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Orders History Section */}
            <div className="lg:col-span-3 mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.5l1.5-1.5V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("orderHistory")}
                  </h3>
                </div>

                {ordersData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {t("noOrders")}
                    </h4>
                    <p className="text-gray-500">
                      Start shopping to see your orders here!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead>
                        <tr className="border-b border-gray-200 ">
                          <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-1/3 min-w-[200px]">
                            {t("orderId")}
                          </th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-1/6">
                            {t("status")}
                          </th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-1/6">
                            {t("totalPrice")}
                          </th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-1/3">
                            {t("orderDate")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {ordersData.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-4">
                              <button
                                className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 break-all text-left"
                                onClick={() => {
                                  navigator.clipboard.writeText(order.id);
                                  toast.success(
                                    locale === "ar"
                                      ? "تم نسخ رقم الطلب"
                                      : "Order ID copied"
                                  );
                                }}
                                title={
                                  locale === "ar"
                                    ? "اضغط لنسخ رقم الطلب"
                                    : "Click to copy Order ID"
                                }
                              >
                                {order.id}
                              </button>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {formatPrice(order.total_price)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString(
                                locale,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
