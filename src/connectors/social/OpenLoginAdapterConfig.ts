import { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';

export const OpenLoginAdapterConfig: OpenloginAdapterOptions = {
  adapterSettings: {
    network: 'testnet',
    clientId:
      'BGKoZEAe6OaeD4dmzcofTXhKG813VVsVjbMHtxMF7BKRuSZyYClEBrbdmm7SS52dmLUbsQNhHrw-WJvLnzH7rzY',
    uxMode: 'popup', // other option: popup
    storageKey: 'local',
    loginConfig: {
      google: {
        name: 'Google',
        verifier: 'poc-google-testnet',
        typeOfLogin: 'google',
        clientId:
          '52560353044-dru4anqjptro5ssbsha1tosq222gfcpa.apps.googleusercontent.com',
      },
      twitch: {
        name: 'Twitch',
        verifier: 'poc-facebook-testnet',
        typeOfLogin: 'twitch',
        clientId: '8bhn7spr5h1nwby5gdq14uza8qmonj',
      },
    },
  },
};
