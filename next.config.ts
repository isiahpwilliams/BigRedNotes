import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    proxyClientMaxBodySize: "10mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.AWS_S3_BUCKET && process.env.AWS_REGION
            ? `${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
            : "placeholder.s3.region.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
