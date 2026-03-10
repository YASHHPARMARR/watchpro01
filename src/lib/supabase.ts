import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for image URLs
export const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return `${supabaseUrl}/storage/v1/object/public/products/${path}`;
};
