"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { ShoppingBag, DollarSign, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const { products, orders, fetchProducts, fetchOrders, isLoading } = useAdminStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
        fetchOrders();
    }, [fetchProducts, fetchOrders]);

    if (!isMounted || isLoading) {
        return (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                Loading dashboard data...
            </div>
        );
    }

    // Dynamic Chart Data
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }).reverse();

    const chartData = last7Days.map(date => {
        const count = orders.filter(o => {
            const orderDate = new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            return orderDate === date;
        }).length;
        return { name: date, orders: count };
    });

    const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;

    const stats = [
        { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, trend: "+12%", up: true },
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+8%", up: true },
        { label: "Total Products", value: products.length.toString(), icon: Package, trend: "0%", up: true },
        { label: "Pending Orders", value: pendingCount.toString(), icon: AlertTriangle, trend: "-3%", up: false },
    ];

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const activeStatusData = [
        { name: "Delivered", value: statusCounts["Delivered"] || 0, color: "#8b4a5c" },
        { name: "Processing", value: statusCounts["Processing"] || 0, color: "#C9A84C" },
        { name: "Shipped", value: statusCounts["Shipped"] || 0, color: "#1c1618" },
        { name: "Pending", value: statusCounts["Pending"] || 0, color: "#94a3b8" },
    ].filter(s => s.value > 0);

    return (
        <div className="space-y-8">
            {/* Row 1: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 border border-slate-100">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-green-600" : "text-red-600"}`}>
                                {stat.trend} {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            </div>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-display">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Row 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 border border-slate-200 shadow-sm">
                    <h3 className="font-display text-xl mb-8">Orders Last 7 Days</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                                <Tooltip
                                    cursor={{ fill: "rgba(139, 74, 92, 0.05)" }}
                                    contentStyle={{ border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", borderRadius: "0" }}
                                />
                                <Bar dataKey="orders" fill="#8b4a5c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 border border-slate-200 shadow-sm text-center">
                    <h3 className="font-display text-xl mb-8">Order Status</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activeStatusData.length > 0 ? activeStatusData : [{ name: "No Data", value: 1, color: "#f1f5f9" }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(activeStatusData.length > 0 ? activeStatusData : [{ name: "No Data", value: 1, color: "#f1f5f9" }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {activeStatusData.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-display text-xl">Recent Orders</h3>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-gold transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.slice(0, 5).map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-xs font-bold text-primary">{row.id}</td>
                                        <td className="p-4 text-xs font-semibold">{row.customer}</td>
                                        <td className="p-4 text-[10px] font-bold uppercase tracking-widest">
                                            <span className={`px-2 py-1 rounded-full ${row.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{row.status}</span>
                                        </td>
                                        <td className="p-4 text-xs font-bold">₹{row.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h3 className="font-display text-xl">Low Stock Alert</h3>
                    </div>
                    <div className="p-2">
                        {products.filter(p => p.stock <= 5).slice(0, 4).map((p, i) => (
                            <div key={i} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-all border-b border-primary/5 last:border-0">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider mb-1">{p.name}</p>
                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Only {p.stock} left in stock</p>
                                </div>
                                <button className="p-2 text-primary hover:text-gold transition-colors"><Package className="w-4 h-4" /></button>
                            </div>
                        ))}
                        {products.filter(p => p.stock <= 5).length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                Stock levels are healthy
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
