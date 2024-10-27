"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import config from "@/config";
import Footer from "@/components/Footer";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pathname
      });
    }
  }, [pathname]);

  return (
    <SessionProvider>
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={config.colors.main} showSpinner={false} />

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer Component */}
      <Footer />

      {/* Show Success/Error messages anywhere from the app with toast() */}
      <Toaster
        toastOptions={{
          duration: 3000
        }}
      />

      {/* Show tooltips if any JSX elements have data-tooltip attributes */}
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg"
      />
    </SessionProvider>
  );
};

export default ClientLayout;
