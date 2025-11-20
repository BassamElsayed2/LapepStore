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
import Footer from "@/components/Footer";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import { Providers } from "@/app/context/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import SplashCursor from "@/components/SplashCursor";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <>
      <AgeVerificationModal />
      <Providers>
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
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </AuthProvider>
        </ReduxProvider>
      </Providers>
      <ScrollToTop />
      <Footer />
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
