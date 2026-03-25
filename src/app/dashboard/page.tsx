/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ContentItem {
    id: string;
    title: string;
    category: string;
    likes: number;
    type: string;
    image_url?: string;
}

export default function DashboardPage() {
    const [counts, setCounts] = useState({
        articles: 0,
        caseStudies: 0,
        services: 0
    });
    const [contentItems, setContentItems] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch counts
                const [articlesCount, caseStudiesCount, servicesCount] = await Promise.all([
                    supabase.from('articles').select('*', { count: 'exact', head: true }),
                    supabase.from('case_studies').select('*', { count: 'exact', head: true }),
                    supabase.from('services').select('*', { count: 'exact', head: true })
                ]);

                setCounts({
                    articles: articlesCount.count || 0,
                    caseStudies: caseStudiesCount.count || 0,
                    services: servicesCount.count || 0
                });

                // Fetch items with likes
                const [articlesResponse, caseStudiesResponse] = await Promise.all([
                    supabase.from('articles').select('id, title, category, likes, image_url'),
                    supabase.from('case_studies').select('id, title, category, likes, image_url')
                ]);

                const formattedArticles = (articlesResponse.data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category || 'Opinion',
                    likes: item.likes || 0,
                    type: 'Article',
                    image_url: item.image_url
                }));

                const formattedCaseStudies = (caseStudiesResponse.data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category || 'Project',
                    likes: item.likes || 0,
                    type: 'Case Study',
                    image_url: item.image_url
                }));

                // Combining and sorting
                const allContent = [...formattedArticles, ...formattedCaseStudies].sort((a: ContentItem, b: ContentItem) => b.likes - a.likes);
                setContentItems(allContent);

            } catch (error) {
                console.error("Error fetching dashboard counts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="pb-8 max-w-full">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-100 mb-1">
                        Dashboard Settings
                    </h1>
                    <p className="text-sm text-neutral-400">Overview of your content performance and general configuration.</p>
                </div>
            </header>

            <div className="mb-10">
                <h2 className="text-lg font-normal text-neutral-100 mb-4">Content Summary</h2>
                <div className="border border-neutral-800 rounded-lg bg-[#0a0a0a]">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 divide-x divide-neutral-800">
                        {/* Articles Card */}
                        <div className="p-6">
                            <div className="text-neutral-400 text-sm mb-4">Total Articles</div>
                            <div className="text-2xl font-normal text-neutral-100">
                                {isLoading ? "-" : counts.articles}
                            </div>
                        </div>

                        {/* Case Studies Card */}
                        <div className="p-6">
                            <div className="text-neutral-400 text-sm mb-4">Total Case Studies</div>
                            <div className="text-2xl font-normal text-neutral-100">
                                {isLoading ? "-" : counts.caseStudies}
                            </div>
                        </div>

                        {/* Services Card */}
                        <div className="p-6">
                            <div className="text-neutral-400 text-sm mb-4">Total Services</div>
                            <div className="text-2xl font-normal text-neutral-100">
                                {isLoading ? "-" : counts.services}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Content Table */}
            <div>
                <h2 className="text-lg font-normal text-neutral-100 mb-4">Top Content by Likes</h2>
                <div className="border border-neutral-800 rounded-lg bg-[#0a0a0a]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left">
                                    <th className="px-6 py-4 font-normal text-neutral-400 w-[70%]">Title</th>
                                    <th className="px-6 py-4 font-normal text-neutral-400 w-[15%]">Category</th>
                                    <th className="px-6 py-4 font-normal text-neutral-400 text-right w-[15%]">Likes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-neutral-400">Loading...</td>
                                    </tr>
                                ) : contentItems.length > 0 ? (
                                    contentItems.map((item, idx) => (
                                        <tr key={`${item.type}-${item.id}`} className={idx !== contentItems.length - 1 ? "border-b border-neutral-800" : ""}>
                                            <td className="px-6 py-4 text-neutral-300">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 bg-cover bg-center flex-shrink-0 flex items-center justify-center overflow-hidden"
                                                        style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : "none" }}
                                                    >
                                                        {!item.image_url && <span className="opacity-30 text-lg">🖼️</span>}
                                                    </div>
                                                    <span>{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-400 flex items-center">
                                                <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-xs font-normal">
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-neutral-300">{item.likes || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-neutral-400">No content found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
