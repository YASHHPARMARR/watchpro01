"use client";

import { MapPin, Plus, Trash2, Edit } from "lucide-react";

export default function Addresses() {
    const addresses = [
        { id: "1", name: "Yash Sharma", phone: "+91 9876543210", line1: "123 Emerald Street", city: "Mumbai", state: "Maharashtra", pincode: "400001", isDefault: true }
    ];

    return (
        <div className="bg-white border border-primary/10 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-primary/5">
                <h2 className="font-display text-3xl">Saved Addresses</h2>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-gold transition-colors">
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="space-y-6">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`p-8 border-2 transition-all ${addr.isDefault ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-transparent border-primary/10"}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="text-primary w-5 h-5" />
                                    <h4 className="font-nav font-bold uppercase tracking-widest">{addr.name}</h4>
                                    {addr.isDefault && <span className="text-[10px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest">Default</span>}
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.line1}</p>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p className="text-slate-900 font-bold text-sm">{addr.phone}</p>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2 border border-primary/10 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-2 border border-primary/10 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-primary/10">
                        <p className="text-slate-400 font-display text-xl">No saved addresses found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
