"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Grid, List as ListIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");
    const initialSearch = searchParams.get("search");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(initialCategory ? (initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)) : "All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [priceRange, setPriceRange] = useState(500000);
    const [sortBy, setSortBy] = useState("featured");
    const [searchQuery, setSearchQuery] = useState(initialSearch || "");

    const categories = ["All", "Luxury", "Sport", "Casual", "Smart"];

    useEffect(() => {
        if (initialSearch) setSearchQuery(initialSearch);
        if (initialCategory) setActiveCategory(initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1));
    }, [initialSearch, initialCategory]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('status', 'Active')
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    const formatted = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        brand: p.brand,
                        price: Number(p.price),
                        image: p.main_image,
                        category: p.category,
                        stock: p.stock
                    }));
                    setProducts(formatted);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    let filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

    // Apply Search Filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply Price Filter
    filteredProducts = filteredProducts.filter(p => p.price <= priceRange);

    // Apply Sorting
    if (sortBy === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
        filteredProducts.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <h2 className="font-display text-2xl mb-8">Filters</h2>

                    {/* Search Field */}
                    <div className="mb-10">
                        <h4 className="font-nav text-xs uppercase tracking-widest text-slate-500 mb-4">Search</h4>
                        <input
                            type="text"
                            placeholder="Find a timepiece..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-sm focus:ring-0 focus:border-gold outline-none"
                        />
                    </div>

                    <div className="mb-10">
                        <h4 className="font-nav text-xs uppercase tracking-widest text-slate-500 mb-4">Categories</h4>
                        <div className="flex flex-col gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left text-sm font-semibold uppercase tracking-wider transition-colors ${activeCategory === cat ? "text-primary border-l-2 border-gold pl-3" : "text-slate-500 hover:text-primary"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h4 className="font-nav text-xs uppercase tracking-widest text-slate-500 mb-4">Price Range</h4>
                        <input
                            type="range"
                            min="0"
                            max="500000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full accent-gold"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-500 uppercase tracking-widest">
                            <span>₹0</span>
                            <span>₹{priceRange.toLocaleString()}+</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h4 className="font-nav text-xs uppercase tracking-widest text-slate-500 mb-4">Availability</h4>
                        <label className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
                            <input type="checkbox" className="rounded-none border-primary/20 text-primary focus:ring-primary" />
                            In Stock Only
                        </label>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-primary/10">
                        <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Showing {filteredProducts.length} Timepieces</p>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 px-4 py-2"
                            >
                                <Filter className="w-4 h-4" /> Filters
                            </button>

                            <div className="flex items-center gap-2 text-slate-400">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "text-primary" : "hover:text-primary"}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "text-primary" : "hover:text-primary"}`}
                                >
                                    <ListIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 px-4 py-2 min-w-[160px] justify-between bg-white focus:ring-0 outline-none pr-8 cursor-pointer"
                                >
                                    <option value="featured">Sort: Featured</option>
                                    <option value="newest">Sort: Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary" />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <h3 className="font-display text-2xl text-slate-400">Loading Masterpieces...</h3>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="font-display text-2xl text-slate-400">No timepieces match your selection</h3>
                            <button onClick={() => setActiveCategory("All")} className="mt-6 text-primary border-b border-primary uppercase text-xs font-bold tracking-widest">Clear All Filters</button>
                        </div>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard {...p} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-[400px] bg-white z-[70] p-10 lg:hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="font-display text-2xl">Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
                            </div>

                            <div className="mb-10">
                                <h4 className="font-nav text-xs uppercase tracking-widest text-slate-500 mb-6">Categories</h4>
                                <div className="flex flex-col gap-4">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); }}
                                            className={`text-left text-sm font-semibold uppercase tracking-wider transition-colors ${activeCategory === cat ? "text-primary border-l-2 border-gold pl-3" : "text-slate-500 hover:text-primary"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={
            <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
                <h3 className="font-display text-2xl text-slate-400 animate-pulse">Initializing Collection...</h3>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
