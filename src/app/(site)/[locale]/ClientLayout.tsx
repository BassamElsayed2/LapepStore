"use client";
import { useState, useEffect } from "react";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import AgeVerificationModal from "@/components/Common/AgeVerificationModal";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/Navbar/BottomNav";

import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import SplashCursor from "@/components/SplashCursor";
import VoucherNotification from "@/components/Common/VoucherNotification";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // تحقق من حالة التحميل الفعلية
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      const handleLoad = () => setLoading(false);
      window.addEventListener("load", handleLoad);
      // Fallback timeout بعد 800ms كحد أقصى للأداء الأفضل
      const timeout = setTimeout(() => setLoading(false), 800);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <>
      <AgeVerificationModal />
      <ReduxProvider>
        <AuthProvider>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Navbar />
                <BottomNav />
                {children}
                {/* <SplashCursor /> */}
                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
                <VoucherNotification showAsPopup={true} />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
        </AuthProvider>
      </ReduxProvider>
      <ScrollToTop />

      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}
