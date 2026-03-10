"use client";

import { MonitorPlay, Plus } from "lucide-react";

export default function Banners() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-display text-3xl">Banner Management</h1>
                <button className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Upload Banner
                </button>
            </div>

            <div className="bg-white p-6 shadow-sm border border-slate-200">
                <div className="text-center py-20 text-slate-500">
                    <MonitorPlay className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-nav uppercase tracking-widest text-sm">CMS Banners Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
