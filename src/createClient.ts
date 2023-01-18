import {
  connectorsForWallets,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { mainnet, polygon } from 'wagmi/chains';

import { configureChains, createClient as wagmiCreateClient } from 'wagmi';
import {
  TwitchConnector,
  GoogleConnector,
} from './connectors/social/connector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createClient = ({ appId }: { appId: string }) => {
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

  const wagmiClient = wagmiCreateClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return wagmiClient;
};
