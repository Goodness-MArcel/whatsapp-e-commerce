/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  serverExternalPackages: ["pg", "sequelize" , "pg-hstore", "dotenv"],

  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },

   experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
  },
    images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary hostname here
  },
  
};

export default nextConfig;
