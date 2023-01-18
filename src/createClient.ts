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
export const createClient = ({
  appId,
  social,
  wallets,
}: {
  appId: string;
  social: boolean;
  wallets?: any;
}) => {
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

  const walletList = [];

  if (!wallets) {
    walletList.push({
      groupName: 'Popular',
      wallets: getDefaultWallets({ appName: appId, chains }).wallets,
    });
  } else {
    walletList.push({
      groupName: 'Popular',
      wallets: wallets
        .filter((wallet: any) => wallet.enabled)
        .map((wallet: any) => wallet.connector),
    });
  }

  if (social) {
    walletList.push({
      groupName: 'Social',
      wallets: [GoogleConnector({ chains }), TwitchConnector({ chains })],
    });
  }

  const connectors = connectorsForWallets(walletList);

  const wagmiClient = wagmiCreateClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return wagmiClient;
};
