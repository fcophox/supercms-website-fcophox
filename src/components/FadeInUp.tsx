"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    yOffset?: number;
}

export default function FadeInUp({
    children,
    delay = 0,
    duration = 0.6,
    className = "",
    yOffset = 40
}: FadeInUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }} // smooth easeOutCubic-ish
            className={className}
        >
            {children}
        </motion.div>
    );
}
