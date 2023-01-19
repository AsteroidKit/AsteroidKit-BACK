import { AsteroidKitProvider, ConnectButton, createClient } from 'asteroidkit';
import { WagmiConfig } from 'wagmi';

import './App.css';

const client = createClient({
  appId: 'YOUR_APP_ID',
  social: true,
  wallets: [
    { name: 'metamask', enabled: true },
    { name: 'coinbase', enabled: true },
    { name: 'ledger', enabled: true },
    { name: 'argent', enabled: false },
  ],
});

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider
          config={{
            enableSiwe: true,
            enableSocial: true,
          }}
        >
          <ConnectButton />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
