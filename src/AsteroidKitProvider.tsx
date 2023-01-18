import React, { FC } from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitProviderProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider';
import { useClient } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type AsteroidKitProviderProps = Optional<
  RainbowKitProviderProps,
  'chains'
>;

const AsteroidKitProvider: FC<AsteroidKitProviderProps> = ({
  children,
  chains: chainsFromUser,
}) => {
  const client = useClient();

  const chainsFromClient = client.chains;
  const chains = chainsFromClient ?? chainsFromUser;

  return (
    <RainbowKitProvider chains={chains ?? []}>{children}</RainbowKitProvider>
  );
};

export { AsteroidKitProvider };
