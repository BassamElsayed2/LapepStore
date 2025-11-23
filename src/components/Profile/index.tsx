"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/store";
import Breadcrumb from "../Common/Breadcrumb";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type CreateAddressData,
} from "@/services/apiAddresses";
import { getUserOrders, type Order } from "@/services/apiOrders";
import { EGYPTIAN_GOVERNORATES } from "@/constants/governorates";

const Profile = () => {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUserProfile, updatePassword, loading } = useAuth();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  // Get tab from URL or default to "profile"
  const tabFromUrl = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshingProfile, setRefreshingProfile] = useState(false);

  // Update activeTab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "password", "addresses", "orders"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Profile form data (from profiles table)
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState<CreateAddressData>({
    street: "",
    building: "",
    floor: "",
    apartment: "",
    area: "",
    city: "",
    notes: "",
    is_default: false,
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const ordersPerPage = 3;

  // Refresh profile data from server when component mounts
  useEffect(() => {
    let isMounted = true;

    const refreshProfileData = async () => {
      setRefreshingProfile(true);
      try {
        const { getCurrentUser } = await import("@/services/apiAuth");
        const result = await getCurrentUser();

        if (result.success && result.data && isMounted) {
          // Update profile form with fresh data
          setProfileData({
            full_name: result.data.full_name || result.data.name || "",
            phone: result.data.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to refresh profile data:", error);
      } finally {
        if (isMounted) {
          setRefreshingProfile(false);
        }
      }
    };

    refreshProfileData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Initialize form with user data from profiles table
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Load addresses when tab changes to addresses
  useEffect(() => {
    if (activeTab === "addresses" && user) {
      loadAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Load orders when tab changes to orders
  useEffect(() => {
    if (activeTab === "orders" && user) {
      loadOrders();
      setCurrentOrderPage(1); // Reset to first page when loading orders
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Load addresses function
  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await getAddresses();
      if (response.success && response.data) {
        setAddresses(response.data);
      } else {
        toast.error(
          locale === "ar" ? "فشل في تحميل العناوين" : "Failed to load addresses"
        );
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Load orders function
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getUserOrders();
      if (response.orders) {
        setOrders(response.orders);
      } else {
        toast.error(
          locale === "ar" ? "فشل في تحميل الطلبات" : "Failed to load orders"
        );
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Handle profile input change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile update (updates profiles table)
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.full_name) {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال الاسم الكامل"
          : "Please enter your full name"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateUserProfile(profileData);

      if (result.success) {
        toast.success(
          locale === "ar"
            ? "تم تحديث الملف الشخصي بنجاح"
            : "Profile updated successfully"
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء جميع حقول كلمة المرور"
          : "Please fill all password fields"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(
        locale === "ar"
          ? "كلمة المرور الجديدة غير متطابقة"
          : "New passwords do not match"
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(
        locale === "ar"
          ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        toast.success(
          locale === "ar"
            ? "تم تغيير كلمة المرور بنجاح"
            : "Password changed successfully"
        );
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address handlers
  const handleAddressInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setAddressFormData({
      ...addressFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressFormData({
        street: address.street || "",
        building: address.building || "",
        floor: address.floor || "",
        apartment: address.apartment || "",
        area: address.area || "",
        city: address.city || "",
        notes: address.notes || "",
        is_default: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setAddressFormData({
        street: "",
        building: "",
        floor: "",
        apartment: "",
        area: "",
        city: "",
        notes: "",
        is_default: false,
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressFormData({
      street: "",
      building: "",
      floor: "",
      apartment: "",
      area: "",
      city: "",
      notes: "",
      is_default: false,
    });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressFormData.street || !addressFormData.city) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء الحقول المطلوبة (الشارع والمدينة)"
          : "Please fill required fields (Street and City)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (editingAddress) {
        response = await updateAddress(editingAddress.id, addressFormData);
      } else {
        response = await createAddress(addressFormData);
      }

      if (response.success) {
        toast.success(
          locale === "ar"
            ? editingAddress
              ? "تم تحديث العنوان بنجاح"
              : "تم إضافة العنوان بنجاح"
            : editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        closeAddressModal();
        loadAddresses();

        // Redirect after adding a new address (not when editing)
        if (!editingAddress) {
          // Check if there are items in cart
          if (cartItems.length > 0) {
            // Redirect to checkout if cart has items
            router.push(`/${locale}/checkout`);
          } else {
            // Redirect to shop if cart is empty
            router.push(`/${locale}/shop`);
          }
        }
      } else {
        toast.error(response.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Address save error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ أثناء حفظ العنوان" : "Error saving address"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (
      !confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذا العنوان؟"
          : "Are you sure you want to delete this address?"
      )
    ) {
      return;
    }

    try {
      const response = await deleteAddress(addressId);
      if (response.success) {
        toast.success(
          locale === "ar"
            ? "تم حذف العنوان بنجاح"
            : "Address deleted successfully"
        );
        loadAddresses();
      } else {
        toast.error(response.error || "Failed to delete address");
      }
    } catch (error) {
      console.error("Address delete error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ أثناء حذف العنوان" : "Error deleting address"
      );
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await setDefaultAddress(addressId);
      if (response.success) {
        toast.success(
          locale === "ar"
            ? "تم تعيين العنوان كافتراضي"
            : "Address set as default"
        );
        loadAddresses();
      } else {
        toast.error(response.error || "Failed to set default address");
      }
    } catch (error) {
      console.error("Set default error:", error);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء تعيين العنوان الافتراضي"
          : "Error setting default address"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-dark mb-4">
            {locale === "ar"
              ? "الرجاء تسجيل الدخول لعرض ملفك الشخصي"
              : "Please login to view your profile"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        title={locale === "ar" ? "الملف الشخصي" : "Profile"}
        pages={[locale === "ar" ? "الملف الشخصي" : "profile"]}
      />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Sidebar */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                {/* User Info */}
                <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden bg-gray-3 flex items-center justify-center">
                    {user.full_name || user.name ? (
                      <span className="text-2xl font-bold text-blue">
                        {(user.full_name || user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    ) : (
                      <svg
                        className="fill-blue"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16 4C12.6863 4 10 6.68629 10 10C10 13.3137 12.6863 16 16 16C19.3137 16 22 13.3137 22 10C22 6.68629 19.3137 4 16 4ZM12 10C12 7.79086 13.7909 6 16 6C18.2091 6 20 7.79086 20 10C20 12.2091 18.2091 14 16 14C13.7909 14 12 12.2091 12 10Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16 18C11.5817 18 7.99999 20.6863 7.99999 24C7.99999 25.1046 8.89542 26 9.99999 26H22C23.1046 26 24 25.1046 24 24C24 20.6863 20.4183 18 16 18ZM9.99999 24C9.99999 21.7909 12.6863 20 16 20C19.3137 20 22 21.7909 22 24H9.99999Z"
                        />
                      </svg>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-dark mb-0.5">
                      {user.full_name || user.name || "User"}
                    </p>
                    <p className="text-custom-xs text-dark-5">{user.email}</p>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-4 sm:p-7.5 xl:p-9 w-full">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "profile"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.9995 1.14581C8.59473 1.14581 6.64531 3.09524 6.64531 5.49998C6.64531 7.90472 8.59473 9.85415 10.9995 9.85415C13.4042 9.85415 15.3536 7.90472 15.3536 5.49998C15.3536 3.09524 13.4042 1.14581 10.9995 1.14581ZM8.02031 5.49998C8.02031 3.85463 9.35412 2.52081 10.9995 2.52081C12.6448 2.52081 13.9786 3.85463 13.9786 5.49998C13.9786 7.14533 12.6448 8.47915 10.9995 8.47915C9.35412 8.47915 8.02031 7.14533 8.02031 5.49998Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.9995 11.2291C8.87872 11.2291 6.92482 11.7112 5.47697 12.5256C4.05066 13.3279 2.97864 14.5439 2.97864 16.0416L2.97858 16.1351C2.97754 17.2001 2.97624 18.5368 4.14868 19.4916C4.7257 19.9614 5.53291 20.2956 6.6235 20.5163C7.71713 20.7377 9.14251 20.8541 10.9995 20.8541C12.8564 20.8541 14.2818 20.7377 15.3754 20.5163C16.466 20.2956 17.2732 19.9614 17.8503 19.4916C19.0227 18.5368 19.0214 17.2001 19.0204 16.1351L19.0203 16.0416C19.0203 14.5439 17.9483 13.3279 16.522 12.5256C15.0741 11.7112 13.1202 11.2291 10.9995 11.2291ZM4.35364 16.0416C4.35364 15.2612 4.92324 14.4147 6.15108 13.724C7.35737 13.0455 9.07014 12.6041 10.9995 12.6041C12.9288 12.6041 14.6416 13.0455 15.8479 13.724C17.0757 14.4147 17.6453 15.2612 17.6453 16.0416C17.6453 17.2405 17.6084 17.9153 16.982 18.4254C16.6424 18.702 16.0746 18.9719 15.1027 19.1686C14.1338 19.3648 12.8092 19.4791 10.9995 19.4791C9.18977 19.4791 7.86515 19.3648 6.89628 19.1686C5.92437 18.9719 5.35658 18.702 5.01693 18.4254C4.39059 17.9153 4.35364 17.2405 4.35364 16.0416Z"
                        />
                      </svg>
                      {locale === "ar"
                        ? "معلومات الملف الشخصي"
                        : "Profile Information"}
                    </button>

                    <button
                      onClick={() => setActiveTab("password")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "password"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.95833 6.41667C5.95833 3.77183 8.10516 1.625 10.75 1.625C13.3948 1.625 15.5417 3.77183 15.5417 6.41667V8.25H16.5C17.9728 8.25 19.1667 9.44391 19.1667 10.9167V17.4167C19.1667 18.8894 17.9728 20.0833 16.5 20.0833H5C3.52724 20.0833 2.33333 18.8894 2.33333 17.4167V10.9167C2.33333 9.44391 3.52724 8.25 5 8.25H5.95833V6.41667ZM7.33333 8.25H14.1667V6.41667C14.1667 4.53198 12.6346 3 10.75 3C8.86535 3 7.33333 4.53198 7.33333 6.41667V8.25ZM5 9.625C4.28756 9.625 3.70833 10.2042 3.70833 10.9167V17.4167C3.70833 18.1291 4.28756 18.7083 5 18.7083H16.5C17.2124 18.7083 17.7917 18.1291 17.7917 17.4167V10.9167C17.7917 10.2042 17.2124 9.625 16.5 9.625H5Z"
                        />
                      </svg>
                      {locale === "ar"
                        ? "تغيير كلمة المرور"
                        : "Change Password"}
                    </button>

                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "addresses"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.0007 1.14581C10.3515 1.14581 9.7618 1.33173 9.12199 1.64287C8.50351 1.94363 7.78904 2.38706 6.8966 2.94094L5.00225 4.11664C4.15781 4.6407 3.48164 5.06035 2.96048 5.45947C2.42079 5.87278 2.00627 6.29371 1.70685 6.84072C1.40806 7.38659 1.2735 7.96741 1.20899 8.65396C1.14647 9.31931 1.14648 10.1329 1.14648 11.1533V12.6315C1.14647 14.3767 1.14646 15.7543 1.28646 16.8315C1.43008 17.9364 1.73183 18.8284 2.41365 19.5336C3.0986 20.2421 3.97024 20.5587 5.04929 20.7087C6.0951 20.8542 7.43075 20.8542 9.11401 20.8541H12.8872C14.5705 20.8542 15.9062 20.8542 16.952 20.7087C18.0311 20.5587 18.9027 20.2421 19.5877 19.5336C20.2695 18.8284 20.5712 17.9364 20.7148 16.8315C20.8548 15.7543 20.8548 14.3768 20.8548 12.6315V11.1533C20.8548 10.1329 20.8548 9.31929 20.7923 8.65396C20.7278 7.96741 20.5932 7.38659 20.2944 6.84072C19.995 6.29371 19.5805 5.87278 19.0408 5.45947C18.5197 5.06035 17.8435 4.64071 16.9991 4.11665L15.1047 2.94093C14.2123 2.38706 13.4978 1.94363 12.8793 1.64287C12.2395 1.33173 11.6498 1.14581 11.0007 1.14581Z"
                        />
                      </svg>
                      {locale === "ar" ? "العناوين" : "Addresses"}
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "orders"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.75 5.95833C2.75 5.07789 3.46205 4.36583 4.34249 4.36583H17.6575C18.538 4.36583 19.25 5.07789 19.25 5.95833V16.0417C19.25 16.9221 18.538 17.6342 17.6575 17.6342H4.34249C3.46205 17.6342 2.75 16.9221 2.75 16.0417V5.95833ZM4.34249 5.86583C4.29048 5.86583 4.25 5.90631 4.25 5.95833V16.0417C4.25 16.0937 4.29048 16.1342 4.34249 16.1342H17.6575C17.7095 16.1342 17.75 16.0937 17.75 16.0417V5.95833C17.75 5.90631 17.7095 5.86583 17.6575 5.86583H4.34249Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.33325 2.75C7.74747 2.75 8.08325 3.08579 8.08325 3.5V5.5C8.08325 5.91421 7.74747 6.25 7.33325 6.25C6.91904 6.25 6.58325 5.91421 6.58325 5.5V3.5C6.58325 3.08579 6.91904 2.75 7.33325 2.75Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.6667 2.75C15.0809 2.75 15.4167 3.08579 15.4167 3.5V5.5C15.4167 5.91421 15.0809 6.25 14.6667 6.25C14.2525 6.25 13.9167 5.91421 13.9167 5.5V3.5C13.9167 3.08579 14.2525 2.75 14.6667 2.75Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.75 8.70825C2.75 8.29404 3.08579 7.95825 3.5 7.95825H18.5C18.9142 7.95825 19.25 8.29404 19.25 8.70825C19.25 9.12247 18.9142 9.45825 18.5 9.45825H3.5C3.08579 9.45825 2.75 9.12247 2.75 8.70825Z"
                        />
                      </svg>
                      {locale === "ar" ? "الطلبات" : "Orders"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="xl:max-w-[770px] w-full">
              {/* Profile Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 p-4 sm:p-8.5 ${
                  activeTab === "profile" ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-between mb-7">
                  <h3 className="font-medium text-xl sm:text-2xl text-dark">
                    {locale === "ar"
                      ? "تحديث معلومات الملف الشخصي"
                      : "Update Profile Information"}
                  </h3>
                  {refreshingProfile ? (
                    <div className="flex items-center gap-2 text-sm text-blue">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue"></div>
                      <span>
                        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        setRefreshingProfile(true);
                        try {
                          const { getCurrentUser } = await import(
                            "@/services/apiAuth"
                          );
                          const result = await getCurrentUser();

                          if (result.success && result.data) {
                            setProfileData({
                              full_name:
                                result.data.full_name || result.data.name || "",
                              phone: result.data.phone || "",
                            });
                            toast.success(
                              locale === "ar"
                                ? "تم تحديث البيانات"
                                : "Data refreshed"
                            );
                          }
                        } catch (error) {
                          console.error("Failed to refresh:", error);
                        } finally {
                          setRefreshingProfile(false);
                        }
                      }}
                      className="text-sm text-blue hover:text-blue-dark flex items-center gap-1"
                      title={
                        locale === "ar"
                          ? "إعادة تحميل البيانات"
                          : "Refresh data"
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                      </svg>
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit}>
                  {/* Email - Read Only (من جدول users) */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block mb-2.5 text-dark">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none cursor-not-allowed"
                    />
                    <p className="text-xs text-dark-5 mt-1">
                      {locale === "ar"
                        ? "لا يمكن تعديل البريد الإلكتروني"
                        : "Email cannot be changed"}
                    </p>
                  </div>

                  {/* Full Name - من جدول profiles */}
                  <div className="mb-5">
                    <label
                      htmlFor="full_name"
                      className="block mb-2.5 text-dark"
                    >
                      {locale === "ar" ? "الاسم الكامل" : "Full Name"}{" "}
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      placeholder={
                        locale === "ar"
                          ? "أدخل اسمك الكامل"
                          : "Enter your full name"
                      }
                      required
                    />
                  </div>

                  {/* Phone - من جدول profiles */}
                  <div className="mb-7">
                    <label htmlFor="phone" className="block mb-2.5 text-dark">
                      {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      placeholder={
                        locale === "ar"
                          ? "أدخل رقم هاتفك"
                          : "Enter your phone number"
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? locale === "ar"
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : locale === "ar"
                      ? "حفظ التغييرات"
                      : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Password Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 p-4 sm:p-8.5 ${
                  activeTab === "password" ? "block" : "hidden"
                }`}
              >
                <h3 className="font-medium text-xl sm:text-2xl text-dark mb-7">
                  {locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                </h3>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-5">
                    <label
                      htmlFor="currentPassword"
                      className="block mb-2.5 text-dark"
                    >
                      {locale === "ar"
                        ? "كلمة المرور الحالية"
                        : "Current Password"}{" "}
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      placeholder={
                        locale === "ar"
                          ? "أدخل كلمة المرور الحالية"
                          : "Enter current password"
                      }
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="newPassword"
                      className="block mb-2.5 text-dark"
                    >
                      {locale === "ar" ? "كلمة المرور الجديدة" : "New Password"}{" "}
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      placeholder={
                        locale === "ar"
                          ? "أدخل كلمة المرور الجديدة"
                          : "Enter new password"
                      }
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2.5 text-dark"
                    >
                      {locale === "ar"
                        ? "تأكيد كلمة المرور الجديدة"
                        : "Confirm New Password"}{" "}
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      placeholder={
                        locale === "ar"
                          ? "أعد إدخال كلمة المرور الجديدة"
                          : "Re-enter new password"
                      }
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? locale === "ar"
                        ? "جاري التغيير..."
                        : "Changing..."
                      : locale === "ar"
                      ? "تغيير كلمة المرور"
                      : "Change Password"}
                  </button>
                </form>
              </div>

              {/* Addresses Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 p-4 sm:p-8.5 ${
                  activeTab === "addresses" ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-between mb-7">
                  <h3 className="font-medium text-xl sm:text-2xl text-dark">
                    {locale === "ar" ? "عناويني" : "My Addresses"}
                  </h3>
                  <button
                    onClick={() => openAddressModal()}
                    className="inline-flex items-center gap-2 font-medium text-white bg-blue py-2.5 px-5 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path
                        d="M10 4V16M4 10H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {locale === "ar" ? "إضافة عنوان" : "Add Address"}
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 text-dark-5">
                    <svg
                      className="mx-auto mb-4 text-gray-3"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="9"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="text-lg">
                      {locale === "ar"
                        ? "لا توجد عناوين محفوظة"
                        : "No saved addresses"}
                    </p>
                    <p className="text-sm mt-2">
                      {locale === "ar"
                        ? "اضغط 'إضافة عنوان' لحفظ عنوان جديد"
                        : "Click 'Add Address' to save a new address"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`relative border rounded-lg p-4 ${
                          address.is_default
                            ? "border-blue bg-blue/5"
                            : "border-gray-3"
                        }`}
                      >
                        {address.is_default && (
                          <span className="absolute top-2 right-2 bg-blue text-white text-xs px-2 py-1 rounded">
                            {locale === "ar" ? "افتراضي" : "Default"}
                          </span>
                        )}

                        <div className="mb-4 mt-6">
                          <p className="font-medium text-dark mb-2">
                            {address.street}
                          </p>
                          <div className="text-sm text-dark-5 space-y-1">
                            {address.building && (
                              <p>
                                {locale === "ar" ? "المبنى: " : "Building: "}
                                {address.building}
                              </p>
                            )}
                            {address.floor && (
                              <p>
                                {locale === "ar" ? "الدور: " : "Floor: "}
                                {address.floor}
                              </p>
                            )}
                            {address.apartment && (
                              <p>
                                {locale === "ar" ? "الشقة: " : "Apartment: "}
                                {address.apartment}
                              </p>
                            )}
                            {address.area && (
                              <p>
                                {locale === "ar" ? "المنطقة: " : "Area: "}
                                {address.area}
                              </p>
                            )}
                            <p className="font-medium">{address.city}</p>
                            {address.notes && (
                              <p className="text-xs mt-2 italic">
                                {address.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-3">
                          {!address.is_default && (
                            <button
                              onClick={() =>
                                handleSetDefaultAddress(address.id)
                              }
                              className="flex-1 text-xs sm:text-sm py-2 px-3 border border-blue text-blue rounded hover:bg-blue hover:text-white duration-200"
                            >
                              {locale === "ar"
                                ? "اجعله افتراضي"
                                : "Set Default"}
                            </button>
                          )}
                          <button
                            onClick={() => openAddressModal(address)}
                            className="flex-1 text-xs sm:text-sm py-2 px-3 border border-gray-3 text-dark rounded hover:bg-gray-1 duration-200"
                          >
                            {locale === "ar" ? "تعديل" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="flex-1 text-xs sm:text-sm py-2 px-3 border border-red text-red rounded hover:bg-red hover:text-white duration-200"
                          >
                            {locale === "ar" ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orders Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 p-4 sm:p-8.5 ${
                  activeTab === "orders" ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-between mb-7">
                  <h3 className="font-medium text-xl sm:text-2xl text-dark">
                    {locale === "ar" ? "طلباتي" : "My Orders"}
                  </h3>
                  {orders.filter((order) => order.status !== "pending").length >
                    0 && (
                    <span className="bg-blue/10 text-blue px-3 py-1 rounded-full text-sm font-medium">
                      {
                        orders.filter((order) => order.status !== "pending")
                          .length
                      }{" "}
                      {locale === "ar" ? "طلب" : "Orders"}
                    </span>
                  )}
                </div>

                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
                  </div>
                ) : orders.length === 0 ||
                  orders.filter((order) => order.status !== "pending")
                    .length === 0 ? (
                  <div className="text-center py-12 text-dark-5">
                    <svg
                      className="mx-auto mb-4 text-gray-3"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <p className="text-lg">
                      {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                    </p>
                    <p className="text-sm mt-2">
                      {locale === "ar"
                        ? "ابدأ التسوق الآن لتقديم طلبك الأول"
                        : "Start shopping to place your first order"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {orders
                        .filter((order) => order.status !== "pending")
                        .slice(
                          (currentOrderPage - 1) * ordersPerPage,
                          currentOrderPage * ordersPerPage
                        )
                        .map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-3 rounded-lg p-4 hover:border-blue transition-colors"
                          >
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-gray-3">
                              <div>
                                <p className="text-sm text-dark-5">
                                  {locale === "ar" ? "رقم الطلب:" : "Order #"}
                                </p>
                                <p className="font-medium text-dark">
                                  {order.id.substring(0, 8)}...
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-dark-5">
                                  {locale === "ar" ? "التاريخ:" : "Date:"}
                                </p>
                                <p className="text-sm text-dark">
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString(
                                    locale === "ar" ? "ar-EG" : "en-US"
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                              {order.order_items?.map((item, index) => (
                                <div
                                  key={item.id || index}
                                  className="flex items-center gap-4 p-3 bg-gray-1 rounded-lg"
                                >
                                  <div className="w-16 h-16 bg-gray-2 rounded-lg overflow-hidden flex-shrink-0 border border-gray-3">
                                    {item.product?.images &&
                                    item.product.images[0] ? (
                                      <Image
                                        src={item.product.images[0]}
                                        alt={item.product.title || "Product"}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-2 flex items-center justify-center">
                                        <svg
                                          className="w-8 h-8 text-gray-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-dark mb-1 truncate">
                                      {item.product?.title ||
                                        (locale === "ar" ? "منتج" : "Product")}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-dark-5">
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">
                                          {locale === "ar" ? "الكمية:" : "Qty:"}
                                        </span>
                                        <span className="font-bold text-dark">
                                          {item.quantity}
                                        </span>
                                      </span>
                                      <span className="text-gray-4">•</span>
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">
                                          {locale === "ar"
                                            ? "السعر:"
                                            : "Price:"}
                                        </span>
                                        <span className="font-bold text-blue">
                                          {item.price.toFixed(2)}{" "}
                                          {locale === "ar" ? "ج.م" : "EGP"}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "paid" ||
                                        order.status === "confirmed"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : order.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {locale === "ar"
                                    ? order.status === "delivered"
                                      ? "تم التوصيل"
                                      : order.status === "shipped"
                                      ? "قيد الشحن"
                                      : order.status === "paid" ||
                                        order.status === "confirmed"
                                      ? "تم الدفع"
                                      : order.status === "cancelled"
                                      ? "ملغي"
                                      : "قيد الانتظار"
                                    : order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                </span>
                                {order.order_items && (
                                  <span className="text-xs text-dark-5">
                                    {order.order_items.length}{" "}
                                    {locale === "ar"
                                      ? order.order_items.length === 1
                                        ? "منتج"
                                        : "منتجات"
                                      : order.order_items.length === 1
                                      ? "item"
                                      : "items"}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-dark-5">
                                  {locale === "ar" ? "المجموع:" : "Total:"}
                                </p>
                                <p className="text-lg font-bold text-blue">
                                  {order.total_price.toFixed(2)}{" "}
                                  {locale === "ar" ? "ج.م" : "EGP"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {orders.filter((order) => order.status !== "pending")
                      .length > ordersPerPage && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-6 pt-6 border-t border-gray-3">
                        <button
                          onClick={() =>
                            setCurrentOrderPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentOrderPage === 1}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all ${
                            currentOrderPage === 1
                              ? "bg-gray-2 text-gray-4 cursor-not-allowed"
                              : "bg-blue text-white hover:bg-blue-dark hover:shadow-md"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {locale === "ar" ? (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                                <span>السابق</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                                <span>Previous</span>
                              </>
                            )}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          {Array.from(
                            {
                              length: Math.ceil(
                                orders.filter(
                                  (order) => order.status !== "pending"
                                ).length / ordersPerPage
                              ),
                            },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentOrderPage(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                currentOrderPage === page
                                  ? "bg-blue text-white shadow-md scale-110"
                                  : "bg-gray-2 text-dark hover:bg-gray-3 hover:scale-105"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentOrderPage((prev) =>
                              Math.min(
                                prev + 1,
                                Math.ceil(
                                  orders.filter(
                                    (order) => order.status !== "pending"
                                  ).length / ordersPerPage
                                )
                              )
                            )
                          }
                          disabled={
                            currentOrderPage ===
                            Math.ceil(
                              orders.filter(
                                (order) => order.status !== "pending"
                              ).length / ordersPerPage
                            )
                          }
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all ${
                            currentOrderPage ===
                            Math.ceil(
                              orders.filter(
                                (order) => order.status !== "pending"
                              ).length / ordersPerPage
                            )
                              ? "bg-gray-2 text-gray-4 cursor-not-allowed"
                              : "bg-blue text-white hover:bg-blue-dark hover:shadow-md"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {locale === "ar" ? (
                              <>
                                <span>التالي</span>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </>
                            ) : (
                              <>
                                <span>Next</span>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-dark">
                  {editingAddress
                    ? locale === "ar"
                      ? "تعديل العنوان"
                      : "Edit Address"
                    : locale === "ar"
                    ? "إضافة عنوان جديد"
                    : "Add New Address"}
                </h3>
                <button
                  onClick={closeAddressModal}
                  className="text-dark-5 hover:text-dark"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Street */}
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "الشارع" : "Street"}{" "}
                    <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    value={addressFormData.street}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    placeholder={
                      locale === "ar"
                        ? "مثال: شارع التحرير"
                        : "e.g., Tahrir Street"
                    }
                    required
                  />
                </div>

                {/* Building */}
                <div>
                  <label htmlFor="building" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "المبنى" : "Building"}
                  </label>
                  <input
                    type="text"
                    name="building"
                    id="building"
                    value={addressFormData.building}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    placeholder={locale === "ar" ? "مثال: 123" : "e.g., 123"}
                  />
                </div>

                {/* Floor */}
                <div>
                  <label htmlFor="floor" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "الدور/الطابق" : "Floor"}
                  </label>
                  <input
                    type="text"
                    name="floor"
                    id="floor"
                    value={addressFormData.floor}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    placeholder={locale === "ar" ? "مثال: 3" : "e.g., 3"}
                  />
                </div>

                {/* Apartment */}
                <div>
                  <label htmlFor="apartment" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "الشقة" : "Apartment"}
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    id="apartment"
                    value={addressFormData.apartment}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    placeholder={locale === "ar" ? "مثال: 5" : "e.g., 5"}
                  />
                </div>

                {/* Area */}
                <div>
                  <label htmlFor="area" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "المنطقة" : "Area"}
                  </label>
                  <input
                    type="text"
                    name="area"
                    id="area"
                    value={addressFormData.area}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    placeholder={
                      locale === "ar" ? "مثال: المعادي" : "e.g., Maadi"
                    }
                  />
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "المحافظة" : "Governorate"}{" "}
                    <span className="text-red">*</span>
                  </label>
                  <select
                    name="city"
                    id="city"
                    value={addressFormData.city || ""}
                    onChange={handleAddressInputChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    required
                  >
                    <option value="">
                      {locale === "ar" ? "اختر المحافظة" : "Select Governorate"}
                    </option>
                    {EGYPTIAN_GOVERNORATES.map((gov) => (
                      <option key={gov.ar} value={gov.ar}>
                        {gov.ar}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block mb-2.5 text-dark">
                    {locale === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    value={addressFormData.notes}
                    onChange={handleAddressInputChange}
                    rows={3}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-none"
                    placeholder={
                      locale === "ar"
                        ? "أي ملاحظات إضافية للعنوان..."
                        : "Any additional notes about the address..."
                    }
                  />
                </div>

                {/* Set as Default */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressFormData.is_default}
                      onChange={handleAddressInputChange}
                      className="w-5 h-5 rounded border-gray-3 text-blue focus:ring-2 focus:ring-blue/20"
                    />
                    <span className="text-dark">
                      {locale === "ar"
                        ? "اجعل هذا العنوان افتراضياً"
                        : "Set as default address"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-7 pt-6 border-t border-gray-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="flex-1 py-3 px-6 border border-gray-3 text-dark rounded-md hover:bg-gray-1 duration-200"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-blue text-white rounded-md hover:bg-blue-dark duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جاري الحفظ..."
                      : "Saving..."
                    : editingAddress
                    ? locale === "ar"
                      ? "تحديث العنوان"
                      : "Update Address"
                    : locale === "ar"
                    ? "إضافة العنوان"
                    : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
