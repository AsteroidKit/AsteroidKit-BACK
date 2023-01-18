import { AsteroidKitProvider, ConnectButton, createClient } from 'asteroidkit';
import { WagmiConfig } from 'wagmi';

import './App.css';

function App() {
  const client = createClient({ appId: 'YOUR_APP_ID' });

  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider>
          <ConnectButton />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
