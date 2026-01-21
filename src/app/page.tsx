import Navbar from "@/components/Navbar";
import HomeProjectsSection from "@/components/HomeProjectsSection";
import Footer from "@/components/Footer";
import HomeBlogSection from "@/components/HomeBlogSection";
import HomeLogosSection from "@/components/HomeLogosSection";
import Hero from "@/components/Hero";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'fcoPhox | UX Engineer & Product Design Consultant'
  },
  description: 'Welcome to my website, I am a UX Engineer & Product Design Consultant, specializing in creating impactful digital experiences with strategic solutions.',
  openGraph: {
    title: 'fcoPhox | UX Engineer & Product Design Consultant',
    description: 'Welcome to my website, I am a UX Engineer & Product Design Consultant, specializing in creating impactful digital experiences with strategic solutions.',
    url: 'https://fcophox.com',
    siteName: 'fcoPhox',
    images: [
      {
        url: '/og-image.jpg', // Assuming you might have one or will create one, or use a default
        width: 1200,
        height: 630,
        alt: 'fcoPhox',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
};


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center py-16">
        <Hero />
        <HomeProjectsSection />
        <HomeLogosSection />
        <HomeBlogSection />
      </main>

      <Footer />
    </div>
  );
}
