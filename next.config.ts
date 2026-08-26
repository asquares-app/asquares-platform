import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["reagent.localhost", "*.localhost"],
};

export default nextConfig;
