/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cliffsidemotariacademy.com',
        pathname: '/uploads/**',
      },
      // Add the Supabase Storage hostname here once storage is wired up, e.g.:
      // { protocol: 'https', hostname: '<project-ref>.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

module.exports = nextConfig;
