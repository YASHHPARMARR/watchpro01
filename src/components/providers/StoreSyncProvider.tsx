"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function StoreSyncProvider({ children }: { children: React.ReactNode }) {
    const { wishlist, setWishlist } = useStore();
    const { user } = useAuthStore();

    // 1. Initial Fetch on Login
    useEffect(() => {
        if (user) {
            const fetchWishlist = async () => {
                const { data, error } = await supabase
                    .from('wishlist')
                    .select('product_id, products(*)')
                    .eq('user_id', user.id);

                if (!error && data) {
                    const products = data.map((item: any) => ({
                        id: item.products.id,
                        name: item.products.name,
                        brand: item.products.brand,
                        price: item.products.price,
                        image: item.products.main_image,
                        category: item.products.category
                    }));
                    setWishlist(products);
                }
            };
            fetchWishlist();
        }
    }, [user, setWishlist]);

    // 2. Sync Local Wishlist to Supabase (Debounced ideally, but here simple)
    // We only sync when the local wishlist changes AND the user is logged in
    useEffect(() => {
        if (!user) return;

        const syncWishlist = async () => {
            // This is a naive approach: delete all and re-insert 
            // Better: diffing, but for a simple wishlist this works

            // First, get current IDs in Supabase to avoid redundant deletes/inserts
            // For now, let's just handle "Add" and "Remove" actions specifically if possible
            // But since useStore.toggleWishlist doesn't know about Supabase, 
            // we'll just handle it here.
        };

        // For now, let's keep it simple: any change to 'wishlist' array triggers a sync
        // But we need to be careful about loops (fetch -> setWishlist -> effect -> sync)
    }, [wishlist, user]);

    return <>{children}</>;
}
