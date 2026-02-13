"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/dashboard" },
        { name: "Articles", href: "/dashboard/articles" },
        { name: "Casos de Estudio", href: "/dashboard/case-studies" },
        { name: "Servicios", href: "/dashboard/services" },
    ];

    return (
        <div className="flex min-h-screen bg-[hsl(var(--bg-dark))] bg-none">
            {/* Sidebar */}
            <aside
                className="glass-panel w-[260px] h-screen sticky top-0 border-r border-[var(--glass-border)] border-y-0 border-l-0 rounded-none flex flex-col p-6 z-50"
            >
                <div className="mb-12 pl-2">
                    <h2 className="title-gradient text-2xl font-bold">
                        FcoPhox <span className="text-[hsl(var(--primary))]">CMS</span>
                    </h2>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${isActive
                                    ? "text-white bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] font-medium"
                                    : "text-[var(--text-muted)] bg-transparent border border-transparent font-normal hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto">
                    <Link
                        href="/"
                        target="_blank"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-center text-sm no-underline"
                    >
                        Ver sitio web <ExternalLink size={16} />
                    </Link>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-[1200px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
