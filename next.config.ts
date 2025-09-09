import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para upload de arquivos
  experimental: {
    // Optimize package imports to shrink client bundles
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  // Configurações de tamanho de request
  serverRuntimeConfig: {
    // Configurações do servidor
    maxFileSize: '10mb',
  },

  // Configurações específicas para Vercel
  ...(process.env.VERCEL && {
    experimental: {
      ...((process.env.VERCEL && {
        optimizePackageImports: ["lucide-react", "react-icons", "@prisma/client"],
      }) || {}),
      // Reduzir o tamanho do bundle para Vercel
      serverComponentsExternalPackages: ["@prisma/client"],
    },
  }),

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Evita incluir esses módulos no bundle do servidor
      config.externals = config.externals || [];
      config.externals.push(
        "@azure/keyvault-secrets",
        "@azure/app-configuration",
        "@azure/identity",
        "oci-common",
        "oci-objectstorage",
        "oci-secrets"
      );

      // Configurações específicas para Oracle em produção
      if (process.env.NODE_ENV === "production") {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
        };
      }
    }
    return config;
  },

  // Headers para CORS se necessário
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
