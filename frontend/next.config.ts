/** @type {import('next').NextConfig} */
interface WebpackRule {
  test: RegExp;
  exclude?: RegExp;
  use: {
    loader: string;
    options: {
      presets: string[];
      plugins: string[];
    };
  } | {
    loader: string;
    options: {
      name: string;
      outputPath: string;
      publicPath: string;
    };
  }[];
}

interface NextConfig {
  webpack: (config: any) => any;
  distDir: string;
  reactStrictMode: boolean;
  rewrites: () => Promise<{ source: string; destination: string }[]>;
  assetPrefix: string;
}

const nextConfig: NextConfig = {
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
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}`, // proxy to flask backend hopefully
      },
    ];
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/static" : "",
};

module.exports = nextConfig;
