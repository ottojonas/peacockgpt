/** @type {import('next').NextConfig} */
const { createProxyMiddleware } = require("http-proxy-middleware");
const nextConfig = {
  distDir: "build",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // proxy to flask backend hopefully
      },
    ];
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/static" : "",
};

module.exports = nextConfig;
