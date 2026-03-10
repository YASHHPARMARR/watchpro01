import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string | number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface StoreState {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string | number) => boolean;
    setWishlist: (products: Product[]) => void;
    coupon: { code: string; type: 'percentage' | 'fixed'; value: number } | null;
    applyCoupon: (coupon: { code: string; type: 'percentage' | 'fixed'; value: number } | null) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            addToCart: (product, quantity = 1) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id);
                if (existing) {
                    return {
                        cart: state.cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    };
                }
                return { cart: [...state.cart, { ...product, quantity }] };
            }),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.id !== productId)
            })),
            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            })),
            clearCart: () => set({ cart: [] }),
            toggleWishlist: (product) => set((state) => {
                const exists = state.wishlist.find(item => item.id === product.id);
                if (exists) {
                    return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
                }
                return { wishlist: [...state.wishlist, product] };
            }),
            isInWishlist: (productId) => {
                return get().wishlist.some(item => item.id === productId);
            },
            setWishlist: (products) => set({ wishlist: products }),
            coupon: null,
            applyCoupon: (coupon) => set({ coupon })
        }),
        {
            name: 'watchpro-storage',
        }
    )
);
