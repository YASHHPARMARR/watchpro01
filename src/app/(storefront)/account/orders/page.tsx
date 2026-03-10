"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, Box, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function Orders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "text-green-600 bg-green-50";
            case "Processing": return "text-amber-600 bg-amber-50";
            case "Shipped": return "text-blue-600 bg-blue-50";
            case "Cancelled": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered": return CheckCircle2;
            case "Processing": return Clock;
            case "Shipped": return Truck;
            case "Cancelled": return Box;
            default: return Package;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-white border border-primary/10 p-10 shadow-sm">
            <h2 className="font-display text-3xl mb-10 pb-6 border-b border-primary/5">Order History</h2>

            <div className="space-y-8">
                {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const firstItem = order.order_items?.[0];
                    const itemCount = order.order_items?.length || 0;

                    return (
                        <div
                            key={order.id}
                            className="group border border-primary/5 hover:border-primary/20 transition-all p-6 md:p-8"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID:</span>
                                        <span className="font-nav font-bold text-sm tracking-widest">{order.display_id}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
                                </div>
                            </div>

                            <div className="flex gap-6 items-center">
                                <div className="relative w-24 h-24 bg-background-light overflow-hidden shrink-0">
                                    <Image src={firstItem?.product_image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt="Watch" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 mb-1">Items: {itemCount}</p>
                                    <p className="font-display text-xl text-primary font-bold">₹{order.total_amount.toLocaleString()}</p>
                                </div>
                                <Link
                                    href={`/order/success?id=${order.id}`}
                                    className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-gold transition-colors"
                                >
                                    View Details <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <Link
                                href={`/order/success?id=${order.id}`}
                                className="w-full mt-6 md:hidden py-3 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center justify-center"
                            >
                                View Details
                            </Link>
                        </div>
                    );
                })}
            </div>

            {orders.length === 0 && (
                <div className="text-center py-20">
                    <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="font-display text-2xl text-slate-400">No orders yet</h3>
                    <p className="text-slate-500 text-sm mt-4">When you place your first order, it will appear here.</p>
                    <Link href="/shop" className="btn-primary mt-8 inline-block">Explore Collection</Link>
                </div>
            )}
        </div>
    );
}
