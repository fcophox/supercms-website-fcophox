"use client";

import { useState, useEffect } from "react";
import { Hand } from "lucide-react";
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

    // Check if user has already liked this session/device (simple localStorage check)
    useEffect(() => {
        const likedposts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        if (likedposts.includes(articleId)) {
            setHasLiked(true);
        }
    }, [articleId]);

    const handleLike = async () => {
        if (hasLiked) return; // Prevent multiple likes for demo purposes

        // Optimistic update
        const newLikes = likes + 1;
        setLikes(newLikes);
        setHasLiked(true);
        setIsAnimating(true);

        // Save to localStorage
        const likedposts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        localStorage.setItem("liked_posts", JSON.stringify([...likedposts, articleId]));

        // Sync with DB
        const { error } = await supabase.rpc('increment_likes', { row_id: articleId });

        // If RPC fails (e.g. not created yet), try direct update (less safe for concurrency but works for simple case)
        // Also supports table dynamic
        if (error) {
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ likes: newLikes })
                .eq('id', articleId);

            if (updateError) {
                console.error("Error updating likes:", updateError);
                // Revert optimistic update? Nah, keep it for UX.
            }
        }

        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <div className="w-full max-w-[800px] mx-auto mt-16 p-8 rounded-2xl bg-background border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Text Content */}
            <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-white text-xl font-light m-0">
                    {t("like.title")}
                </h3>
                <p className="text-[#a1a1aa] text-sm m-0 max-w-[400px]">
                    {t("like.description")}
                </p>
            </div>

            {/* Like Button */}
            <div>
                <button
                    onClick={handleLike}
                    disabled={hasLiked}
                    className={`
                        relative flex items-center gap-3 px-6 py-3 rounded-full 
                        transition-all duration-300 font-medium
                        ${hasLiked
                            ? "bg-[#27272a] text-white cursor-default"
                            : "bg-[#27272a] text-white hover:bg-[#3f3f46] hover:scale-105 active:scale-95"
                        }
                    `}
                >
                    <div className={`relative ${isAnimating ? "animate-bounce" : ""}`}>
                        <Hand size={20} className={hasLiked ? "text-yellow-400 fill-yellow-400" : ""} />

                        {/* Floating particles effect could go here */}
                    </div>
                    <span className="text-lg">{likes}</span>

                    {/* Simple ripple or particle effect on click */}
                    {isAnimating && (
                        <span className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-white/10"></span>
                    )}
                </button>
            </div>
        </div>
    );
}
