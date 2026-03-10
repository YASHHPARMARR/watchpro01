"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Package, Heart, Loader2, Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrderSuccess() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (!error && data) {
            setOrder(data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h1 className="font-display text-4xl mb-6">Order Not Found</h1>
                <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
            </div>
        );
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-background-light">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20"
                >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="font-display text-4xl md:text-5xl mb-6">Order Placed Successfully!</h1>
                    <p className="text-slate-500 font-body mb-12">
                        Your luxury timepiece is being prepared for its journey. We&apos;ve sent a confirmation email to {order.shipping_address?.email || "you"} with all the details.
                    </p>

                    <div className="bg-white border border-primary/10 p-8 mb-12 text-left">
                        <div className="flex justify-between items-center pb-6 border-b border-primary/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID:</span>
                            <span className="font-nav font-bold text-primary">{order.display_id}</span>
                        </div>
                        <div className="py-6 border-b border-primary/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Expected Delivery:
                                </span>
                                <span className="font-bold">By {deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold">Payment Status:</span>
                                <span className={`font-bold uppercase text-[10px] tracking-widest ${order.payment_status === 'Confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold">Total Amount:</span>
                                <span className="font-bold text-primary">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Link href="/account/orders" className="btn-primary flex items-center justify-center gap-3">
                            <Package className="w-5 h-5" /> Track Order
                        </Link>
                        <Link href="/shop" className="btn-outline flex items-center justify-center gap-3">
                            <ShoppingBag className="w-5 h-5" /> Continue Shopping
                        </Link>
                    </div>

                    <div className="mt-12 pt-12 border-t border-primary/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for Timepiece Enthusiasts
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
