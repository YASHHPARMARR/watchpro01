"use client";

import { useState, useEffect } from "react";
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import Image from "next/image";
import { useAdminStore } from "@/store/useAdminStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
    const { products, deleteProduct, addProduct, fetchProducts, isLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: "",
        brand: "",
        price: 0,
        stock: 0,
        category: "Luxury",
        status: "Active",
        image: ""
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        let imageUrl = newProduct.image;
        if (imageFile) {
            const uploadedUrl = await useAdminStore.getState().uploadImage(imageFile);
            if (uploadedUrl) imageUrl = uploadedUrl;
        }

        await addProduct({ ...newProduct, image: imageUrl });

        setIsAddModalOpen(false);
        setIsUploading(false);
        setImageFile(null);
        setImagePreview(null);
        setNewProduct({
            name: "",
            brand: "",
            price: 0,
            stock: 0,
            category: "Luxury",
            status: "Active",
            image: ""
        });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="font-display text-3xl mb-1">Products Inventory</h2>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Manage your watch catalog and stock levels</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gold text-black px-8 py-4 font-nav font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 shadow-xl shadow-gold/10"
                >
                    <Plus className="w-5 h-5" /> Add New Product
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products, brands, SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-0 focus:border-primary text-sm font-semibold"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select className="bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:ring-0">
                        <option>All Categories</option>
                        <option>Luxury</option>
                        <option>Sport</option>
                        <option>Casual</option>
                    </select>
                    <select className="bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:ring-0">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                    </select>
                </div>
            </div>

            {/* Product Table */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Loading inventory...
                </div>
            ) : (
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 bg-slate-50 border border-slate-100 shrink-0">
                                                    <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors">{p.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1">{p.category}</span>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-primary">₹{p.price.toLocaleString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                                                <span className="text-xs font-bold">{p.stock}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 inline-block ${p.status === 'Active' ? 'text-green-700 bg-green-100' : 'text-slate-400 bg-slate-100'}`}>
                                                {p.status}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="Edit" className="p-2 hover:bg-white hover:text-primary hover:border-primary border border-transparent transition-all"><Edit className="w-4 h-4" /></button>
                                                <button
                                                    onClick={() => deleteProduct(p.id)}
                                                    title="Delete"
                                                    className="p-2 hover:bg-white hover:text-red-500 hover:border-red-500 border border-transparent transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button title="Preview" className="p-2 hover:bg-white hover:text-blue-500 hover:border-blue-500 border border-transparent transition-all"><ExternalLink className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Showing {filteredProducts.length} Products</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-slate-200 text-slate-400 hover:text-primary disabled:opacity-30" disabled><ChevronLeft className="w-4 h-4" /></button>
                            {[1, 2, 3].map(n => (
                                <button key={n} className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold ${n === 1 ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-600'}`}>{n}</button>
                            ))}
                            <button className="p-2 border border-slate-200 text-slate-400 hover:text-primary"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-display text-2xl">Create New Masterpiece</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-primary"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <form id="addProductForm" onSubmit={handleAddSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Product Name</label>
                                            <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none" placeholder="e.g. The Rose Master II" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Brand Collection</label>
                                            <input required value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none" placeholder="e.g. Grand Collection" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Price (₹)</label>
                                            <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Initial Stock</label>
                                            <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
                                            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none bg-white">
                                                <option value="Luxury">Luxury</option>
                                                <option value="Sport">Sport</option>
                                                <option value="Casual">Casual</option>
                                                <option value="Smart">Smart</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Status</label>
                                            <select value={newProduct.status} onChange={e => setNewProduct({ ...newProduct, status: e.target.value as "Active" | "Draft" | "Archived" })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none bg-white">
                                                <option value="Active">Active</option>
                                                <option value="Draft">Draft</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Product Image</label>
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
                                                    {imagePreview ? (
                                                        <Image src={imagePreview} alt="Preview" fill className="object-contain p-2" />
                                                    ) : (
                                                        <Plus className="w-6 h-6 text-slate-300" />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-slate-400 font-semibold mb-2">UPLOAD PRODUCT IMAGE (PNG, JPG, WEBP)</p>
                                                    <input
                                                        type="text"
                                                        value={newProduct.image}
                                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                                        className="w-full p-3 border border-slate-200 focus:border-primary outline-none text-xs"
                                                        placeholder="Or paste direct image URL here"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 font-nav text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors" disabled={isUploading}>Cancel</button>
                                <button
                                    type="submit"
                                    form="addProductForm"
                                    className="bg-primary text-white px-8 py-3 font-nav text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50"
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Save Product"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
