import React, { FC, useState } from 'react';

import {
  AvatarComponent,
  connectorsForWallets,
  createAuthenticationAdapter,
  DisclaimerComponent,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitChain } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext';
import { ModalSizes } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/ModalSizeContext';
import { SiweMessage } from 'siwe';
import {
  TwitchConnector,
  GoogleConnector,
} from './connectors/social/connector';

type Config = {
  enableSiwe?: boolean;
  enableSocial?: boolean;
};

interface AsteroidKitProviderProps {
  appId: string;
  config?: Config;
  wallets: any;
}

interface LightRainbowKitProviderProps {
  appInfo?: {
    appName?: string;
    disclaimer?: DisclaimerComponent;
    learnMoreUrl?: string;
  };
  avatar?: AvatarComponent;
  chains?: RainbowKitChain[];
  children: React.ReactNode;
  coolMode?: boolean;
  id?: string;
  initialChain?: RainbowKitChain | number;
  modalSize?: ModalSizes;
  showRecentTransactions?: boolean;
  theme?: Theme | null;
}

const AsteroidKitProvider: FC<
  AsteroidKitProviderProps & LightRainbowKitProviderProps
> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appId,
  children,
  config,
  chains,
  initialChain,
  id,
  theme,
  appInfo,
  showRecentTransactions,
  coolMode,
  avatar,
  modalSize,
  wallets,
}) => {
  const { chains: _chains, provider } = configureChains(
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

  const walletList = [
    {
      groupName: 'Popular',
      wallets: wallets
        .filter((wallet: any) => wallet.enabled)
        .map((wallet: any) => wallet.connector),
    },
  ];

  if (config?.enableSocial) {
    walletList.push({
      groupName: 'Social',
      wallets: [
        GoogleConnector({ chains: _chains }),
        TwitchConnector({ chains: _chains }),
      ],
    });
  }

  const connectors = connectorsForWallets(walletList);

  const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
  });

  const [AUTHENTICATION_STATUS, setAuthenticationStatus] =
    useState('unauthenticated');
  const baseUrl = 'https://auth.asteroidkit.com'; // The address of our backend

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch(`${baseUrl}/nonce`, {
        credentials: 'include',
      });
      return response.text();
    },

    createMessage: ({ nonce, address, chainId }) =>
      new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      }),

    getMessageBody: ({ message }) => message.prepareMessage(),

    verify: async ({ message, signature }) => {
      setAuthenticationStatus('authenticating');

      const verifyRes = await fetch(`${baseUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
        credentials: 'include',
      });

      if (verifyRes.ok) {
        setAuthenticationStatus('authenticated');
      } else {
        setAuthenticationStatus('unauthenticated');
      }

      return Boolean(verifyRes.ok);
    },

    signOut: async () => {
      await fetch(`${baseUrl}/logout`);
    },
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        enabled={(config && config.enableSiwe) ?? false}
        adapter={authenticationAdapter}
        status={AUTHENTICATION_STATUS as any}
      >
        <RainbowKitProvider
          appInfo={appInfo}
          theme={theme}
          initialChain={initialChain}
          id={id}
          modalSize={modalSize}
          chains={chains ?? _chains}
          showRecentTransactions={showRecentTransactions}
          coolMode={coolMode}
          avatar={avatar}
        >
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
};

export { AsteroidKitProvider };
