/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.5"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.5",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
  rewrites: async () => {
    const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:4000";
    return [
      {
        source: "/v1/:path*",
        destination: `${apiUrl}/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
