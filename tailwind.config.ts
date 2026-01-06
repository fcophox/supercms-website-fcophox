import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--bg-dark))",
                foreground: "hsl(var(--text-main))",
                card: "hsl(var(--bg-card))",
                "card-hover": "hsl(var(--bg-card-hover))",
                primary: "hsl(var(--primary))",
                "primary-glow": "hsl(var(--primary-glow))",
                secondary: "hsl(var(--secondary))",
                border: "hsl(var(--border))",
                muted: "hsl(var(--text-muted))",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
            },
        },
    },
    plugins: [],
};
export default config;
