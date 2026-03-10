"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Eye, EyeOff, Phone } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { initializeAuth } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                await initializeAuth();
                router.push("/account");
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (signUpError) throw signUpError;

                setIsLogin(true);
                setError("Account created! Please sign in.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex">
            {/* Left Section: Image (Hidden on mobile) */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJwGEo4kpzyeOY-fSUh8D317a8-SKy5k6s96Q-RdM6c7vFXFR5oLofWj5ybiw7hPNV5Tl1QDI_F3IeC9hi1IADw1ASP6RcUVnsVPWzcmQz6Ej4F82QxARJEa5XJc-x1_4jweWMBptPY2yFYU9FSW-w6rCkTGYaDq9kgJPoO3y5Y-9vzbR-vMzllDV0FXGOpkAKlxdM4fV1YyYqabu66yVsBdaoaoSlstQuTSOKO07IzKFbJdWETm_JqABhLIH8NoxK55qH4sMMPMMB"
                    alt="Luxury Watch"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
                    <p className="font-nav text-sm font-bold uppercase tracking-[0.4em] mb-4">Elite Access</p>
                    <h2 className="font-display text-6xl mb-8 leading-tight">Welcome to <br /> Chronos Elite</h2>
                    <p className="text-xl opacity-80 max-w-md font-body">Sign in to access your curated collection and exclusive luxury services.</p>
                </div>
            </div>

            {/* Right Section: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-light">
                <div className="w-full max-w-md">
                    <div className="flex gap-8 mb-12 border-b border-primary/10">
                        {["login", "register"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setIsLogin(tab === "login");
                                    setError(null);
                                }}
                                className={`pb-4 font-nav text-xs font-bold uppercase tracking-widest relative transition-all ${((isLogin && tab === "login") || (!isLogin && tab === "register")) ? "text-primary" : "text-slate-400 hover:text-primary"}`}
                            >
                                {tab}
                                {((isLogin && tab === "login") || (!isLogin && tab === "register")) && <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                            </button>
                        ))}
                    </div>

                    <h3 className="font-display text-3xl mb-10">
                        {isLogin ? "Sign In" : "Create Account"}
                    </h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold text-center italic">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm outline-none"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm outline-none"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-12 pr-12 py-4 bg-white border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm outline-none"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-5 text-sm disabled:opacity-50"
                        >
                            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
