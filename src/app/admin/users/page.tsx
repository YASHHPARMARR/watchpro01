"use client";

import { Users, Search, Plus } from "lucide-react";

export default function Customers() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-display text-3xl">Customers</h1>
                <button className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Customer
                </button>
            </div>

            <div className="bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 w-64 mb-6">
                    <Search className="text-slate-400 w-4 h-4" />
                    <input placeholder="Search customers..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
                </div>

                <div className="text-center py-20 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-nav uppercase tracking-widest text-sm">Customer Database Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
