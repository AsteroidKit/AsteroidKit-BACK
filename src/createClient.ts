import { connectorsForWallets, WalletList } from 'asteroidkit-rk';

import { metaMaskWallet } from 'asteroidkit-rk/wallets';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import {
  avalanche,
  avalancheFuji,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  goerli,
} from 'wagmi/chains';

import { configureChains, createClient as wagmiCreateClient } from 'wagmi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createClient = () => {
  const { chains, provider } = configureChains(
    [
      mainnet,
      optimism,
      avalanche,
      polygon,
      polygonMumbai,
      goerli,
      avalancheFuji,
      optimismGoerli,
    ],
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
      wallets: [metaMaskWallet({ chains, shimDisconnect: true })],
    },
  ];

  const connectors = connectorsForWallets(walletList);

  const wagmiClient = wagmiCreateClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return wagmiClient;
};
