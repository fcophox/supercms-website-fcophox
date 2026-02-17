"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

interface ArticleLikeSectionProps {
    articleId: string;
    initialLikes: number;
    tableName?: string;
}

export default function ArticleLikeSection({ articleId, initialLikes, tableName = 'articles' }: ArticleLikeSectionProps) {
    const { t } = useLanguage();
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initial check for likes and "hasLiked" status
    useEffect(() => {
        const checkStatus = async () => {
            // Check localStorage
            const likedPosts = JSON.parse(localStorage.getItem("liked_content") || "[]");
            if (likedPosts.includes(articleId)) {
                setHasLiked(true);
            }

            // Fetch latest likes from DB to ensure it's up to date
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('likes')
                    .eq('id', articleId)
                    .single();

                if (!error && data) {
                    setLikes(data.likes || 0);
                }
            } catch (err) {
                console.error("Error fetching likes:", err);
            }
        };

        checkStatus();
    }, [articleId, tableName]);

    const handleLike = async () => {
        if (hasLiked || isLoading) return;

        setIsLoading(true);
        setIsAnimating(true);

        // Optimistic update
        const newLikes = likes + 1;
        setLikes(newLikes);
        setHasLiked(true);

        // Save to localStorage
        const likedPosts = JSON.parse(localStorage.getItem("liked_content") || "[]");
        localStorage.setItem("liked_content", JSON.stringify([...likedPosts, articleId]));

        try {
            // Choose the right RPC or update method based on table
            let error;
            if (tableName === 'articles') {
                // Articles uses bigint IDs and has a specific RPC
                const { error: rpcError } = await supabase.rpc('increment_likes', { row_id: articleId });
                error = rpcError;
            } else {
                // For case_studies and services, we use the new UUID-safe RPC
                const { error: rpcError } = await supabase.rpc('increment_likes_uuid', {
                    table_name: tableName,
                    row_id: articleId
                });
                error = rpcError;
            }

            // Fallback to direct update if RPC fails
            if (error) {
                console.warn("RPC failed, falling back to direct update:", error);
                const { error: updateError } = await supabase
                    .from(tableName)
                    .update({ likes: newLikes })
                    .eq('id', articleId);

                if (updateError) throw updateError;
            }
        } catch (err) {
            console.error("Error updating likes:", err);
            // Optional: revert optimistic update on error
            // setLikes(likes);
            // setHasLiked(false);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    return (
        <div className="w-full max-w-[800px] mx-auto mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:bg-white/[0.04]">

            {/* Text Content */}
            <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-white text-xl font-light m-0">
                    {t("like.title") || "Keep it up!"}
                </h3>
                <p className="text-[#a1a1aa] text-sm m-0 max-w-[400px]">
                    {t("like.description") || "If you enjoyed this content, give it a like to let us know."}
                </p>
            </div>

            {/* Like Button */}
            <div>
                <button
                    onClick={handleLike}
                    disabled={hasLiked || isLoading}
                    className={`
                        relative flex items-center gap-3 px-8 py-4 rounded-full 
                        transition-all duration-500 font-medium overflow-hidden
                        ${hasLiked
                            ? "bg-primary/20 text-primary cursor-default border border-primary/30"
                            : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95"
                        }
                    `}
                >
                    <div className={`relative z-10 transition-transform duration-300 ${isAnimating ? "scale-125" : ""}`}>
                        <ThumbsUp
                            size={22}
                            className={`transition-all duration-300 ${hasLiked ? "fill-primary text-primary" : "text-white"}`}
                        />
                    </div>

                    <span className="text-xl font-semibold relative z-10">{likes}</span>

                    {/* Background Shine/Pulse Effect */}
                    {isAnimating && (
                        <div className="absolute inset-0 bg-primary/20 animate-pulse z-0" />
                    )}

                    {/* Ripple/Ping effect on click */}
                    {isAnimating && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-white/20 z-0"></span>
                    )}
                </button>
            </div>
        </div>
    );
}
