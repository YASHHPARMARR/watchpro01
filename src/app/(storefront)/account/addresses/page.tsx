"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function Addresses() {
    const { user } = useAuthStore();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAddresses() {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (data && !error) {
                    setAddresses(data);
                }
            } catch (err) {
                console.error("Error fetching addresses:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAddresses();
    }, [user]);

    const deleteAddress = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            const { error } = await supabase.from('addresses').delete().eq('id', id);
            if (!error) {
                setAddresses(addresses.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error("Error deleting address:", err);
        }
    };

    if (loading) {
        return (
            <div className="bg-white border border-primary/10 p-10 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-nav text-xs uppercase tracking-widest text-slate-500 font-bold">Loading your addresses...</p>
            </div>
        );
    }

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
                        className={`p-8 border-2 transition-all ${addr.is_default ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-transparent border-primary/10"}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="text-primary w-5 h-5" />
                                    <h4 className="font-nav font-bold uppercase tracking-widest">{addr.full_name}</h4>
                                    {addr.is_default && <span className="text-[10px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest">Default</span>}
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.address_line1}</p>
                                {addr.address_line2 && <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.address_line2}</p>}
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">{addr.city}, {addr.state} - {addr.postal_code}</p>
                                <p className="text-slate-900 font-bold text-sm">{addr.phone}</p>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2 border border-primary/10 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                                <button
                                    onClick={() => deleteAddress(addr.id)}
                                    className="p-2 border border-primary/10 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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
