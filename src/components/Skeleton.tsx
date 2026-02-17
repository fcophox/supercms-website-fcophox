"use client";

import React from "react";

export function CardSkeleton() {
    return (
        <div className="bg-[#111] border border-[#222] rounded-[16px] overflow-hidden flex flex-col h-full animate-pulse">
            <div className="aspect-[16/9] bg-white/5 w-full"></div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="h-8 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="flex gap-4 mb-4 opacity-50">
                    <div className="h-4 bg-white/10 rounded w-24"></div>
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
                <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-white/5 rounded-full w-12 border border-white/10"></div>
                    <div className="h-6 bg-white/5 rounded-full w-16 border border-white/10"></div>
                </div>
                <div className="space-y-2 mb-6 flex-1">
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-2/3"></div>
                </div>
                <div className="mt-auto h-5 bg-white/10 rounded w-24"></div>
            </div>
        </div>
    );
}

export function PostSkeleton() {
    return (
        <div className="w-full animate-pulse">
            {/* Back Button */}
            <div className="h-5 bg-white/10 rounded w-24 mb-12"></div>

            {/* Meta */}
            <div className="flex gap-4 mb-8">
                <div className="h-5 bg-white/10 rounded w-32"></div>
                <div className="h-5 bg-white/10 rounded w-24"></div>
            </div>

            {/* Title */}
            <div className="space-y-4 mb-12">
                <div className="h-12 bg-white/10 rounded w-full"></div>
                <div className="h-12 bg-white/10 rounded w-3/4"></div>
            </div>

            {/* Image */}
            <div className="w-full aspect-[21/9] bg-white/5 rounded-2xl mb-12 border border-[#222]"></div>

            {/* Content */}
            <div className="max-w-[770px] mx-auto space-y-6">
                <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-4/5"></div>
                </div>
                <div className="h-8 bg-white/10 rounded w-1/2 mt-12 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                </div>
            </div>
        </div>
    );
}
