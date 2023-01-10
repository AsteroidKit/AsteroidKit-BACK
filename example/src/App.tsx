import { AsteroidKitProvider, rainbowkit } from 'asteroidkit';
import { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <AsteroidKitProvider>
        <rainbowkit.ConnectButton />
      </AsteroidKitProvider>
    </div>
  );
}

export default App;
