"use client";

import { Download, FileText } from "lucide-react";

interface DownloadResourceCardProps {
    title: string;
    description?: string;
    url: string;
}

export default function DownloadResourceCard({ title, description, url }: DownloadResourceCardProps) {
    if (!url) return null;

    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-[#5b4eff]/30 no-underline my-12 max-w-[770px] mx-auto"
        >
            {/* Download Icon Box */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-[#5b4eff]/10 group-hover:border-[#5b4eff]/30 group-hover:text-[#5b4eff] transition-all duration-300">
                <Download size={20} />
            </div>

            {/* Text Content */}
            <div className="flex-1 relative z-10">
                <h4 className="text-lg font-medium text-white mb-1 group-hover:text-[#5b4eff] transition-colors">
                    {title}
                </h4>
                {description && (
                    <p className="text-sm text-[#a1a1aa] line-clamp-2">
                        {description}
                    </p>
                )}
            </div>

            {/* Decorative Background Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-6 group-hover:opacity-[0.06] group-hover:text-[#5b4eff] transition-all duration-500 pointer-events-none">
                <FileText size={120} />
            </div>
        </a>
    );
}
