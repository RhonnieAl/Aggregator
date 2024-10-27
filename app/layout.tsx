import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "../components/LayoutClient";
import { CSPostHogProvider } from "@/libs/providers";
import config from "@/config";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  const isDark = config.colors.theme === "dark";
  return (
    <html
      lang="en"
      data-theme={config.colors.theme}
      className={`${font.className} ${isDark ? "dark" : ""}`}>
      <head>
        {/* Google Tag */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `
          }}
        />
        <meta name="theme-color" content={config.colors.main} />
      </head>
      <body>
        <CSPostHogProvider>
          {" "}
          {/* Wrap the app with the PostHog provider */}
          <ClientLayout>{children}</ClientLayout>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
