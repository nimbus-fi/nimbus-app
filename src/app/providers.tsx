'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
    connectorsForWallets,
    getDefaultWallets,
    Chain,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import 'dotenv/config'

const opencampus = {
    id: 656476,
    name: "opencampus",
    rpcUrls: {
        public: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
        default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
    },
    blockExplorers: {
        default: {
            name: "Open Campus Codex",
            url: "https://opencampus.gelatoscout.com",
            apiUrl: "https://opencampus.gelatoscout.com/api",
        },
    },
    nativeCurrency: {
        decimals: 18,
        name: "EDU",
        symbol: "EDU",
    },
    testnet: true,
} as const satisfies Chain;

const projectId = '9811958bd307518b364ff7178034c435';

const config = getDefaultConfig({
    appName: 'Nimbus Finance App',
    projectId: projectId,
    chains: [opencampus],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const { wallets } = getDefaultWallets({
    appName: 'RainbowKit demo',
    projectId,
});

const demoAppInfo = {
    appName: 'My Wallet Demo',
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider appInfo={demoAppInfo}>
                    {mounted && children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
