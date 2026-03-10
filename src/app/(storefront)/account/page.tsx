"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, profile, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return <div className="p-10 font-display text-2xl text-slate-400">Loading Profile...</div>;
    }
    return (
        <div className="bg-white border border-primary/10 p-10 shadow-sm">
            <h2 className="font-display text-3xl mb-10 pb-6 border-b border-primary/5">My Profile</h2>

            <form className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Personal Information</h3>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="text"
                                defaultValue={profile?.full_name || ""}
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-4 bg-background-light border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="tel"
                                defaultValue="+91 9876543210"
                                placeholder="Phone Number"
                                className="w-full pl-12 pr-4 py-4 bg-background-light border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="email"
                                defaultValue={user?.email || ""}
                                disabled
                                className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-primary/5 rounded-none font-body text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security</h3>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="w-full pl-12 pr-4 py-4 bg-background-light border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full pl-12 pr-4 py-4 bg-background-light border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full pl-12 pr-4 py-4 bg-background-light border border-primary/10 rounded-none focus:ring-0 focus:border-primary transition-all font-body text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-primary/5 flex justify-end">
                    <button type="submit" className="btn-primary flex items-center gap-3">
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
