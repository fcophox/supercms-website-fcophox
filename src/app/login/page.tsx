"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Command, LayoutDashboard } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 relative lg:overflow-hidden">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-between p-8 lg:p-12 relative z-10 bg-background/95 backdrop-blur-sm lg:bg-background">
                {/* Logo Area */}
                <div className="flex items-center gap-2 text-white">
                    <div className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white/10">
                        <img src="/logotipo.svg" alt="fcoPhox Logo" className="w-8 h-8 opacity-90" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">fcoPhox CMS</span>
                </div>

                <div className="max-w-[400px] w-full mx-auto my-12 lg:my-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold mb-2 text-white tracking-tight">Welcome back</h1>
                        <p className="text-muted text-[0.95rem]">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80 ml-0.5">Email</label>
                            <input
                                type="email"
                                className="bg-[#18181b] border border-[#27272a] rounded-md px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center ml-0.5">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                className="bg-[#18181b] border border-[#27272a] rounded-md px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-md transition-all duration-200 mt-2 shadow-[0_0_20px_rgba(72,59,252,0.15)] hover:shadow-[0_0_25px_rgba(72,59,252,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-white hover:underline underline-offset-4 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>

                <div className="text-xs text-muted">
                    By continuing, you agree to our <span className="underline cursor-pointer hover:text-white">Terms of Service</span> and <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
                </div>
            </div>

            {/* Right Side - Visual/Qoute */}
            <div className="hidden lg:flex relative bg-[#09090b] flex-col justify-center items-center p-12 border-l border-white/5">
                {/* Background Pattern */}
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at top center, rgba(91, 78, 255, 0.1) 0%, transparent 18%),
                        radial-gradient(circle at 15% 50%, rgba(72, 59, 252, 0.03), transparent 40%),
                        radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.03), transparent 25%)
                    `
                }} />

                <div className="relative z-10 max-w-[500px]">
                    <div className="mb-8 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 text-white/40">
                        <img src="/logotipo.svg" alt="fcoPhox Logo" className="w-8 h-8 opacity-90" />
                    </div>
                    <blockquote className="text-2xl font-medium text-white/90 leading-relaxed mb-8">
                        "Experience backed by knowledge. Designing with method, judgment, and impact vision to create digital products that connect."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                            <img src="/francisco-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm">Francisco Hormazabal</div>
                            <div className="text-white/40 text-xs">@fcophox</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
