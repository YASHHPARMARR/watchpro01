"use client";

import { useEffect, useState } from "react";
import { Users, Search, Trash2, Mail, Shield, User as UserIcon } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

export default function Customers() {
    const { users, fetchUsers, deleteUser, isLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="font-display text-3xl mb-1">Customer Management</h2>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Manage your global client database</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 shadow-sm">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Clients</p>
                        <p className="text-lg font-display text-primary">{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 border border-slate-200 flex items-center gap-6 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:ring-0 focus:border-primary text-sm font-semibold"
                    />
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Accessing Database...
                </div>
            ) : (
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined Date</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold uppercase">
                                                    {user.full_name?.slice(0, 2) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider">{user.full_name || "Anonymous User"}</p>
                                                    <p className="text-[10px] text-slate-400 font-nav">{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-gold animate-pulse' : 'bg-green-500'}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-gold' : 'text-slate-500'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="View Profile" className="p-2 hover:bg-white hover:text-primary hover:border-primary border border-transparent transition-all"><UserIcon className="w-4 h-4" /></button>
                                                <button title="Send Email" className="p-2 hover:bg-white hover:text-primary hover:border-primary border border-transparent transition-all"><Mail className="w-4 h-4" /></button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    title="Delete User"
                                                    className="p-2 hover:bg-white hover:text-red-500 hover:border-red-500 border border-transparent transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center text-slate-400 font-display text-xl">
                                            No customers found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
