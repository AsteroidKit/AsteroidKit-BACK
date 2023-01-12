import { Wallet } from '@rainbow-me/rainbowkit';
import { SocialConnector } from './SocialConnector';

export const GoogleConnector = ({ chains }: any): Wallet => ({
  id: 'openlogin_google',
  name: 'Google',
  iconUrl: '',
  iconBackground: '#fff',
  createConnector: () => {
    const connector = new SocialConnector({
      chains,
      options: {
        apiKey: 'pk_live_84269DD9404B05D8',
        oauthOptions: {
          providers: ['google'],
        },
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
    const connector = new SocialConnector({
      chains,
      options: {
        apiKey: 'pk_live_84269DD9404B05D8',
        oauthOptions: {
          providers: ['twitch'],
        },
      },
    });

    return { connector };
  },
});
