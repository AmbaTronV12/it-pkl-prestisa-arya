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
};

export default nextConfig;
