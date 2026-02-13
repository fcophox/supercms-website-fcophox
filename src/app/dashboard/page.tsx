"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ContentItem {
    id: string;
    title: string;
    category: string;
    likes: number;
    type: string;
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
                    supabase.from('articles').select('id, title, category, likes'),
                    supabase.from('case_studies').select('id, title, category, likes')
                ]);

                const formattedArticles = (articlesResponse.data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category || 'Opinion',
                    likes: item.likes || 0,
                    type: 'Article'
                }));

                const formattedCaseStudies = (caseStudiesResponse.data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category || 'Project',
                    likes: item.likes || 0,
                    type: 'Case Study'
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
        <div className="pb-8">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-muted)]">Overview of your content performance.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 mb-10">
                {/* Articles Card */}
                <div className="glass-panel p-6 rounded-xl">
                    <div className="text-[var(--text-muted)] text-sm mb-2">Articles</div>
                    <div className="text-3xl font-bold text-white">
                        {isLoading ? "-" : counts.articles}
                    </div>
                </div>

                {/* Case Studies Card */}
                <div className="glass-panel p-6 rounded-xl">
                    <div className="text-[var(--text-muted)] text-sm mb-2">Case Studies</div>
                    <div className="text-3xl font-bold text-white">
                        {isLoading ? "-" : counts.caseStudies}
                    </div>
                </div>

                {/* Services Card */}
                <div className="glass-panel p-6 rounded-xl">
                    <div className="text-[var(--text-muted)] text-sm mb-2">Services</div>
                    <div className="text-3xl font-bold text-white">
                        {isLoading ? "-" : counts.services}
                    </div>
                </div>
            </div>

            {/* Top Content Table */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 text-white">Top Content by Likes</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[var(--text-muted)]">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="p-4 font-medium text-white">Title</th>
                                <th className="p-4 font-medium text-white">Category</th>
                                <th className="p-4 font-medium text-white text-right">Likes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center">Loading...</td>
                                </tr>
                            ) : contentItems.length > 0 ? (
                                contentItems.map((item) => (
                                    <tr key={`${item.type}-${item.id}`} className="border-b border-white/5 last:border-0">
                                        <td className="p-4 text-white">{item.title}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'Article'
                                                        ? "bg-violet-400/10 text-violet-400"
                                                        : item.type === 'Case Study'
                                                            ? "bg-sky-400/10 text-sky-400"
                                                            : "bg-green-400/10 text-green-400"
                                                    }`}
                                            >
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-white font-medium">{item.likes || 0}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center">No content found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
