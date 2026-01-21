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
        { name: "Articles", href: "/dashboard/articles" },
        { name: "Casos de Estudio", href: "/dashboard/case-studies" },
        { name: "Servicios", href: "/dashboard/services" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside
                className="glass-panel"
                style={{
                    width: "260px",
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    borderRight: "1px solid var(--glass-border)",
                    borderLeft: "none",
                    borderTop: "none",
                    borderBottom: "none",
                    borderRadius: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: "1.5rem",
                    zIndex: 50,
                }}
            >
                <div style={{ marginBottom: "3rem", paddingLeft: "0.5rem" }}>
                    <h2 className="title-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        FcoPhox <span style={{ color: "hsl(var(--primary))" }}>CMS</span>
                    </h2>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    color: isActive ? "white" : "var(--text-muted)",
                                    background: isActive ? "rgba(139, 92, 246, 0.1)" : "transparent",
                                    border: isActive ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid transparent",
                                    transition: "all 0.2s",
                                    fontWeight: isActive ? 500 : 400,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <Link
                        href="/"
                        target="_blank"
                        className="btn-primary"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            textDecoration: "none"
                        }}
                    >
                        Ver sitio web <ExternalLink size={16} />
                    </Link>

                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}
