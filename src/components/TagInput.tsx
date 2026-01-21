"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function TagInput({ tags = [], onChange, placeholder = "Add tag...", label }: TagInputProps) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmedInput = input.trim();
            if (trimmedInput && !tags.includes(trimmedInput)) {
                onChange([...tags, trimmedInput]);
                setInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-sm text-gray-400">{label}</label>}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-black/20 border-none p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}
