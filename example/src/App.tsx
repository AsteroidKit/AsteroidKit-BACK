import { AsteroidKitProvider, ConnectButton, createClient } from 'asteroidkit';
import 'asteroidkit/styles.css';
import { WagmiConfig } from 'wagmi';

import './App.css';

const client = createClient();

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider appId="testapp">
          <ConnectButton />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
