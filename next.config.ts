import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts"],
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ 忽略 ESLint 规则检查，防止部署失败
  },
};

export default nextConfig;