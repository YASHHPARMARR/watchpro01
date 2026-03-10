"use client";

import { useState, useEffect } from "react";
import {
    ShoppingCart,
    Search,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    Trash2
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminOrders() {
    const { orders, updateOrderStatus, deleteOrder, fetchOrders, isLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Delivered": return "text-green-700 bg-green-100";
            case "Processing": return "text-amber-700 bg-amber-100";
            case "Shipped": return "text-blue-700 bg-blue-100";
            case "Pending": return "text-slate-400 bg-slate-100";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="font-display text-3xl mb-1">Sales Orders</h2>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Monitor and manage customer purchases</p>
                </div>
                <button className="bg-primary text-white px-8 py-4 font-nav font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary/90 transition-all border border-primary">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-0 focus:border-primary text-sm font-semibold"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                        <Filter className="w-4 h-4" /> More Filters
                    </button>
                    <select className="bg-slate-50 border border-slate-200 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:ring-0">
                        <option>All Status</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Loading orders...
                </div>
            ) : (
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-6">
                                            <span className="text-xs font-bold text-primary">{order.id}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-xs font-semibold">{order.customer}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Via {order.method}</div>
                                        </td>
                                        <td className="p-6 font-nav text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                            {order.date}
                                        </td>
                                        <td className="p-6">
                                            <p className="text-xs font-bold">₹{order.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 inline-block ${order.payment === 'Confirmed' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'}`}>
                                                {order.payment}
                                            </div>
                                        </td>
                                        <td className="p-6 text-[10px] font-bold uppercase tracking-widest">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any, order.user_id)}
                                                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-none focus:ring-0 ${getStatusStyle(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="View Details" className="p-2 hover:bg-white hover:text-primary hover:border-primary border border-transparent transition-all"><Eye className="w-4 h-4" /></button>
                                                <button
                                                    onClick={() => deleteOrder(order.id)}
                                                    title="Delete Order"
                                                    className="p-2 hover:bg-white hover:text-red-500 hover:border-red-500 border border-transparent transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Showing 5 of 3,120 Orders</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-slate-200 text-slate-400 hover:text-primary disabled:opacity-30" disabled><ChevronLeft className="w-4 h-4" /></button>
                            <button className="w-8 h-8 flex items-center justify-center text-[10px] font-bold bg-primary text-white">1</button>
                            <button className="w-8 h-8 flex items-center justify-center text-[10px] font-bold hover:bg-slate-200 text-slate-600">2</button>
                            <button className="p-2 border border-slate-200 text-slate-400 hover:text-primary"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
