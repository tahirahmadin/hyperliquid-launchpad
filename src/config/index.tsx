import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "db1357dec488ed80c64690356e293113"; //process.env.VITE_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [arbitrum];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
