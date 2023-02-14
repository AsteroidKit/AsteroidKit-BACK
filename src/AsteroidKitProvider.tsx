import {
  AsteroidKitSyncProvider,
  connectorsForWallets,
  createAuthenticationAdapter,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  useAsteroidKitSyncState,
} from 'asteroidkit-rk';
import {
  RainbowKitProviderProps,
  Theme,
} from 'asteroidkit-rk/dist/components/RainbowKitProvider/RainbowKitProvider';
import React, { FC, useEffect, useState } from 'react';
import { Chain, configureChains, useClient } from 'wagmi';

import { ModalSizes } from 'asteroidkit-rk/dist/components/RainbowKitProvider/ModalSizeContext';
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from 'asteroidkit-rk/wallets';
import { SiweMessage } from 'siwe';
import {
  avalanche,
  avalancheFuji,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  goerli,
  mainnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  GoogleConnector,
  TwitchConnector,
} from './connectors/social/connector';
import { fetchFromServers } from './lib/fetcher';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type AsteroidKitProviderProps = Optional<
  RainbowKitProviderProps,
  'chains'
>;

interface AsteroidKitConfiguration {
  chains: Chain[];
  siwe: boolean;
  size: string;
  social: boolean;
  theme: object;
  wallets: string[];
}

const mapChainNameToWAGMIChain = (chains: string[]): Chain[] =>
  chains.map((chain) => {
    switch (chain) {
      case 'mainnet':
        return mainnet;
      case 'optimism':
        return optimism;
      case 'avalanche':
        return avalanche;
      case 'polygon':
        return polygon;
      case 'polygonMumbai':
        return polygonMumbai;
      case 'avalancheFuji':
        return avalancheFuji;
      case 'goerli':
        return goerli;
      case 'optimismGoerli':
        return optimismGoerli;
      default:
        throw new Error('Chain not supported');
    }
  });

const mapWalletNameToRainbowKitWallet = (
  walletList: string[] = [],
  chainsList: Chain[] = []
) => {
  const { chains } = configureChains(chainsList, [publicProvider()]);

  return walletList.map((walletName) => {
    switch (walletName) {
      case 'metamask':
        return metaMaskWallet({ chains, shimDisconnect: true });
      case 'coinbase':
        return coinbaseWallet({ appName: 'AsteroidKit', chains });
      case 'ledgerlive':
        return ledgerWallet({ chains });
      case 'trust':
        return trustWallet({ chains });
      case 'argent':
        return argentWallet({ chains });
      case 'walletconnect':
        return walletConnectWallet({ chains });
      default:
        throw new Error('Wallet not supported');
    }
  });
};

