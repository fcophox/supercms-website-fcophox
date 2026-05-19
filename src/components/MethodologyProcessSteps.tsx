"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
    {
        id: "01",
        titleKey: "methodology.steps.1.title",
        descKey: "methodology.steps.1.desc",
    },
    {
        id: "02",
        titleKey: "methodology.steps.2.title",
        descKey: "methodology.steps.2.desc",
    },
    {
        id: "03",
        titleKey: "methodology.steps.3.title",
        descKey: "methodology.steps.3.desc",
    },
];

export default function MethodologyProcessSteps() {
    const { t } = useLanguage();

    return (
        <section className="py-24 overflow-hidden relative w-full">
            {/* Visual Path (Curved Dotted Line - FULL WIDTH) */}
            <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-[30%] hidden md:block pointer-events-none opacity-40">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1600 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        d="M0 60 L1600 60"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">

                            {/* Step Bubble */}
                            <div className="relative mb-8">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                                    className="w-20 h-20 rounded-full bg-[#111] border-2 border-primary/20 flex items-center justify-center text-xl font-medium text-primary shadow-[0_0_20px_rgba(0,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group-hover:border-primary transition-all duration-300"
                                >
                                    {step.id}

                                    {/* Inner ring */}
                                    <div className="absolute inset-2 border border-primary/10 rounded-full animate-pulse" />
                                </motion.div>

                                {/* Connector Dot (Mobile Only) */}
                                {idx < steps.length - 1 && (
                                    <div className="absolute left-1/2 bottom-[-4rem] h-16 w-px bg-gradient-to-b from-primary/40 to-transparent md:hidden" />
                                )}
                            </div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + idx * 0.2, duration: 0.6 }}
                            >
                                <h3 className="text-2xl font-light text-white mb-4 group-hover:text-primary transition-colors duration-300">
                                    {t(step.titleKey)}
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed max-w-[30ch]">
                                    {t(step.descKey)}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
