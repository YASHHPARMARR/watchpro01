"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, X, Loader2, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCoupons() {
    const { coupons, fetchCoupons, addCoupon, deleteCoupon, isLoading } = useAdminStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount_type: "percentage" as "percentage" | "fixed",
        discount_value: 0,
        min_order_amount: 0,
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCoupon({ ...newCoupon, code: newCoupon.code.toUpperCase() });
        setIsAddModalOpen(false);
        setNewCoupon({
            code: "",
            discount_type: "percentage",
            discount_value: 0,
            min_order_amount: 0,
            is_active: true
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="font-display text-3xl mb-1">Promo & Discounts</h2>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Create and manage your coupon codes</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gold text-black px-8 py-4 font-nav font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 shadow-xl shadow-gold/10"
                >
                    <Plus className="w-5 h-5" /> Create Coupon
                </button>
            </div>

            {isLoading ? (
                <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white border border-slate-200 p-8 group relative hover:border-primary transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/5 rounded-lg">
                                    <Tag className="w-6 h-6 text-primary" />
                                </div>
                                <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${coupon.is_active ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}`}>
                                    {coupon.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <h3 className="font-nav text-2xl font-bold tracking-[0.1em] text-primary mb-2 uppercase">{coupon.code}</h3>
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 uppercase tracking-widest">Discount</span>
                                    <span className="font-bold text-primary">{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 uppercase tracking-widest">Min. Order</span>
                                    <span className="font-bold">₹{coupon.min_order_amount.toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteCoupon(coupon.id)}
                                className="w-full py-4 border border-red-100 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Coupon
                            </button>
                        </div>
                    ))}

                    {coupons.length === 0 && (
                        <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 p-20 text-center">
                            <Tag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="font-nav font-bold uppercase tracking-widest text-slate-400">No active coupons</p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg shadow-2xl p-10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-display text-2xl">Create New Coupon</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-primary"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Coupon Code</label>
                                    <input required value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} className="w-full p-4 border border-slate-200 focus:border-primary outline-none font-bold uppercase" placeholder="SUMMER25" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Discount Type</label>
                                        <select value={newCoupon.discount_type} onChange={e => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })} className="w-full p-4 border border-slate-200 focus:border-primary outline-none bg-white font-bold text-xs">
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Value</label>
                                        <input required type="number" value={newCoupon.discount_value} onChange={e => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })} className="w-full p-4 border border-slate-200 focus:border-primary outline-none font-bold" min="0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Minimum Order Amount (₹)</label>
                                    <input required type="number" value={newCoupon.min_order_amount} onChange={e => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })} className="w-full p-4 border border-slate-200 focus:border-primary outline-none font-bold" min="0" />
                                </div>
                                <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" /> Generate Coupon
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