const mapThemeNameToRainbowKitTheme = (
  themeName: string,
  accentColor: string,
  accentColorForeground: string
): object => {
  const t256noir = {
    blurs: {
      modalOverlay: 'blur(0px)',
    },
    fonts: {
      body: 'SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    radii: {
      actionButton: '9999px',
      connectButton: '12px',
      menuButton: '12px',
      modal: '24px',
      modalMobile: '28px',
    },
    colors: {
      accentColor,
      // accentColor: '#3898FF',
      accentColorForeground,
      actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
      actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
      actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
      closeButton: 'rgba(224, 232, 255, 0.6)',
      closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
      connectButtonBackground: '#1A1B1F',
      connectButtonBackgroundError: '#FF494A',
      connectButtonInnerBackground:
        'linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))',
      connectButtonText: '#FFF',
      connectButtonTextError: '#FFF',
      connectionIndicator: '#30E000',
      downloadBottomCardBackground:
        'linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F',
      downloadTopCardBackground:
        'linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F',
      error: '#FF494A',
      generalBorder: 'rgba(255, 255, 255, 0.08)',
      generalBorderDim: 'rgba(255, 255, 255, 0.04)',
      menuItemBackground: 'rgba(224, 232, 255, 0.1)',
      modalBackdrop: 'rgba(0, 0, 0, 0.5)',
      modalBackground: '#1A1B1F',
      modalBorder: 'rgba(255, 255, 255, 0.08)',
      modalText: '#FFF',
      modalTextDim: 'rgba(224, 232, 255, 0.3)',
      modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
      profileAction: 'rgba(224, 232, 255, 0.1)',
      profileActionHover: 'rgba(224, 232, 255, 0.2)',
      profileForeground: 'rgba(224, 232, 255, 0.05)',
      selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
      standby: '#FFD641',
    },
    shadows: {
      connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
      profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
      selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
      selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.24)',
      walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
    },
  };

  const tdefault = {
    blurs: {
      modalOverlay: 'blur(0px)',
    },
    fonts: {
      body: 'SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    radii: {
      actionButton: '9999px',
      connectButton: '12px',
      menuButton: '12px',
      modal: '24px',
      modalMobile: '28px',
    },
    colors: {
      accentColor,
      // accentColor: '#0E76FD',
      accentColorForeground,
      actionButtonBorder: 'rgba(0, 0, 0, 0.04)',
      actionButtonBorderMobile: 'rgba(0, 0, 0, 0.06)',
      actionButtonSecondaryBackground: 'rgba(0, 0, 0, 0.06)',
      closeButton: 'rgba(60, 66, 66, 0.8)',
      closeButtonBackground: 'rgba(0, 0, 0, 0.06)',
      connectButtonBackground: '#FFF',
      connectButtonBackgroundError: '#FF494A',
      connectButtonInnerBackground:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
      connectButtonText: '#25292E',
      connectButtonTextError: '#FFF',
      connectionIndicator: '#30E000',
      downloadBottomCardBackground:
        'linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF',
      downloadTopCardBackground:
        'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF',
      error: '#FF494A',
      generalBorder: 'rgba(0, 0, 0, 0.06)',
      generalBorderDim: 'rgba(0, 0, 0, 0.03)',
      menuItemBackground: 'rgba(60, 66, 66, 0.1)',
      modalBackdrop: 'rgba(0, 0, 0, 0.3)',
      modalBackground: '#FFF',
      modalBorder: 'transparent',
      modalText: '#25292E',
      modalTextDim: 'rgba(60, 66, 66, 0.3)',
      modalTextSecondary: 'rgba(60, 66, 66, 0.6)',
      profileAction: '#FFF',
      profileActionHover: 'rgba(255, 255, 255, 0.5)',
      profileForeground: 'rgba(60, 66, 66, 0.06)',
      selectedOptionBorder: 'rgba(60, 66, 66, 0.1)',
      standby: '#FFD641',
    },
    shadows: {
      connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
      profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
      selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
      selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
      walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
    },
  };

  const teverforest = {
    blurs: {
      modalOverlay: 'blur(50px)',
    },
    fonts: {
      body: 'SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    radii: {
      actionButton: '9999px',
      connectButton: '12px',
      menuButton: '12px',
      modal: '25px',
      modalMobile: '28px',
    },
    colors: {
      accentColor,
      // accentColor: '#00ff2a',
      accentColorForeground,
      actionButtonBorder: 'rgba(0, 0, 0, 0.04)',
      actionButtonBorderMobile: 'rgba(0, 0, 0, 0.06)',
      actionButtonSecondaryBackground: 'rgba(0, 0, 0, 0.06)',
      closeButton: '#575757',
      closeButtonBackground: '#D3D6D8',
      connectButtonBackground: '#2F383E',
      connectButtonBackgroundError: '#FF494A',
      connectButtonInnerBackground:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
      connectButtonText: accentColorForeground,
      connectButtonTextError: '#FFF',
      connectionIndicator: '#30E000',
      downloadBottomCardBackground:
        'linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF',
      downloadTopCardBackground:
        'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF',
      error: '#FF494A',
      generalBorder: '#404C51',
      generalBorderDim: 'red',
      menuItemBackground: '#404C51',
      modalBackdrop: 'rgba(0, 0, 0, 0.3)',
      modalBackground: '#2F383E',
      modalBorder: 'transparent',
      modalText: '#FFFFFF',
      modalTextDim: '#FFFFFF',
      modalTextSecondary: 'rgba(255,255, 255, 0.6)',
      profileAction: 'rgb(60, 66, 66)',
      profileActionHover: '#313232a6',
      profileForeground: 'rgba(60, 66, 66, 0.06)',
      selectedOptionBorder: 'rgba(60, 66, 66, 0.1)',
      standby: '#FFD641',
    },
    shadows: {
      connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
      profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
      selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
      selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
      walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
    },
  };

  switch (themeName) {
    case '256noir':
      return t256noir;
    case 'everforest':
      return teverforest;
    default:
      return tdefault;
  }
};

