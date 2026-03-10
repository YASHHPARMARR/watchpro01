"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CreditCard, ChevronLeft, CheckCircle2, Truck, Wallet, Plus, X, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { initializeRazorpay, createRazorpayOrder } from "@/lib/razorpay";
import { useRouter } from "next/navigation";

export default function Checkout() {
    const { cart: cartItems, coupon, clearCart } = useStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false
    });

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user?.id)
            .order('is_default', { ascending: false });

        if (!error && data) {
            setAddresses(data);
            if (data.length > 0) setSelectedAddressId(data[0].id);
        }
        setIsLoading(false);
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase
            .from('addresses')
            .insert([{ ...newAddress, user_id: user.id }]);

        if (!error) {
            setIsAddAddressOpen(false);
            fetchAddresses();
            setNewAddress({
                full_name: "",
                phone: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "India",
                is_default: false
            });
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const delivery = subtotal > 100000 ? 0 : 500;

    let discount = 0;
    if (coupon) {
        discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
    }
    const total = subtotal + delivery - discount;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId || isPlacingOrder) return;
        setIsPlacingOrder(true);

        const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId);
        if (!selectedAddress) {
            alert("Please select a valid delivery address.");
            setIsPlacingOrder(false);
            return;
        }

        try {
            if (paymentMethod === "online") {
                const res = await initializeRazorpay();
                if (!res) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    setIsPlacingOrder(false);
                    return;
                }

                const rzpOrder = await createRazorpayOrder(total);

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "CHRONOS Luxury",
                    description: "Order Payment",
                    order_id: rzpOrder.id,
                    handler: async function (response: any) {
                        await finalizeOrder(selectedAddress, "Confirmed", "online");
                    },
                    prefill: {
                        name: selectedAddress.full_name,
                        email: user?.email,
                        contact: selectedAddress.phone,
                    },
                    theme: {
                        color: "#8B4A5C",
                    },
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            } else {
                await finalizeOrder(selectedAddress, "Pending", "cod");
            }
        } catch (err: any) {
            alert("Ordering failed: " + (err.message || "Unknown error"));
            setIsPlacingOrder(false);
        }
    };

    const finalizeOrder = async (address: any, paymentStatus: string, method: string) => {
        const orderDisplayId = `CH-${Math.floor(100000 + Math.random() * 900000)}`;

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user?.id,
                display_id: orderDisplayId,
                total_amount: total,
                coupon_code: coupon?.code || null,
                discount_amount: discount,
                status: 'Processing',
                payment_status: paymentStatus,
                payment_method: method,
                shipping_address: address
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        clearCart();
        router.push(`/order/success?id=${order.id}`);
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <Link href="/cart" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Cart
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                    {/* Progress Stepper */}
                    <div className="flex items-center gap-4 mb-12">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-nav text-sm border-2 ${step >= i ? "bg-primary border-primary text-white" : "border-primary/20 text-slate-400"}`}>
                                    {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                                </div>
                                {i === 1 && <div className={`w-20 h-0.5 ${step > 1 ? "bg-primary" : "bg-primary/10"}`} />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="font-display text-4xl mb-10">Delivery Address</h2>
                                <div className="space-y-6">
                                    {isLoading ? (
                                        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                    ) : (
                                        <>
                                            {addresses.map((addr: any) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`p-8 bg-white border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-primary shadow-xl shadow-primary/5" : "border-primary/5 hover:border-primary/20"}`}
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <MapPin className={`${selectedAddressId === addr.id ? "text-primary" : "text-slate-300"} w-5 h-5`} />
                                                            <h4 className="font-nav font-bold uppercase tracking-widest">{addr.full_name}</h4>
                                                            {addr.is_default && <span className="text-[10px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest">Default</span>}
                                                        </div>
                                                        <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.address_line1}</p>
                                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">{addr.city}, {addr.state} - {addr.postal_code}</p>
                                                        <p className="text-slate-900 font-bold text-sm">{addr.phone}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={() => setIsAddAddressOpen(true)}
                                                className="w-full py-6 border-2 border-dashed border-primary/20 text-slate-400 hover:text-primary hover:border-primary transition-all font-nav font-bold uppercase tracking-widest text-xs"
                                            >
                                                + Add New Delivery Address
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="mt-12">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!selectedAddressId}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="font-display text-4xl mb-10">Select Payment Method</h2>
                                <div className="space-y-6">
                                    {[
                                        { id: "online", icon: CreditCard, title: "Online Payment", desc: "Pay securely via Razorpay (UPI, Cards, NetBanking)" },
                                        { id: "cod", icon: Wallet, title: "Cash on Delivery", desc: "Pay when you receive your luxury timepiece" }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`block p-8 cursor-pointer border-2 transition-all ${paymentMethod === method.id ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-transparent border-primary/10 hover:border-primary/40"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id as any)}
                                                className="hidden"
                                            />
                                            <div className="flex gap-6">
                                                <method.icon className={`w-6 h-6 ${paymentMethod === method.id ? "text-primary" : "text-slate-400"}`} />
                                                <div>
                                                    <h4 className={`font-nav font-bold uppercase tracking-widest ${paymentMethod === method.id ? "text-primary" : "text-slate-600"}`}>{method.title}</h4>
                                                    <p className="text-slate-500 text-sm mt-1">{method.desc}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-12">
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isPlacingOrder}
                                        className="btn-gold w-full text-center py-5 flex items-center justify-center gap-3"
                                    >
                                        {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                        {paymentMethod === "online" ? "Place Order & Pay Now" : "Confirm Order (COD)"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Add Address Modal */}
                <AnimatePresence>
                    {isAddAddressOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white w-full max-w-lg shadow-2xl p-8 overflow-hidden"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-display text-2xl">New Address</h3>
                                    <button onClick={() => setIsAddAddressOpen(false)} className="text-slate-400 hover:text-primary"><X className="w-6 h-6" /></button>
                                </div>
                                <form onSubmit={handleAddAddress} className="space-y-4">
                                    <input required value={newAddress.full_name} onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="Receiver's Name" />
                                    <input required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="Phone Number" />
                                    <input required value={newAddress.address_line1} onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="Street Address, Area" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="City" />
                                        <input required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="State" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required value={newAddress.postal_code} onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })} className="w-full p-4 border border-slate-200 outline-none focus:border-primary" placeholder="Pincode" />
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" checked={newAddress.is_default} onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Default</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-5 mt-4">Save Address</button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Order Summary Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-[#141414] p-8 text-white">
                        <h3 className="font-display text-2xl mb-8">Summary</h3>
                        <div className="space-y-6 mb-8 pb-8 border-b border-white/10 max-h-60 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-white/5 shrink-0 overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">{item.brand}</h4>
                                        <p className="text-sm font-semibold truncate w-40">{item.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                <span>Subtotal</span>
                                <span className="text-white">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                <span>Delivery</span>
                                <span className="text-green-500 uppercase">{delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gold text-white">
                                    <span>Discount ({coupon?.code})</span>
                                    <span className="text-gold">-₹{discount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-lg font-display uppercase tracking-widest">Total</span>
                            <span className="text-4xl font-display text-gold">₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4 p-6 border border-primary/10 bg-primary/5">
                        <div className="flex items-center gap-4">
                            <Truck className="w-5 h-5 text-primary" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Secure Insured Delivery</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Safe Payment Processing</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
