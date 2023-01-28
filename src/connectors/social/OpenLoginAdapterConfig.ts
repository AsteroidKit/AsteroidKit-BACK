import { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';

export const OpenLoginAdapterConfig: OpenloginAdapterOptions = {
  adapterSettings: {
    network: 'cyan',
    clientId:
      'BOpE2QwLzG8lTiFOblI4-5Tv7dEuQ3--ZCVdNpmnC7DqMhsxdKpUaE2tF3IUizccy7_B4h04uEj6g5zpqYbRf9c',
    uxMode: 'popup', // other option: popup
    storageKey: 'local',
    loginConfig: {
      google: {
        name: 'Google',
        verifier: 'AsteroidKit Google',
        typeOfLogin: 'google',
        clientId:
          '52560353044-dru4anqjptro5ssbsha1tosq222gfcpa.apps.googleusercontent.com',
      },
      twitch: {
        name: 'Twitch',
        verifier: 'AsteroidKit Twich',
        typeOfLogin: 'twitch',
        clientId: '8bhn7spr5h1nwby5gdq14uza8qmonj',
      },
    },
  },
};
