/* eslint-disable */
import { Address, Connector } from '@wagmi/core';
import { ethers } from 'ethers';

import { Web3AuthCore } from '@web3auth/core';
import { CHAIN_NAMESPACES, ADAPTER_EVENTS } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

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

const web3authCore = new Web3AuthCore({
  clientId:
    'BGKoZEAe6OaeD4dmzcofTXhKG813VVsVjbMHtxMF7BKRuSZyYClEBrbdmm7SS52dmLUbsQNhHrw-WJvLnzH7rzY',
  chainConfig,
});

const adapter = new OpenloginAdapter({
  adapterSettings: {
    network: 'testnet',
    clientId:
      'BGKoZEAe6OaeD4dmzcofTXhKG813VVsVjbMHtxMF7BKRuSZyYClEBrbdmm7SS52dmLUbsQNhHrw-WJvLnzH7rzY',
    uxMode: 'popup', // other option: popup
    storageKey: 'local',
    loginConfig: {
      google: {
        name: 'any name',
        verifier: 'poc-google-testnet',
        typeOfLogin: 'google',
        clientId:
          '52560353044-dru4anqjptro5ssbsha1tosq222gfcpa.apps.googleusercontent.com',
      },
    },
  },
});

function subscribeAuthEvents(web3auth: any) {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data: any) => {
    console.log('connected');
    console.log(data);

    // let provider = new ethers.providers.Web3Provider(web3auth.provider);
    // let signer = await provider.getSigner();
    // let address = await signer.getAddress();

    // console.log(provider);

    // setProvider(provider);
    // setAddress(address);
    // let signer = e.getSigner();
    // alert(signer.getAddress());
    // let address = await e.getAddress();
    // alert(address);
    // setIsConnected(true);
    // setIsConnecting(false);
  });

  web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    // setIsConnecting(true);
    console.log('connecting');
  });

  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
    // setIsConnected(false);
    console.log('disconnected');
    // setAddress(null);
    // setProvider(null);
  });

  web3auth.on(ADAPTER_EVENTS.ERRORED, (error: any) => {
    console.log('errored');
    console.error(error);
    // setIsConnecting(false);
  });
}

web3authCore.configureAdapter(adapter);
subscribeAuthEvents(web3authCore);

(async () => {
  await web3authCore.init();
})();

export default class SocialConnector extends Connector {
  id: string = 'google';
  name: string = 'Google';
  ready: boolean = true;
  provider: any;

  constructor(config: any) {
    super(config);
  }

  async connect(): Promise<any> {
    this.provider = await web3authCore.connectTo(adapter.name, {
      loginProvider: 'google',
    });

    const userInfo = await web3authCore.getUserInfo();
    console.log(userInfo);

    return {
      account: await this.getAccount(),
      chain: {
        id: 0,
        unsupported: false,
      },
      provider: this.getProvider(),
    };
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async getAccount(): Promise<Address> {
    if (!this.provider) return Promise.reject('No provider');
    const _provider = new ethers.providers.Web3Provider(this.provider);
    const _signer = _provider.getSigner();

    const address = ethers.utils.getAddress(await _signer.getAddress());

    return Promise.resolve(address);
  }
  getChainId(): Promise<number> {
    return Promise.resolve(0);
  }
  async getProvider(
    config?: { chainId?: number | undefined } | undefined
  ): Promise<any> {
    return this.provider;
  }
  getSigner(
    config?: { chainId?: number | undefined } | undefined
  ): Promise<any> {
    if (!this.provider) return Promise.reject('No provider');
    const _provider = new ethers.providers.Web3Provider(this.provider);
    const _signer = _provider.getSigner();
    return Promise.resolve(_signer);
  }
  isAuthorized(): Promise<boolean> {
    return Promise.resolve(false);
  }
  protected onAccountsChanged(accounts: Address[]): void {
    throw new Error('Method not implemented.');
  }
  protected onChainChanged(chain: string | number): void {
    throw new Error('Method not implemented.');
  }
  protected onDisconnect(error: Error): void {
    throw new Error('Method not implemented.');
  }
}
