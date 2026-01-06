import Link from "next/link";
import Navbar from "@/components/Navbar";
import FadeInUp from "@/components/FadeInUp";
import HomeProjectsSection from "@/components/HomeProjectsSection";
import Footer from "@/components/Footer";
import HomeBlogSection from "@/components/HomeBlogSection";
import HomeLogosSection from "@/components/HomeLogosSection";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center py-16 bg-[radial-gradient(circle_at_top_center,rgba(124,58,237,0.05)_0%,transparent_50%)]">
        <Hero />
        <HomeProjectsSection />
        <HomeLogosSection />
        <HomeBlogSection />
      </main>

      <Footer />
    </div>
  );
}
