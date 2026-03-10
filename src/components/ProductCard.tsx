"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

interface ProductCardProps {
    id?: string | number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
}

export default function ProductCard({ id, name, brand, price, originalPrice, image, category }: ProductCardProps) {
    const productUrl = `/product/${id || 1}`;
    const { addToCart, toggleWishlist, isInWishlist } = useStore();
    const { user } = useAuthStore();
    const isWishlisted = isInWishlist(id || 1);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({ id: id || 1, name, brand, price, originalPrice, image, category });
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        const product = { id: id || 1, name, brand, price, originalPrice, image, category };

        // Local state update
        toggleWishlist(product);

        // Supabase sync
        if (user) {
            if (!isWishlisted) {
                await supabase.from('wishlist').insert([{ user_id: user.id, product_id: id }]);
            } else {
                await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', id);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative bg-[#141414] border border-white/5 overflow-hidden hover:border-gold/50 transition-all duration-500"
        >
            <Link href={productUrl} className="relative aspect-[4/5] overflow-hidden block">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleToggleWishlist}
                        className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${isWishlisted ? "bg-gold text-black" : "bg-white/10 text-white hover:bg-gold hover:text-black"}`}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* Add to Cart Overlay */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent"
                >
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gold text-black py-3 font-nav text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer z-20 relative"
                    >
                        Add to Cart
                    </button>
                </motion.div>
            </Link>

            <div className="p-6 text-center">
                <p className="font-nav text-[10px] uppercase tracking-[0.2em] text-primary mb-2">{brand}</p>
                <Link href={productUrl}>
                    <h4 className="font-display text-xl text-white mb-3 group-hover:text-gold transition-colors">{name}</h4>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    <p className="font-body text-gold font-bold">₹{price.toLocaleString()}</p>
                    {originalPrice && (
                        <p className="text-slate-500 text-sm line-through">₹{originalPrice.toLocaleString()}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
