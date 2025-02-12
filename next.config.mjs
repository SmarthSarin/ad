
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:3000'
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), "mongodb-client-encryption"];
    return config;
  },
};

export default nextConfig;
