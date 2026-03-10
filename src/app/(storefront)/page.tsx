"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Shield, RefreshCcw, Lock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'Active')
                .limit(4);

            if (data && !error) {
                const formatted = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    price: Number(p.price),
                    image: p.main_image,
                    category: p.category
                }));
                setFeaturedProducts(formatted);
            }
            setLoading(false);
        }
        fetchFeatured();
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background-dark">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark z-10" />
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOOROVtiAALWrAy682hmKKzFwkPtq1xhLRbodGNwdtOCxhywM17EVpHOLVBsm1FktA8ZEE14xXKAKPzYA5wPcZ0RU_i01C7Rk-VcFaa3yt8zo2hfkC4T-hToHKu_JKCZqwJmrt1oWILEvwKnZ_Jp7IDdmO8-lOInoYRKZnqq10Y2pB3XhQYIliE5MPuNOJfEYh_sspV2zFyxhL82Pi28N9HY_GyiQuBmQRWsN5UaRqQ9fNgBuRaIzAiaB9awtnoAf7kWaMZufLuc4M"
                        alt="Hero Watch"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="relative z-20 text-center px-6">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-nav text-gold font-bold uppercase tracking-[0.4em] mb-6"
                    >
                        Luxury Timepieces
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display text-5xl md:text-8xl text-white mb-8 leading-tight"
                    >
                        Time Is Your Most <br /> <span className="italic text-gold">Precious</span> Asset
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <Link href="/shop" className="btn-gold">Shop Now</Link>
                        <Link href="/shop" className="btn-outline border-white text-white hover:bg-white hover:text-black">Our Legacy</Link>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-gold rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Infinite Marquee */}
            <div className="bg-primary py-4 overflow-hidden border-y border-white/10">
                <div className="marquee font-nav text-white text-sm font-bold uppercase tracking-[0.3em]">
                    <div className="marquee-content">
                        {["Luxury Collection", "100% Authentic", "Global Warranty", "Free Insured Shipping"].map((text, i) => (
                            <span key={i} className="flex items-center gap-8">
                                {text} <span className="text-gold">•</span>
                            </span>
                        ))}
                        {["Luxury Collection", "100% Authentic", "Global Warranty", "Free Insured Shipping"].map((text, i) => (
                            <span key={i + 4} className="flex items-center gap-8">
                                {text} <span className="text-gold">•</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="font-display text-4xl mb-16 text-center"
                >
                    Curated Collections
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Luxury", label: "Heritage", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQdbI9FoR_1DztNpUDaTFBrr739SbxTz7VE6a8nZYMbPpH5I-iJMStzhursluoD1y6Snf72aFctEq-gcbiU5ovLqN9cYzafpNO-ECIzZSX9xkqw6C5imJ9fkOWP5ka1juNCgaECTjLpkhLkfNrXGXNq_KlBhUNs3p5_he_i-4VbCQpIqbCuskGtBkh8XUd1BWUwvpKePVrsPY1HGYnC-JTVTHMZFm0WkogrrTohRFAF6Z5wxgooaeDDe-iDIJcl5ugiBiUhjxWGgb0" },
                        { name: "Sport", label: "Performance", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJwGEo4kpzyeOY-fSUh8D317a8-SKy5k6s96Q-RdM6c7vFXFR5oLofWj5ybiw7hPNV5Tl1QDI_F3IeC9hi1IADw1ASP6RcUVnsVPWzcmQz6Ej4F82QxARJEa5XJc-x1_4jweWMBptPY2yFYU9FSW-w6rCkTGYaDq9kgJPoO3y5Y-9vzbR-vMzllDV0FXGOpkAKlxdM4fV1YyYqabu66yVsBdaoaoSlstQuTSOKO07IzKFbJdWETm_JqABhLIH8NoxK55qH4sMMPMMB" },
                        { name: "Casual", label: "Lifestyle", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF_H01m25X7wrtMS4QVaQKMnjFkxph_4deCSn56d-1AJm-xex2-iwiiwEPEiRIJ0IOKIahndZSB2pOQz-Yrrpt61Zx7futd4QzWYJwFpmGeLVOtQboDAX3uYWGLwaYZ9ILpuCpPIgJ5y2xh0ExECI8fDQ1cLzKzStU9f_xlgIVpHbwqkyosCR7QKlVoe6qOeEWxdRE8NNGybKUfhtBs5xlwClrJxnA5IbLc7Y7-YiVrtW1um9t9Si2f4UC4VzZLxEq6tdIZg3fxtGB" },
                        { name: "Smart", label: "Modern", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeymXWLHSXMwa0pP17J0J6DBAwQOJqTTIaVjbfmvvdF8HwXVfQCSPv60OMpxOu1isolcgpIvTu1jMgUSHdnKRtqTBddSl3f3YqQquSQdYPW0drngJnpPlyREpMEnbR1oc0vWtycY881I6x4QsHoLmsF0JQBI5xK50cHD9E94taBUsFCVcN-iTgfMYaHalNQJFOpYreZEo2gg2zjjdKkqfHUGAHJhQmg62bbo0BKv7C0Zsiot66mTzpEytcm456qm--IjUtQcpW3LdX" }
                    ].map((cat, i) => (
                        <Link key={i} href={`/shop?category=${cat.name.toLowerCase()}`}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="group relative h-[400px] overflow-hidden bg-background-dark border border-white/5"
                            >
                                <Image src={cat.img} alt={cat.name} fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 z-10">
                                    <p className="font-nav text-xs uppercase tracking-widest text-primary mb-2">{cat.label}</p>
                                    <h4 className="font-display text-2xl text-white mb-4">{cat.name}</h4>
                                    <div className="w-10 h-0.5 bg-gold group-hover:w-full transition-all duration-500" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h3 className="font-display text-4xl mb-4">Featured Timepieces</h3>
                            <div className="w-20 h-1 bg-primary"></div>
                        </div>
                        <Link href="/shop" className="font-nav text-sm font-bold uppercase tracking-widest text-primary hover:opacity-80 flex items-center gap-2 group">
                            View All Models <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="py-20 text-center">Loading Masterpieces...</div>
                    ) : (
                        <div className="flex overflow-x-auto pb-8 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-10 snap-x">
                            {featuredProducts.map((p, i) => (
                                <div key={i} className="min-w-[280px] md:min-w-0 snap-center">
                                    <ProductCard {...p} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Flash Sale Countdown */}
            <section className="bg-background-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
                    <h5 className="font-nav text-gold font-bold uppercase tracking-[0.4em] mb-4">Limited Availability</h5>
                    <h2 className="font-display text-5xl md:text-7xl text-white mb-10">Exclusive Flash Sale</h2>

                    <div className="flex gap-4 md:gap-8 mb-12">
                        {[
                            { label: "Hours", val: "02" },
                            { label: "Minutes", val: "45" },
                            { label: "Seconds", val: "12" }
                        ].map((t, i) => (
                            <div key={i} className="flex items-center gap-4 md:gap-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl md:text-6xl font-display text-white">{t.val}</span>
                                    <span className="font-nav text-xs uppercase text-slate-500 tracking-widest mt-2">{t.label}</span>
                                </div>
                                {i < 2 && <span className="text-4xl md:text-6xl font-display text-gold">:</span>}
                            </div>
                        ))}
                    </div>

                    <Link href="/shop" className="btn-gold shadow-2xl shadow-gold/20">
                        Shop Sale Now
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Shield, title: "Lifetime Warranty", desc: "Our commitment to quality extends beyond your purchase. Enjoy peace of mind with our lifetime craftsmanship guarantee." },
                        { icon: Lock, title: "Secure Delivery", desc: "Complimentary insured worldwide shipping. Your timepiece is tracked and protected from our door to yours." },
                        { icon: RefreshCcw, title: "Easy Returns", desc: "Not satisfied? We offer a 30-day hassle-free return policy on all our premium collections." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="flex flex-col items-center text-center p-8 bg-white border border-primary/10 shadow-sm"
                        >
                            <item.icon className="text-primary w-12 h-12 mb-6" />
                            <h4 className="font-nav font-bold text-lg uppercase mb-4 tracking-wider">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-primary/5">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="font-display text-4xl mb-16 text-center">Connoisseur Perspectives</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Jameson Thorne", role: "Collector since 2012", text: "The attention to detail on the Rose Master II is simply breathtaking. It's more than a watch; it's a conversation piece that holds its value." },
                            { name: "Elena Rossi", role: "Style Director", text: "CHRONOS has bridged the gap between heritage design and modern technology flawlessly. Their customer service is unmatched." },
                            { name: "Marcus Vaughn", role: "Business Executive", text: "Authenticity was my main concern when buying online. CHRONOS provided complete certification and a seamless buying experience." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-10 shadow-sm border border-primary/5">
                                <div className="flex text-gold mb-6">
                                    {Array(5).fill(0).map((_, i) => <span key={i} className="material-symbols-outlined fill-1">star</span>)}
                                </div>
                                <p className="italic text-slate-600 mb-8 leading-relaxed">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20" />
                                    <div>
                                        <p className="font-nav font-bold text-sm uppercase">{t.name}</p>
                                        <p className="text-xs text-primary">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
