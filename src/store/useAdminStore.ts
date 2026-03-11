import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface AdminProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    image: string;
}

export interface AdminOrder {
    id: string;
    display_id: string;
    customer: string;
    date: string;
    amount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    payment: string;
    method: string;
    user_id: string;
}

export interface AdminCoupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    is_active: boolean;
    created_at: string;
}

export interface AdminUser {
    id: string;
    full_name: string;
    avatar_url: string;
    role: string;
    created_at: string;
}

interface AdminStoreState {
    products: AdminProduct[];
    orders: AdminOrder[];
    coupons: AdminCoupon[];
    users: AdminUser[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchCoupons: () => Promise<void>;
    addProduct: (product: Omit<AdminProduct, 'id'>) => Promise<void>;
    updateProduct: (id: string, updatedProduct: Partial<AdminProduct>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCoupon: (coupon: Omit<AdminCoupon, 'id' | 'created_at'>) => Promise<void>;
    deleteCoupon: (id: string) => Promise<void>;
    updateOrderStatus: (id: string, status: AdminOrder['status'], userId?: string) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    uploadImage: (file: File) => Promise<string | null>;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
    products: [],
    orders: [],
    coupons: [],
    users: [],
    isLoading: false,

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                set({ users: data });
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteUser: async (id) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                users: state.users.filter(u => u.id !== id)
            }));
        }
    },

    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                const formatted = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    price: Number(p.price),
                    stock: p.stock,
                    category: p.category,
                    status: p.status,
                    image: p.main_image
                }));
                set({ products: formatted });
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles:user_id ( full_name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formatted = data.map(o => ({
                    id: o.id,
                    display_id: o.display_id,
                    customer: (o.profiles as any)?.full_name || 'Guest User',
                    date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    amount: Number(o.total_amount),
                    status: o.status,
                    payment: o.payment_status,
                    method: o.payment_method || 'Unknown',
                    user_id: o.user_id
                }));
                set({ orders: formatted });
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    addProduct: async (product) => {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                brand: product.brand,
                price: product.price,
                stock: product.stock,
                category: product.category,
                status: product.status,
                main_image: product.image
            }])
            .select()
            .single();

        if (!error && data) {
            const newProduct = {
                id: data.id,
                name: data.name,
                brand: data.brand,
                price: Number(data.price),
                stock: data.stock,
                category: data.category,
                status: data.status,
                image: data.main_image
            };
            set((state) => ({ products: [newProduct, ...state.products] }));
        }
    },

    updateProduct: async (id, updatedProduct) => {
        const updateData: any = {};
        if (updatedProduct.name) updateData.name = updatedProduct.name;
        if (updatedProduct.brand) updateData.brand = updatedProduct.brand;
        if (updatedProduct.price !== undefined) updateData.price = updatedProduct.price;
        if (updatedProduct.stock !== undefined) updateData.stock = updatedProduct.stock;
        if (updatedProduct.category) updateData.category = updatedProduct.category;
        if (updatedProduct.status) updateData.status = updatedProduct.status;
        if (updatedProduct.image) updateData.main_image = updatedProduct.image;

        const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id);

        if (!error) {
            set((state) => ({
                products: state.products.map(p =>
                    p.id === id ? { ...p, ...updatedProduct } : p
                )
            }));
        }
    },

    deleteProduct: async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                products: state.products.filter(p => p.id !== id)
            }));
        }
    },

    updateOrderStatus: async (id, status, userId) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (!error) {
            set((state) => ({
                orders: state.orders.map(o =>
                    o.id === id ? { ...o, status } : o
                )
            }));

            // Send notification if userId is provided
            if (userId) {
                await supabase.from('notifications').insert([{
                    user_id: userId,
                    title: 'Order Status Updated',
                    message: `Your order #${id.slice(0, 8)} status has been updated to ${status}.`,
                    type: 'order'
                }]);
            }
        }
    },

    deleteOrder: async (id) => {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                orders: state.orders.filter(o => o.id !== id)
            }));
        }
    },

    fetchCoupons: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            set({ coupons: data });
        }
        set({ isLoading: false });
    },

    addCoupon: async (coupon) => {
        const { data, error } = await supabase
            .from('coupons')
            .insert([coupon])
            .select()
            .single();

        if (!error && data) {
            set((state) => ({ coupons: [data, ...state.coupons] }));
        }
    },

    deleteCoupon: async (id) => {
        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                coupons: state.coupons.filter(c => c.id !== id)
            }));
        }
    },

    uploadImage: async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
}));
