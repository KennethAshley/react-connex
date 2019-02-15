# react-connex

Simple higher-order component (HOC) providing a Connex context to React app.

Detects whether the user is using Sync or a Comet wallet-enabled browser.

## Installation
```sh
$ yarn add react-connex
```

## Basic Usage
Add the `ConnexProvider to your root React Component;
```js
import ConnexProvider from 'react-connex';

<ConnexProvider
  loading="Loading..."
  error={err => `Connection error: ${err}`}>
  <App />
</ConnexProvider>
```

Then in the component where you want to use Connex:
```js
import { withConnex } from 'react-connex';

class MyComponent {
  render() {
    const { connex } = this.props;
    const status = connex.thor.status;

    return status.progress;
  }
}

export default withConnex(MyComponent);
```

You can use the injected `getNetwork` property to get network details:
```js
import { withConnex } from 'react-connex';

class MyComponent {
  render() {
    const { getNetwork } = this.props;
    getNetwork().then(network => {
      return `${network.id} and ${network.name}`
    });
  }
}

export default withConnex(MyComponent);
```
