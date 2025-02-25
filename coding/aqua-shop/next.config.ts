import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: true, // Use `true` for 301 redirects, `false` for 302
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // Ensure it matches your dev server port
        pathname: "/uploads/**",
      },
    ],
    domains: ['static.thcdn.com', 'static.vecteezy.com'], // Corrected hostname without protocol
  },
};

export default nextConfig;
