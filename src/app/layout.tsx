import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import BackgroundGradients from "@/components/BackgroundGradients";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | fcoPhox',
    default: 'fcoPhox | UX Engineer & Product Design Consultant ',
  },
  description: 'Welcome to my website, I am a UX Engineer & Product Design Consultant, specializing in creating impactful digital experiences with strategic solutions.',
  metadataBase: new URL('https://fcophox.com'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    siteName: 'fcoPhox',
    url: 'https://fcophox.com',
    locale: 'es_ES',
    type: 'website',
  },
};

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
            <BackgroundGradients />
            <div className="relative z-10">
              {children}
            </div>
            <Toaster position="bottom-right" theme="dark" />
          </SiteSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
