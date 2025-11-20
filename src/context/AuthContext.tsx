"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  getStoredUser,
  type User,
  type RegisterData,
  type LoginData,
} from "@/services/apiAuth";
import { getAddresses } from "@/services/apiAddresses";
import { store } from "@/redux/store";

/**
 * Translate login error messages
 */
const translateLoginError = (error: string, locale: string): string => {
  if (locale === "ar") {
    if (error.includes("No account found with this email")) {
      return "لا يوجد حساب مسجل بهذا البريد الإلكتروني";
    }
    if (error.includes("No account found with this phone")) {
      return "لا يوجد حساب مسجل بهذا الرقم";
    }
    if (error.includes("Incorrect password")) {
      return "كلمة المرور غير صحيحة. حاول مرة أخرى";
    }
    if (error.includes("Invalid credentials")) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }
    return "فشل تسجيل الدخول. تحقق من بياناتك";
  }
  return error || "Login failed";
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: RegisterData) => Promise<{ success: boolean; data?: any; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; data?: any; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  console.log("🎯 AuthProvider: Rendering with user:", user ? user.email : "null");

  useEffect(() => {
    // Get initial user from localStorage
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();

        if (storedUser) {
          // Set user immediately from localStorage (optimistic)
          setUser(storedUser);
          setLoading(false);

          // Verify user is still valid with backend (in background)
          try {
            const result = await Promise.race([
              getCurrentUser(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 5000)
              ),
            ]);

            if (result && (result as any).success && (result as any).data) {
              setUser((result as any).data);
            } else {
              // Token expired or invalid, keep storedUser for now
              console.warn("Failed to verify user, using cached user");
            }
          } catch (error) {
            console.warn(
              "Backend verification failed, using cached user:",
              error
            );
            // Keep using storedUser, don't clear it
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (data: RegisterData) => {
    try {
      const result = await registerApi(data);

      if (result.success && result.data) {
        setUser(result.data.user);

        toast.success(
          locale === "ar"
            ? "تم إنشاء الحساب بنجاح!"
            : "Account created successfully!"
        );

        return { success: true, data: result.data };
      } else {
        toast.error(result.error || "Registration failed");
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await loginApi({ email, password });

      if (result.success && result.data) {
        console.log("🔐 AuthContext: Setting user data", result.data.user);
        setUser(result.data.user);
        console.log("✅ AuthContext: User data set successfully");

        toast.success(
          locale === "ar" ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!"
        );

        // Check cart items
        const state = store.getState();
        const cartItems = state.cartReducer.items || [];
        const hasCartItems = cartItems.length > 0;

        // Check addresses
        const addressesResult = await getAddresses();
        const hasAddress = addressesResult.success && 
                          addressesResult.data && 
                          addressesResult.data.length > 0;

        // Redirect logic based on cart and address state
        if (hasAddress && hasCartItems) {
          // Has address and cart items -> go to checkout
          router.push(`/${locale}/checkout`);
        } else if (!hasAddress) {
          // No address -> go to profile addresses tab
          router.push(`/${locale}/profile?tab=addresses`);
        } else if (hasAddress && !hasCartItems) {
          // Has address but cart is empty -> go to shop
          router.push(`/${locale}/shop`);
        } else {
          // Fallback to profile
          router.push(`/${locale}/profile`);
        }

        return { success: true, data: result.data };
      } else {
        // Translate error message to Arabic
        const errorMessage = translateLoginError(result.error || "", locale);
        // Don't show toast, return error for component to display
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      const errorMessage = translateLoginError(
        error?.message || "An error occurred during signin",
        locale
      );
      // Don't show toast, return error for component to display
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await logoutApi();

      setUser(null);

      toast.success(
        locale === "ar" ? "تم تسجيل الخروج بنجاح!" : "Signed out successfully!"
      );

      router.push(`/${locale}`);
    } catch (error) {
      console.error("Signout error:", error);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء تسجيل الخروج"
          : "An error occurred during signout"
      );
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const result = await updateProfileApi(data);

      if (result.success && result.data) {
        setUser(result.data);

        toast.success(
          locale === "ar"
            ? "تم تحديث الملف الشخصي بنجاح!"
            : "Profile updated successfully!"
        );

        return { success: true, data: result.data };
      } else {
        toast.error(result.error || "Failed to update profile");
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error("An error occurred while updating profile");
      return { success: false, error };
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const result = await changePasswordApi(currentPassword, newPassword);

      if (result.success) {
        toast.success(
          locale === "ar"
            ? "تم تغيير كلمة المرور بنجاح!"
            : "Password changed successfully!"
        );

        return { success: true };
      } else {
        toast.error(result.error || "Failed to change password");
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error("An error occurred while changing password");
      return { success: false, error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

