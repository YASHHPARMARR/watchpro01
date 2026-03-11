"use client";

import { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart, toggleWishlist, isInWishlist } = useStore();
    const { user } = useAuthStore();

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isWishlisted = isInWishlist(product?.id);

    const handleToggleWishlist = async () => {
        if (!product) return;

        // Local update
        toggleWishlist(product);

        // Supabase sync
        if (user) {
            if (!isWishlisted) {
                await supabase.from('wishlist').insert([{ user_id: user.id, product_id: product.id }]);
            } else {
                await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
            }
        }
    };

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const { data: pData, error: pError } = await supabase
                .from('products')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (pData && !pError) {
                setProduct({
                    id: pData.id,
                    name: pData.name,
                    brand: pData.brand,
                    price: Number(pData.price),
                    originalPrice: Number(pData.price) * 1.15, // Mock discount
                    rating: 4.8,
                    reviews: 124,
                    stock: pData.stock,
                    description: pData.description || 'Premium luxury timepiece crafted with exceptional materials and precision engineering.',
                    image: pData.main_image,
                    images: pData.images?.length ? pData.images : [pData.main_image]
                });

                // Fetch related
                const { data: rData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', pData.category)
                    .neq('id', pData.id)
                    .limit(4);

                if (rData) {
                    setRelatedProducts(rData.map(r => ({
                        id: r.id,
                        name: r.name,
                        brand: r.brand,
                        price: Number(r.price),
                        image: r.main_image,
                        category: r.category
                    })));
                }
            }
            setLoading(false);
        }
        fetchProduct();
    }, [resolvedParams.id]);

    if (loading) {
        return <div className="pt-32 pb-24 text-center font-display text-2xl text-slate-400">Loading Masterpiece...</div>;
    }

    if (!product) {
        return <div className="pt-32 pb-24 text-center font-display text-2xl text-slate-400">Product Not Found</div>;
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 mb-24">
                {/* Left: Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square bg-background-light border border-primary/10 overflow-hidden group"
                    >
                        {product.images?.[activeImage] ? (
                            <Image 
                                src={product.images[activeImage]} 
                                alt={product.name} 
                                fill 
                                className="object-contain p-12 group-hover:scale-150 transition-transform duration-700 cursor-zoom-in" 
                            />
                        ) : product.image ? (
                            <Image 
                                src={product.image} 
                                alt={product.name} 
                                fill 
                                className="object-contain p-12 group-hover:scale-150 transition-transform duration-700 cursor-zoom-in" 
                            />
                        ) : null}
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${isInWishlist(product.id) ? "bg-gold text-black" : "bg-white text-primary hover:bg-gold hover:text-black"}`}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-24 aspect-square bg-background-light border-2 transition-all ${activeImage === i ? "border-gold shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                            >
                                {img && (
                                    <Image src={img} alt={`Thumb ${i}`} fill className="object-contain p-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <p className="font-nav text-sm uppercase tracking-[0.3em] text-primary font-bold">{product.brand}</p>
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl mb-6">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex text-gold">
                            {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-xs font-nav font-bold uppercase tracking-widest text-slate-400">({product.reviews} Reviews)</p>
                    </div>

                    <div className="flex items-end gap-4 mb-10">
                        <span className="text-4xl font-display text-primary">₹{product.price.toLocaleString()}</span>
                        <span className="text-xl text-slate-400 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-1">15% OFF</span>
                    </div>

                    <p className="text-slate-500 leading-relaxed mb-10 pb-8 border-b border-primary/10">
                        {product.description}
                    </p>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-center gap-6">
                            <span className="font-nav text-xs uppercase tracking-widest text-slate-500 w-24">Quantity</span>
                            <div className="flex items-center border border-primary/20">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-primary/5 transition-colors">-</button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-primary/5 transition-colors">+</button>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-green-600">In Stock: {product.stock} left</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => addToCart(product, quantity)}
                            className="btn-primary flex items-center justify-center gap-3"
                        >
                            <ShoppingBag className="w-5 h-5" /> Add to Cart
                        </button>
                        <button className="bg-[#25D366] text-white py-4 font-nav font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-500/10">
                            <MessageCircle className="w-5 h-5" /> WhatsApp Order
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-primary/10">
                        {[
                            { icon: ShieldCheck, text: "Official Warranty" },
                            { icon: Truck, text: "Free Insured Shipping" },
                            { icon: RefreshCw, text: "30-Day Returns" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 text-center">
                                <item.icon className="w-5 h-5 text-primary/60" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-24">
                <div className="flex border-b border-primary/10 mb-12">
                    {["description", "specifications", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-8 font-nav text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-primary" : "text-slate-400 hover:text-primary"}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                        </button>
                    ))}
                </div>

                <div className="min-h-[200px]">
                    {activeTab === "description" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-slate-600 leading-relaxed font-body">
                            <p className="mb-6">The Rose Master II is not just a timepiece; it is a statement of refined taste and uncompromising quality. Each component is meticulously crafted from premium materials, ensuring that your watch remains as timeless as the heritage it represents.</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Automatic mechanical movement with 72-hour power reserve</li>
                                <li>42mm Rose Gold & Grade 5 Titanium case</li>
                                <li>Scratch-resistant anti-reflective sapphire crystal</li>
                                <li>Water resistant up to 100 meters (10 ATM)</li>
                                <li>Hand-stitched Italian leather strap with deployant clasp</li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <section>
                <div className="flex justify-between items-end mb-12">
                    <h3 className="font-display text-3xl">You May Also Like</h3>
                    <div className="flex gap-2">
                        <div className="w-12 h-1 bg-gold" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map((p, i) => (
                        <ProductCard key={i} {...p} />
                    ))}
                </div>
            </section>
        </div>
    );
}
