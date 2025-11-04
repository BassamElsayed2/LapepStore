"use client";

import { useEffect, useState } from "react";
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

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Get initial user from localStorage
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        
        if (storedUser) {
          // Set user immediately from localStorage (optimistic)
          setAuthState({
            user: storedUser,
            loading: false,
          });

          // Verify user is still valid with backend (in background)
          try {
            const result = await Promise.race([
              getCurrentUser(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
              )
            ]);
            
            if (result && (result as any).success && (result as any).data) {
              setAuthState({
                user: (result as any).data,
                loading: false,
              });
            } else {
              // Token expired or invalid, keep storedUser for now
              console.warn('Failed to verify user, using cached user');
            }
          } catch (error) {
            console.warn('Backend verification failed, using cached user:', error);
            // Keep using storedUser, don't clear it
          }
        } else {
          setAuthState({
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (data: RegisterData) => {
    try {
      const result = await registerApi(data);

      if (result.success && result.data) {
        setAuthState({
          user: result.data.user,
          loading: false,
        });

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
        setAuthState({
          user: result.data.user,
          loading: false,
        });

        toast.success(
          locale === "ar"
            ? "تم تسجيل الدخول بنجاح!"
            : "Signed in successfully!"
        );

        // Redirect to profile or home
        router.push(`/${locale}/profile`);
        return { success: true, data: result.data };
      } else {
        toast.error(
          result.error ||
            (locale === "ar"
              ? "فشل تسجيل الدخول"
              : "Login failed")
        );
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء تسجيل الدخول"
          : "An error occurred during signin"
      );
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await logoutApi();

      setAuthState({
        user: null,
        loading: false,
      });

      toast.success(
        locale === "ar"
          ? "تم تسجيل الخروج بنجاح!"
          : "Signed out successfully!"
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
        setAuthState({
          user: result.data,
          loading: false,
        });

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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
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

  return {
    user: authState.user,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    updatePassword,
  };
};
