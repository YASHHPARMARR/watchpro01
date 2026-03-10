"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Save, Database, Store, Truck, ShieldCheck } from "lucide-react";

export default function Settings() {
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        storeName: "CHRONOS Luxury",
        email: "support@chronos.jewelry",
        phone: "+91 98765 43210",
        freeShipping: true,
        codEnabled: false,
        taxRate: 18
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="font-display text-3xl mb-1">Global Settings</h2>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Manage store preferences and policies</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gold text-black px-8 py-4 font-nav font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 shadow-xl shadow-gold/10 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Store Profile */}
                    <div className="bg-white border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                            <Store className="w-5 h-5 text-primary" />
                            <h3 className="font-nav font-bold uppercase tracking-widest text-sm">Store Profile</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Name</label>
                                <input value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none text-sm font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support Email</label>
                                    <input value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none text-sm font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support Phone</label>
                                    <input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none text-sm font-semibold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policies */}
                    <div className="bg-white border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h3 className="font-nav font-bold uppercase tracking-widest text-sm">Policies & Checkout</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50">
                                <div>
                                    <p className="font-bold text-sm mb-1">Free Insured Shipping</p>
                                    <p className="text-xs text-slate-500">Enable free shipping on all luxury orders globally.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.freeShipping} onChange={e => setSettings({ ...settings, freeShipping: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50">
                                <div>
                                    <p className="font-bold text-sm mb-1">Cash on Delivery (COD)</p>
                                    <p className="text-xs text-slate-500">Allow payments via cash on delivery for local zones.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings({ ...settings, codEnabled: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Global Tax Rate (%)</label>
                                <input type="number" value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: Number(e.target.value) })} className="w-full p-3 border border-slate-200 focus:border-primary outline-none text-sm font-semibold" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Database Status */}
                    <div className="bg-white border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10" />
                        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                            <Database className="w-5 h-5 text-green-600" />
                            <h3 className="font-nav font-bold uppercase tracking-widest text-sm">System Status</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-bold text-green-700">Supabase Connected</span>
                            </div>
                            <div className="space-y-4 text-xs">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Database Engine</span>
                                    <span className="font-semibold">PostgreSQL</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Storage Sync</span>
                                    <span className="font-semibold text-green-600">Active</span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="text-slate-500">Last Backup</span>
                                    <span className="font-semibold">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
