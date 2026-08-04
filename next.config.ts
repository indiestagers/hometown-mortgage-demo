import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo at /<repo>/, so a basePath is required for
 * assets and links to resolve. Set NEXT_PUBLIC_BASE_PATH in CI.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export — GitHub Pages has no Node runtime.
  output: "export",
  basePath,
  // Pages has no image optimizer.
  images: { unoptimized: true },
  // Emit /about/index.html so directory URLs resolve without a server rewrite.
  trailingSlash: true,
  // Keeps the dev overlay out of demo screenshots / client walkthroughs.
  devIndicators: false,
};

export default nextConfig;
