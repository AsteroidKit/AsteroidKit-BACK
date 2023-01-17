import { Wallet } from '@rainbow-me/rainbowkit';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { GenericSocialConnector } from './GenericSocialConnector';
import { OpenLoginAdapterConfig } from './OpenLoginAdapterConfig';

const chainConfig = {
  // this is ethereum chain config, change if other chain(Solana, Polygon)
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x1',
  rpcTarget:
    'https://eth-mainnet.g.alchemy.com/v2/oZsv-F9NN3NhersEryE56jM08jomw0Ya',
  blockExplorer: 'https://etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

const web3AuthInstance = new Web3AuthCore({
  clientId:
    'BGKoZEAe6OaeD4dmzcofTXhKG813VVsVjbMHtxMF7BKRuSZyYClEBrbdmm7SS52dmLUbsQNhHrw-WJvLnzH7rzY',
  chainConfig,
});

web3AuthInstance.configureAdapter(new OpenloginAdapter(OpenLoginAdapterConfig));

export const GoogleConnector = ({ chains }: any): Wallet => ({
  id: 'openlogin_google',
  name: 'Google',
  iconUrl:
    'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png',
  iconBackground: '#fff',
  createConnector: () => {
    const connector = new GenericSocialConnector({
      chains,
      options: {
        socialProviderName: 'google',
        web3AuthInstance,
      },
    });
    return {
      connector,
    };
  },
});

export const TwitchConnector = ({ chains }: any): Wallet => ({
  id: 'openlogin_twitch',
  name: 'Twitch',
  iconUrl: '',
  iconBackground: '#000000',

  createConnector: () => {
    const connector = new GenericSocialConnector({
      chains,
      options: {
        socialProviderName: 'twitch',
        web3AuthInstance,
      },
    });

    return { connector };
  },
});
