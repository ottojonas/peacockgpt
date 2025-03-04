/** @type {import('next').NextConfig} */
const { createProxyMiddleware } = require("http-proxy-middleware");
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        },
      },
      {
        test: /\.pdf$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "static/pdf/",
              publicPath: "/_next/static/pdf/",
            },
          },
        ],
      }
    );
    return config;
  },
  distDir: "build",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://peacockgpt-backend-a08e5bc3eefc.herokuapp.com/: path"
            : "http://localhost:5000/:path*", // proxy to flask backend hopefully
      },
    ];
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/static" : "",
};

module.exports = nextConfig;
