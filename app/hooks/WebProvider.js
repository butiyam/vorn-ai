'use client'
import { wagmiAdapter, projectId } from '../config/index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet } from '@reown/appkit/networks'
import { coinbaseWallet } from 'wagmi/connectors'
import React from 'react'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_PROJECT_ID in env variables");
}
// 2. Create a metadata object - optional
const metadata = {
  name: 'Vorn AI Souce',
  description: 'Trade Smarter. Invest Better. Automate Everything',
  url: 'https://www.vorn.ai/en', // origin must match your domain & subdomain
  icons: ["https://www.vorn.ai/assets/logo.svg"]
}
// 3. Set the networks
const networks = [mainnet]

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter, coinbaseWallet({
    appName: 'Vorn AI Souce',
    appLogoUrl: 'https://www.vorn.ai/assets/logo.svg', 
    preference: { options: 'all'}
  })],
  networks,
  projectId,
  enableInjected: true,
  metadata,
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
  ],
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false
  },
  themeVariables: {
    '--w3m-accent': '#FFF',
    '--w3m-border-radius-master': '20.69px'
  },
})

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};