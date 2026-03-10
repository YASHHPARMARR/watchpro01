"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

interface CartItem {
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Cart() {
    const { cart: cartItems, updateQuantity, removeFromCart, coupon, applyCoupon } = useStore();
    const [couponInput, setCouponInput] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleUpdateQuantity = (id: string | number, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (item) {
            updateQuantity(id, Math.max(1, item.quantity + delta));
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const delivery = subtotal > 100000 ? 0 : 500;

    let discount = 0;
    if (coupon) {
        if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }
    }

    const total = subtotal + delivery - discount;

    const handleApplyCoupon = async () => {
        if (!couponInput) return;
        setIsApplying(true);
        setCouponError(null);

        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponInput.toUpperCase())
                .eq('is_active', true)
                .single();

            if (error || !data) {
                setCouponError("Invalid or expired coupon code.");
                return;
            }

            if (data.min_order_amount && subtotal < data.min_order_amount) {
                setCouponError(`Minimum order amount for this coupon is ₹${data.min_order_amount}.`);
                return;
            }

            applyCoupon({
                code: data.code,
                type: data.discount_type as 'percentage' | 'fixed',
                value: data.discount_value
            });
            setCouponInput("");
        } catch (err) {
            setCouponError("Failed to apply coupon.");
        } finally {
            setIsApplying(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <h1 className="font-display text-4xl mb-12">Your Shopping Cart</h1>

            {cartItems.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Left: Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex gap-6 pb-8 border-b border-primary/10 group"
                                >
                                    <div className="relative w-32 aspect-square bg-background-light overflow-hidden shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-nav text-[10px] uppercase tracking-widest text-primary mb-1">{item.brand}</p>
                                                    <h3 className="font-display text-xl">{item.name}</h3>
                                                </div>
                                                <p className="font-body font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center border border-primary/20">
                                                <button onClick={() => handleUpdateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-primary/5 transition-colors"><Minus className="w-4 h-4" /></button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-primary/5 transition-colors"><Plus className="w-4 h-4" /></button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Right: Summary */}
                    <aside className="lg:col-span-1">
                        <div className="bg-[#141414] p-8 text-white sticky top-32">
                            <h2 className="font-display text-2xl mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 uppercase tracking-widest">Delivery</span>
                                    <span>{delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Promo Code</p>
                                {coupon ? (
                                    <div className="flex items-center justify-between p-4 bg-gold/10 border border-gold/20">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Applied</p>
                                            <p className="text-sm font-bold text-white">{coupon.code}</p>
                                        </div>
                                        <button onClick={() => applyCoupon(null)} className="text-slate-400 hover:text-white transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                placeholder="Enter Code"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sm focus:ring-0 focus:border-gold outline-none"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplying}
                                                className="bg-gold text-black px-6 font-nav text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
                                            >
                                                {isApplying ? "..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-widest">{couponError}</p>}
                                    </>
                                )}
                            </div>

                            <div className="space-y-4 mb-8 pb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 uppercase tracking-widest">Delivery</span>
                                    <span>{delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gold uppercase tracking-widest">Discount</span>
                                        <span className="text-gold">-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end mb-10">
                                <span className="text-lg font-display uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-display text-gold">₹{total.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout" className="btn-gold w-full flex items-center justify-center gap-3 py-5 text-sm">
                                Proceed to Checkout <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </aside>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                        <ShoppingBag className="w-10 h-10 text-primary/40" />
                    </div>
                    <h2 className="font-display text-3xl mb-4">Your cart is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven&apos;t added any luxury timepieces to your collection yet.</p>
                    <Link href="/shop" className="btn-primary">Explore Collection</Link>
                </div>
            )}
        </div>
    );
}
