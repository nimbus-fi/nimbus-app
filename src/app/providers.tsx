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

import {
    mainnet,
    sepolia,
    polygonMumbai,
} from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';
// import { alchemyProvider } from "wagmi/providers/alchemy";

const ubit = {
    id: 44433,
    name: 'Ubit Testnet',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14914.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'USC', symbol: 'USC', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://testnet-rpc.ubitscan.io/'] },
    },
    blockExplorers: {
        default: { name: 'UBITscan', url: 'https://ubitscan.io/' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 11_907_934,
        },
    },
} as const satisfies Chain;

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [ubit, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const projectId = '9811958bd307518b364ff7178034c435';


// const connectors = connectorsForWallets([
//     ...wallets,
//     {
//         groupName: 'Other',
//         wallets: [
//             argentWallet({ projectId, chains }),
//             trustWallet({ projectId, chains }),
//             ledgerWallet({ projectId, chains }),
//         ],
//     },
// ]);
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
