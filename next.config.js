/** @type {import('next').NextConfig} */
const nextConfig = {
  // Опции для конфигурации Next.js
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Опции для оптимизации
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
