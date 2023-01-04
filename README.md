# AsteroidKit

**AsteroidsKit** is a platform/SDK built on top of Rainbowkit. It adds super-powers to _Rainbowkit_ + _Wagmi_ by allowing users to make configurations directly on UI. It is an opinionated library, so mostly of the boilerplate required by _Rainbowkit_ becomes transparent.

You also do not need to go through the pain of understanding the setup of _Wagmi_. Everything is handled by us.

## Getting started

In order to get started, everything that you need to do is:

1. add **asteroidskit** dependency
2. create an App on our platform [Link to platform]
3. wrap the code with the **AsteroidKitProvider**

   ```tsx
   import { AsteroidKitProvider } from "asteroidkit";

   <AsteroidsKitProvider appId="...">
       {Your code}
   </AsteroidsKitProvider>
   ```

4. You're all set to use all hooks, components, etc

**AsteroidsKit** also exposes everything from Rainbowkit and Wagmi, so you have access by doing
import { rainbowkit, wagmi } from "asteroidkit";

```tsx
import { rainbowkit, wagmi } from 'asteroidkit';

const YourComponent = () => {
  const account = wagmi.useAccount();

  return (
    <div>
      <div>{account?.address}</div>
      <rainbowkit.ConnectButton />
    </div>
  );
};
```
