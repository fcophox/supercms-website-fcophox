"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const { language, toggleLanguage, t } = useLanguage();
    const { articlesVisible, caseStudiesVisible, servicesVisible } = useSiteSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: t("nav.about"), href: "/about", visible: true },
        { name: t("nav.methodology"), href: "/methodology", visible: true },
        { name: t("cases.title"), href: "/case-studies", visible: caseStudiesVisible },
        { name: t("services.title"), href: "/services", visible: servicesVisible },
        { name: t("nav.blog"), href: "/blog", visible: articlesVisible },
    ].filter(link => link.visible);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
            <div className="relative flex items-center justify-between px-8 py-6 max-w-[1200px] mx-auto w-full">
                {/* Logo / Brand */}
                {/* Logo / Brand - Group for hover effect */}
                <Link href="/" className="group flex items-center gap-4 no-underline z-[60]" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="relative w-[42px] h-[42px] [perspective:1000px]">
                        <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                            {/* Front Face (Logo) */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/10 [backface-visibility:hidden]">
                                <Image
                                    src="/logotipo.svg"
                                    alt="Francisco Hormazábal Logo"
                                    width={30}
                                    height={30}
                                    className="w-9 h-9"
                                />
                            </div>
                            {/* Back Face (Avatar) */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden bg-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <Image
                                    src="/francisco-avatar.png"
                                    alt="Francisco Hormazábal Avatar"
                                    width={42}
                                    height={42}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-[0.8rem] leading-[1.4]">
                            Francisco Hormazábal
                        </span>
                        <span className="text-[#a1a1aa] text-[0.7rem] opacity-70">
                            UX Engineer & Product Design Consultant
                        </span>
                    </div>
                </Link>

                {/* Desktop Links - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`no-underline text-[0.8rem] font-medium transition-colors duration-200 ${pathname === link.href ? "text-white" : "text-[#a1a1aa] hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="bg-transparent border-none text-white flex items-center gap-2 cursor-pointer text-[0.8rem] font-semibold hover:opacity-80 transition-opacity"
                    >
                        <span className="text-[0.8rem]">文</span> {language.toUpperCase()}
                    </button>

                    {/* Contact Button */}
                    <Link
                        href="/contact"
                        className="py-2.5 px-5 rounded-full border border-white/20 text-white no-underline text-[0.9rem] font-semibold flex items-center gap-2 transition-all duration-200 hover:bg-white/10"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-status-pulse"></span>
                        {t("nav.contact")}
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="block md:hidden bg-transparent border-none text-white cursor-pointer z-[60]"
                    onClick={toggleMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-[#09090b] pt-24 transition-transform duration-300 ease-in-out z-40 flex flex-col items-center ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col items-center gap-8 mt-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`no-underline text-2xl font-semibold transition-colors duration-200 ${pathname === link.href ? "text-white" : "text-white/70"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px w-[100px] bg-white/10 my-4"></div>

                    {/* Mobile Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="bg-white/10 border-none text-white py-3 px-6 rounded-full flex items-center gap-2 cursor-pointer text-base font-semibold"
                    >
                        <span className="text-base">文</span> {language.toUpperCase()}
                    </button>

                    {/* Mobile Contact Button */}
                    {/* <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 px-8 rounded-full bg-white text-black no-underline text-base font-semibold flex items-center gap-2 mt-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        {t("nav.contact")}
                    </Link> */}
                </div>
            </div>
        </nav>
    );
}
