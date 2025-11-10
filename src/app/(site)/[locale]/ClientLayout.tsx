"use client";
import { useState, useEffect } from "react";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import { Providers } from "@/app/context/QueryProvider";
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
      <Providers>
        <ReduxProvider>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Navbar />
                {children}
                <SplashCursor />
                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
        </ReduxProvider>
      </Providers>
      <ScrollToTop />
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}
