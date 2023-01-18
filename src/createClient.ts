import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit';

import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appId,
  social,
}: {
  appId: string;
  social: boolean;
}) => {
  const { chains, provider } = configureChains(
    [mainnet, polygon],
    [
      alchemyProvider({
        // This is Alchemy's default API key.
        // You can get your own at https://dashboard.alchemyapi.io
        apiKey: 'oZsv-F9NN3NhersEryE56jM08jomw0Ya',
      }),
      publicProvider(),
    ]
  );

  const walletList: WalletList = [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet({ chains }), walletConnectWallet({ chains })],
    },
  ];

  /**
   * Should we add social connectors by default?
   * Should we have a way to enable by code?
   */
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
