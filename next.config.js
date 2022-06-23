/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [`${process.env.NEXT_PUBLIC_SUPABASE_DOMAIN}`, `${process.env.CLIENT_DOMAIN}`],
  },
};

module.exports = nextConfig;
