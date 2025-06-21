import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置選項
  reactStrictMode: true,
  images: {
    domains: ['api.dictionaryapi.dev'],
  },
};

export default nextConfig;
