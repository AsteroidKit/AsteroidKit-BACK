import SocialConnector from './SocialConnector';

export const rainbowSocialConnector = ({ chains }: any) => ({
  id: 'openlogin_google',
  name: 'Web3Auth Google',
  iconUrl: 'https://alpha.everipedia.org/images/magiclink.svg',
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
