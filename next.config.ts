import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts"],
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
  },
};

export default nextConfig;