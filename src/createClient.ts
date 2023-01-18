import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit';

import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { mainnet, polygon } from 'wagmi/chains';

import { configureChains, createClient as wagmiCreateClient } from 'wagmi';
import {
  TwitchConnector,
  GoogleConnector,
} from './connectors/social/connector';

const getConnectorFromName = ({ chains, name }: any) => {
  if (name === 'metamask') {
    return metaMaskWallet({ chains });
  }

  if (name === 'coinbase') {
    return coinbaseWallet({ appName: 'Demo App', chains });
  }

  if (name === 'ledger') {
    return ledgerWallet({ chains });
  }

  if (name === 'argent') {
    return argentWallet({ chains });
  }

  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createClient = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appId,
  social,
  wallets,
}: {
  appId: string;
  social: boolean;
  wallets: any;
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
      wallets: wallets.map((wallet: any) =>
        getConnectorFromName({ chains, name: wallet.name })
      ),
    },
  ];

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
