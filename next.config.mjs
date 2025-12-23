/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
