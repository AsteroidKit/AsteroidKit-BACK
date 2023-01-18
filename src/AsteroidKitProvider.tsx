import React, { FC, useState } from 'react';
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { RainbowKitProviderProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider';
import { useClient } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import { SiweMessage } from 'siwe';

type Config = {
  enableSiwe?: boolean;
  enableSocial?: boolean;
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type AsteroidKitProviderProps = Optional<
  RainbowKitProviderProps,
  'chains'
> & { config?: Config }; // TODO: probably remove wallets from final version

const AsteroidKitProvider: FC<AsteroidKitProviderProps> = ({
  config,
  children,
  chains: chainsFromUser,
  initialChain,
  id,
  theme,
  appInfo,
  showRecentTransactions,
  coolMode,
  avatar,
  modalSize,
}) => {
  const client = useClient();

  const chainsFromClient = client.chains;
  const chains = chainsFromClient ?? chainsFromUser;

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
    <RainbowKitAuthenticationProvider
      enabled={(config && config.enableSiwe) ?? false}
      adapter={authenticationAdapter}
      status={AUTHENTICATION_STATUS as any}
    >
      <RainbowKitProvider
        appInfo={appInfo}
        chains={chains ?? []}
        theme={theme}
        initialChain={initialChain}
        id={id}
        modalSize={modalSize}
        showRecentTransactions={showRecentTransactions}
        coolMode={coolMode}
        avatar={avatar}
      >
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
};

export { AsteroidKitProvider };
