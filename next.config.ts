import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // Configurações experimentais para melhor compatibilidade
  experimental: {
    serverComponentsExternalPackages: ["oracledb"],
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