const AsteroidKitConfigurationProvider = ({
  appId,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chains: chainsFromUser,
  initialChain,
  id,
  theme,
  appInfo,
  showRecentTransactions,
  coolMode,
  avatar,
  modalSize,
}: AsteroidKitProviderProps & { appId: string }) => {
  const [configuration, setConfiguration] = useState({
    chains: [],
    siwe: false,
    social: false,
    wallets: [],
    theme: lightTheme(),
    size: 'compact',
  } as AsteroidKitConfiguration);

  const { setValue, setReady } = useAsteroidKitSyncState();

  // load data
  useEffect(() => {
    fetchFromServers(appId)
      .then((data) => {
        setConfiguration({
          chains: mapChainNameToWAGMIChain(data.chains), // Todo: better analyse how to deal with migration.
          siwe: data.siwe,
          social: data.social,
          wallets: data.wallets, // Todo: better analyse how to deal with migration.
          theme:
            theme ??
            (mapThemeNameToRainbowKitTheme(
              data.themeId,
              data.accentColor,
              data.accentForegroundColor
            ) as object),
          size: data.compact ? 'compact' : 'default',
        });

        const wagmiChains = mapChainNameToWAGMIChain(data.chains);
        const defaultWallets = mapWalletNameToRainbowKitWallet(
          data.wallets,
          wagmiChains
        );

        const walletGroups = [
          {
            groupName: 'Popular', // We can keep it hardcoded for now.
            wallets: defaultWallets,
          },
        ];

        if (data.social) {
          walletGroups.push({
            groupName: 'Social',
            wallets: [
              GoogleConnector({ chains: wagmiChains }),
              TwitchConnector({ chains: wagmiChains }),
            ],
          });
        }

        const connectors = connectorsForWallets(walletGroups);

        setValue(connectors);
        setReady(true);
      })
      .catch((error) => {
        throw new Error(
          `Unable to load AstereoidKit configuration. Reason: ${error}`
        );
      })
      .finally(() => {});
  }, []);

  // This feature is implemented to allow the same behaviour we have with RainbowKit props.
  useEffect(() => {
    if (theme) {
      setConfiguration({
        ...configuration,
        theme,
      });
    }
  }, [theme]);

  // Set authentication adapter
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
      enabled={configuration.siwe}
      adapter={authenticationAdapter}
      status={AUTHENTICATION_STATUS as any}
    >
      <RainbowKitProvider
        appInfo={appInfo}
        chains={configuration.chains}
        theme={configuration.theme as Theme}
        initialChain={initialChain}
        id={id}
        modalSize={modalSize ?? (configuration.size as ModalSizes)}
        showRecentTransactions={showRecentTransactions}
        coolMode={coolMode}
        avatar={avatar}
      >
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
};

const AsteroidKitProvider: FC<AsteroidKitProviderProps & { appId: string }> = ({
  appId,
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
  // const dummyClickHappenedRef = useRef(false);

  const chainsFromClient = client.chains;
  const chains = chainsFromClient ?? chainsFromUser;

  // function handleSubtreeModified() {
  //   const googleButton = document.querySelectorAll(
  //     '[data-testid~="rk-wallet-option-openlogin_google"]'
  //   )[0] as HTMLButtonElement;

  //   // rk-wallet-option-openlogin_twitch
  //   const twitchButton = document.querySelectorAll(
  //     '[data-testid~="rk-wallet-option-openlogin_twitch"]'
  //   )[0] as HTMLButtonElement;

  //   if ((!!googleButton || !!twitchButton) && !dummyClickHappenedRef.current) {
  //     // Same check made on Rainbowkit
  //     if (isMobile()) {
  //       // Real check to be sure if we're REALLY not using mobile browser emulator
  //       if (window.navigator.maxTouchPoints > 1) {
  //         console.info('clicking on social providers');
  //         setTimeout(() => {
  //           googleButton?.click();
  //           twitchButton?.click();
  //         }, 100);
  //         dummyClickHappenedRef.current = true;
  //       }
  //     }
  //   }

  //   // if (!googleButton) {
  //   //   dummyClickHappenedRef.current = false;
  //   // }
  // }

  // useEffect(() => {
  //   document.addEventListener('DOMSubtreeModified', handleSubtreeModified);

  //   return () =>
  //     document.removeEventListener('DOMSubtreeModified', handleSubtreeModified);
  // }, []);

  return (
    <AsteroidKitSyncProvider>
      <AsteroidKitConfigurationProvider
        appId={appId}
        chains={chains}
        initialChain={initialChain}
        id={id}
        theme={theme}
        appInfo={appInfo}
        showRecentTransactions={showRecentTransactions}
        coolMode={coolMode}
        avatar={avatar}
        modalSize={modalSize}
      >
        {children}
      </AsteroidKitConfigurationProvider>
    </AsteroidKitSyncProvider>
  );
};

export { AsteroidKitProvider };
