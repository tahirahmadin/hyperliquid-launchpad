"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { http } from "viem";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "hedgewater-etf",
  description: "HedgewaterETFs",
  url: "https://hedgewater-presale.vercel.app/", // origin must match your domain & subdomain
  icons: ["https://www.hedgewater.xyz/images/logo.jpeg"],
};

// Configure custom RPC URLs for Arbitrum
const customArbitrum = {
  ...arbitrum,
  rpcUrls: {
    ...arbitrum.rpcUrls,
    default: {
      http: [
        "https://thrilling-white-shard.arbitrum-mainnet.quiknode.pro/93334f224c914aa6f464adc8d0fc8f2537873833",
        "https://1rpc.io/arb",
        "https://arbitrum.llamarpc.com",
      ],
    },
    public: {
      http: [
        "https://thrilling-white-shard.arbitrum-mainnet.quiknode.pro/93334f224c914aa6f464adc8d0fc8f2537873833",
        "https://1rpc.io/arb",
        "https://arbitrum.llamarpc.com",
      ],
    },
  },
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [customArbitrum],
  defaultNetwork: customArbitrum,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function Web3ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3ContextProvider;
