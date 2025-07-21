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
    }
    return config;
  },
};

export default nextConfig;


