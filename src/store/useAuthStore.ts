import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'admin' | 'customer';
}

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    hasInitialized: boolean;
    initializeAuth: () => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    hasInitialized: false,

    initializeAuth: async () => {
        if (get().hasInitialized) return;

        try {
            set({ isLoading: true });

            // Get active session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session) {
                set({ session, user: session.user });

                // Fetch Profile for Role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    set({ profile: profile as Profile });
                }
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, newSession) => {
                set({ session: newSession, user: newSession?.user ?? null });

                if (newSession?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', newSession.user.id)
                        .single();

                    set({ profile: profile as Profile });
                } else {
                    set({ profile: null });
                }
            });

            set({ hasInitialized: true });
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, profile: null });
    },

    isAdmin: () => {
        const { profile } = get();
        return profile?.role === 'admin';
    }
}));
