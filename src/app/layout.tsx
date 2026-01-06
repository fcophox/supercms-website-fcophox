import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "fcoPhox CMS",
  description: "Next Gen Content Management",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={sora.className}>
        <LanguageProvider>
          <SiteSettingsProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </SiteSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
