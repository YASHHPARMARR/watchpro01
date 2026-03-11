"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Award, Clock, Users, Globe, Gem } from "lucide-react";

export default function About() {
    const stats = [
        { label: "Years of Heritage", value: "150+" },
        { label: "Master Artisans", value: "45" },
        { label: "Global Boutiques", value: "12" },
        { label: "Pieces Crafted", value: "8,500+" }
    ];

    const values = [
        {
            icon: Shield,
            title: "Uncompromising Quality",
            desc: "Every component is meticulously tested to meet the rigorous CHRONOS standards of excellence."
        },
        {
            icon: Gem,
            title: "Artisanal Craftsmanship",
            desc: "Our master watchmakers combine centuries-old techniques with modern precision engineering."
        },
        {
            icon: Award,
            title: "Timeless Design",
            desc: "We create pieces that transcend trends, designed to be passed down through generations."
        }
    ];

    return (
        <main className="min-h-screen pt-32 pb-24">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24 bg-background-dark">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsR883S25_46W6Q_8Y4uC_04T6h8xR7r8iX8iU4P9Y_0-G-f6-C-9-y-W-v-1-Q-3-0"
                        alt="Watchmaking"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark z-10" />
                </div>
                <div className="relative z-20 text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-5xl md:text-7xl text-white mb-6"
                    >
                        Our Legacy of <span className="italic text-gold">Precision</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-400 font-nav uppercase tracking-[0.3em] text-sm"
                    >
                        Mastering time since 1874
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-display text-4xl md:text-5xl mb-8">A Journey Through Time</h2>
                        <div className="space-y-6 text-slate-600 leading-relaxed font-body">
                            <p>
                                Founded in the heart of the Swiss Alps, CHRONOS began as a small family atelier dedicated to the pursuit of horological perfection. For over a century, we have remained true to our founding principles: precision, elegance, and soul.
                            </p>
                            <p>
                                Today, CHRONOS stands as a beacon of luxury, recognized globally for timepieces that do not just measure time, but celebrate it. Every watch that leaves our workshop is a testament to the thousands of hours of dedication by our artisans.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] border-8 border-primary/5"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0E3u-K2Z-N-f-0-Y-w-c-L-s-t-P-m-E-i-G-i-v-E-t-0"
                            alt="Watch Workshop"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-primary py-24 mb-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <h3 className="font-display text-4xl md:text-5xl text-white mb-2">{stat.value}</h3>
                            <p className="font-nav text-xs uppercase tracking-widest text-gold font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <h2 className="font-display text-4xl text-center mb-16">The Core of CHRONOS</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {values.map((value, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-12 bg-white border border-primary/5 shadow-sm">
                            <value.icon className="w-12 h-12 text-primary mb-8" />
                            <h4 className="font-nav font-bold uppercase tracking-wider mb-4">{value.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
