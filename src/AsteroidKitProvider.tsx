import React, { FC, ReactNode } from 'react';

import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import {
  TwitchConnector,
  GoogleConnector,
} from './connectors/social/connector';

const { chains, provider } = configureChains(
  [mainnet, polygon],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'My AsteroidKit App',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Social',
    wallets: [GoogleConnector({ chains }), TwitchConnector({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const AsteroidKitProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
  </WagmiConfig>
);

export { AsteroidKitProvider };
