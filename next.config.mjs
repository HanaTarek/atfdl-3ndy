/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
          : process.env.NEXT_PUBLIC_SUPABASE_IMAGE_DOMAIN,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
