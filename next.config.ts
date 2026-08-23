import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle canvas on server
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas');
      }
    }
    
    // Handle .mjs files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },
  // Allow Tesseract.js to load worker files
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy', 
            value: 'credentialless',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
