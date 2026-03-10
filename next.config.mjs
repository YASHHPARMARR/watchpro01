/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'tqnhqxtshqxayzqxaxqx.supabase.co', // Will update with actual Supabase URL
            },
        ],
    },
};

export default nextConfig;
