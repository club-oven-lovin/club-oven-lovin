/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows images from ANY HTTPS hostname
        port: '',
        pathname: '**', // This wildcard allows any path
      },
    ],
  },
  // Keep any other configurations you might have here
};

export default nextConfig;
