"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    MonitorPlay, // Replaced Image with MonitorPlay to avoid DOM conflict
    Bell,
    Settings,
    LogOut,
    Search,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, isLoading, signOut, initializeAuth, user } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        if (!isLoading && profile?.role !== "admin") {
            router.push("/auth");
        }
    }, [isLoading, profile, router]);

    if (isLoading || profile?.role !== "admin") {
        return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-display text-2xl text-slate-400">Verifying Access...</div>;
    }

    const menuItems = [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { label: "Customers", href: "/admin/users", icon: Users },
        { label: "Coupons", href: "/admin/coupons", icon: Tag },
        { label: "Banners", href: "/admin/banners", icon: MonitorPlay },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0D0D0D] text-white shrink-0 hidden lg:flex flex-col">
                <div className="p-8 border-b border-white/5">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gold text-2xl">watch</span>
                        <h1 className="font-nav text-xl font-bold tracking-widest text-white">ADMIN PRO</h1>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-none transition-all ${isActive ? "bg-gold text-black font-bold" : "text-slate-400 hover:text-gold hover:bg-white/5"}`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-black" : "text-slate-500"}`} />
                                <span className="text-xs uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={async () => {
                            await signOut();
                            router.push("/");
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-white/5 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="font-display text-xl">Admin Dashboard</h2>
                        <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs">
                            <span>Home</span> <ChevronRight className="w-3 h-3" /> <span>Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200">
                            <Search className="text-slate-400 w-4 h-4" />
                            <input placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm w-40" />
                        </div>
                        <button className="relative text-slate-400 hover:text-primary transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] rounded-full">3</span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-bold text-xs uppercase">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[10px] font-bold uppercase tracking-widest">Administrator</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-8">
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
