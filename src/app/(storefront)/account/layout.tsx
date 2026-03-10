"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Heart, MapPin, Bell, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navLinks = [
        { label: "My Profile", href: "/account", icon: User },
        { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
        { label: "Wishlist", href: "/account/wishlist", icon: Heart },
        { label: "Addresses", href: "/account/addresses", icon: MapPin },
        { label: "Notifications", href: "/account/notifications", icon: Bell },
    ];

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="bg-white border border-primary/10 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-primary/5">
                            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-nav font-bold">
                                YS
                            </div>
                            <div>
                                <h3 className="font-display text-xl">Yash Sharma</h3>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Premium Member</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`flex items-center justify-between group p-4 transition-all ${isActive ? "bg-primary/5 border-l-4 border-gold text-primary" : "hover:bg-primary/5 text-slate-500 hover:text-primary"}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <link.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"} transition-colors`} />
                                            <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-gold" />}
                                    </Link>
                                );
                            })}

                            <button className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all mt-4">
                                <LogOut className="w-5 h-5 text-slate-400" />
                                <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
