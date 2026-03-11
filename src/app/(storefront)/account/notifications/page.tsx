"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, Package, Info, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function Notifications() {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);
            
            if (!error) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);
            
            if (!error) {
                setNotifications(notifications.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="w-5 h-5 text-blue-500" />;
            case 'promo': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white border border-primary/10 p-10 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-nav text-xs uppercase tracking-widest text-slate-500 font-bold">Loading your notifications...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-primary/10 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-primary/5">
                <h2 className="font-display text-3xl">Notifications</h2>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {notifications.filter(n => !n.read).length} Unread
                </div>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`p-6 border-l-4 transition-all flex items-start justify-between gap-6 ${notif.read ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-primary shadow-md"}`}
                    >
                        <div className="flex gap-4">
                            <div className="mt-1">{getIcon(notif.type)}</div>
                            <div>
                                <h4 className={`text-sm font-bold uppercase tracking-wider mb-1 ${notif.read ? "text-slate-500" : "text-slate-900"}`}>{notif.title}</h4>
                                <p className="text-slate-600 text-sm mb-3 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {new Date(notif.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="p-2 border border-primary/10 text-slate-400 hover:text-primary transition-colors"
                                    title="Mark as Read"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => deleteNotification(notif.id)}
                                className="p-2 border border-primary/10 text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-primary/10">
                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-display text-xl">Inbox is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}
