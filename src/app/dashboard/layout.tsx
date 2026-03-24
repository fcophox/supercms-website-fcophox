"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Bell } from "lucide-react";

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
        { name: "Clientes", href: "/dashboard/clientes" },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] text-neutral-300">
            {/* Sidebar */}
            <aside
                className="w-[260px] h-screen sticky top-0 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col p-6 z-50"
            >
                <div className="mb-12 pl-2">
                    <h2 className="title-gradient text-xl font-normal">
                        FcoPhox <span className="text-[hsl(var(--primary))] text-sm ml-1 font-medium">CMS</span>
                    </h2>
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 text-sm rounded-md flex items-center transition-all duration-200 ${isActive
                                    ? "text-neutral-100 bg-neutral-900 border border-neutral-800 font-medium"
                                    : "text-neutral-400 bg-transparent border border-transparent font-normal hover:bg-neutral-900/50 hover:text-neutral-200"
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
                        className="rounded-md w-full flex items-center justify-center gap-2 text-center text-sm no-underline border border-neutral-800 bg-neutral-900 py-2 hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
                    >
                        Ver sitio web <ExternalLink size={14} />
                    </Link>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto flex flex-col min-h-full">
                    {/* Top Navbar */}
                    <div className="flex justify-end items-center gap-5 w-full mb-8">
                        <button className="text-neutral-400 hover:text-neutral-100 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-300 cursor-pointer hover:border-neutral-500 hover:text-white transition-colors">
                            FH
                        </div>
                    </div>
                    {/* Page Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
