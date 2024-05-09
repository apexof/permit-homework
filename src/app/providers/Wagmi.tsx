'use client'

import { FC, PropsWithChildren } from 'react'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { sepolia } from 'viem/chains'

const config = getDefaultConfig({
  appName: 'permit',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export const Web3Provider: FC<PropsWithChildren> = (props) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider appInfo={{ appName: 'permit' }} locale="en">
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
