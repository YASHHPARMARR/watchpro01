"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, X } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { cart, wishlist } = useStore();
    const { user, profile, initializeAuth, signOut } = useAuthStore();
    const [authMenuOpen, setAuthMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const { scrollY } = useScroll();
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ["rgba(247, 246, 247, 0)", "rgba(247, 246, 247, 0.8)"]
    );
    const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <motion.header
            style={{
                backgroundColor,
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid rgba(139, 74, 92, ${borderOpacity})`,
            }}
            className="fixed top-0 w-full z-50 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">watch</span>
                        <h1 className="font-nav text-2xl font-bold tracking-widest text-primary">CHRONOS</h1>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8 font-nav text-sm font-semibold uppercase tracking-wider">
                        <Link href="/shop" className="hover:text-primary transition-colors">Collection</Link>
                        <Link href="/shop?category=featured" className="hover:text-primary transition-colors">Categories</Link>
                        <Link href="/shop?sale=true" className="hover:text-primary transition-colors">Flash Sale</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-primary/5 rounded-full px-4 py-1.5 border border-primary/10">
                        <Search className="text-primary w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search timepiece..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="bg-transparent border-none focus:ring-0 text-sm w-40 font-body placeholder:text-primary/40"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/account/wishlist" className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors relative">
                            <Heart className="w-6 h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute 0 right-0 w-4 h-4 bg-gold text-black rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute 0 right-0 w-4 h-4 bg-gold text-black rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="relative">
                            <button onClick={() => setAuthMenuOpen(!authMenuOpen)} className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors focus:outline-none">
                                <User className={`w-6 h-6 ${user ? 'fill-primary text-primary' : ''}`} />
                            </button>

                            {/* Auth Dropdown */}
                            {authMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl py-2 z-50">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-slate-100 mb-2">
                                                <p className="text-xs font-bold text-slate-800 truncate">{profile?.full_name || user.email}</p>
                                                <p className="text-[10px] uppercase font-nav text-primary tracking-widest">{profile?.role}</p>
                                            </div>
                                            {profile?.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setAuthMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors">
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <Link href="/account" onClick={() => setAuthMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors">
                                                My Account
                                            </Link>
                                            <button
                                                onClick={() => { signOut(); setAuthMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth" onClick={() => setAuthMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors">
                                                Sign In / Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-primary/10 rounded-full text-primary"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-background-light z-[70] p-10 lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="font-nav text-xl font-bold tracking-widest text-primary">MENU</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-primary hover:scale-110 transition-transform">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-8 font-nav text-lg font-bold uppercase tracking-[0.2em] text-primary/60">
                                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform">Collection</Link>
                                <Link href="/shop?category=featured" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform">Categories</Link>
                                <Link href="/shop?sale=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform">Flash Sale</Link>
                                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform">About</Link>
                                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform">My Account</Link>
                                {profile?.role === 'admin' && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors hover:translate-x-2 transition-transform text-gold">Admin Panel</Link>
                                )}
                            </nav>

                            <div className="mt-auto pt-10 border-t border-primary/10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">{user ? (profile?.full_name || user.email) : "Welcome, Guest"}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-primary/40">Luxury Timepieces</p>
                                    </div>
                                </div>
                                {user ? (
                                    <button
                                        onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                        className="w-full py-4 border border-red-200 text-red-500 font-nav text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-primary w-full py-4 flex items-center justify-center"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
