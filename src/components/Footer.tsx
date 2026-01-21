"use client";

import Link from "next/link";
import { Linkedin, Github, ExternalLink, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ContactCTA from "./ContactCTA";

export default function Footer() {
    const { t, toggleLanguage, language } = useLanguage();

    return (
        <>
            <ContactCTA />
            <footer className="border-t border-white/10 pt-16 pb-8 mt-auto w-full max-w-[1100px] mx-auto bg-[#09090b]">
                <div className="max-w-[1100px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr] gap-16 mb-16 px-8">
                        {/* Left Column: Profile & Contact */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-[#333]">
                                    {/* Placeholder for avatar - using a generic person if no image */}
                                    <img
                                        src="/francisco-avatar.png"
                                        alt="Francisco"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image missing
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.style.backgroundColor = '#333';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-[0.9rem] m-0">Francisco</h3>
                                    <p className="text-[#a1a1aa] text-[0.8rem] my-1 opacity-70">
                                        {t("footer.role")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 items-start">
                                <p className="text-[#a1a1aa] text-[0.9rem]">
                                    {t("footer.cta.text")}
                                </p>
                                <Link
                                    href="/contact"
                                    className="bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary text-[0.85rem] font-medium px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 group"
                                >
                                    {t("footer.cta.button")}
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Middle Column: Sitemap */}
                        <div className="opacity-70">
                            <h4 className="text-white text-[0.8rem] font-bold mb-6 opacity-70">
                                {t("footer.sitemap")}
                            </h4>
                            <div className="flex flex-col gap-4">
                                <Link href="/about" className="text-[#a1a1aa] no-underline text-[0.95rem] transition-colors duration-200 hover:text-white">{t("nav.about")}</Link>
                                <Link href="/methodology" className="text-[#a1a1aa] no-underline text-[0.95rem] transition-colors duration-200 hover:text-white">{t("nav.methodology")}</Link>
                                <Link href="/case-studies" className="text-[#a1a1aa] no-underline text-[0.95rem] transition-colors duration-200 hover:text-white">{t("cases.title")}</Link>
                                <Link href="/blog" className="text-[#a1a1aa] no-underline text-[0.95rem] transition-colors duration-200 hover:text-white">{t("nav.blog")}</Link>
                            </div>
                        </div>

                        {/* Right Column: Socials */}
                        <div className="opacity-70">
                            <h4 className="text-white text-[0.8rem] font-bold mb-6 opacity-70">
                                {t("footer.socials")}
                            </h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { name: "Behance", url: "https://www.behance.net/fcophox" },
                                    { name: "LinkedIn", url: "https://www.linkedin.com/in/fcophox/" },
                                    { name: "GitHub", url: "https://github.com/fcophox" },
                                    { name: "Medium", url: "https://medium.com/@fcophox" }
                                ].map(social => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#a1a1aa] no-underline text-[0.95rem] flex items-center gap-2 transition-colors duration-200 hover:text-white"
                                    >
                                        {social.name}
                                        <ExternalLink size={14} />
                                    </a>
                                ))}


                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-8 flex justify-center items-center">
                        <div className="flex items-center gap-3 text-[#a1a1aa] text-[0.7rem] opacity-35 font-medium">
                            <img
                                src="/logotipo.svg"
                                alt="Logo"
                                className="h-[23px] w-auto opacity-70"
                            />
                            <span>fcophox.com - {t("footer.rights")} - 2026</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
