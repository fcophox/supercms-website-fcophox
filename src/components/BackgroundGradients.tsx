"use client";

import React from "react";

export default function BackgroundGradients() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
            style={{
                backgroundColor: "hsl(var(--bg-dark))",
                backgroundImage: `
                    radial-gradient(circle at top center, rgba(91, 78, 255, 0.12) 0%, transparent 40%),
                    radial-gradient(circle at 15% 50%, rgba(72, 59, 252, 0.04), transparent 40%),
                    radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.04), transparent 25%)
                `
            }}
        />
    );
}
