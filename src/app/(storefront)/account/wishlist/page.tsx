"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function Wishlist() {
    const { wishlist: wishlistItems, toggleWishlist } = useStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="bg-white border border-primary/10 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-primary/5">
                <h2 className="font-display text-3xl">My Wishlist</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1">{wishlistItems.length} Items</span>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {wishlistItems.map((item, i) => (
                        <div key={item.id} className="relative group">
                            <ProductCard {...item} />
                            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => toggleWishlist(item)}
                                    className="w-10 h-10 bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <Heart className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="font-display text-2xl text-slate-400">Your wishlist is empty</h3>
                    <p className="text-slate-500 text-sm mt-4 mb-8">Save your favorite timepieces to track them easily.</p>
                    <Link href="/shop" className="btn-primary">Explore Collection</Link>
                </div>
            )}
        </div>
    );
}
