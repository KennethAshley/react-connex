import React from 'react';
import { hexToBytes } from 'web3-utils';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

const ConnexContext = React.createContext(null);

class ConnexProvider extends React.Component {
  static getNetwork(networkId) {
    switch (networkId) {
      case 74:
        return 'mainnet';
        case 39:
        return 'testnet';
        case 199:
        return 'localhost';
      default:
        return 'unknown';
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      connex: null,
      cert: null,
      network: {
        name: null,
        id: null,
      },
      connection: {
        isLoading: true,
        error: null,
      }
    };

    this.getConnex = this.getConnex.bind(this);
    this.authorize = this.authorize.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
  }

  async componentDidMount() {
    const { auth } = this.props;

    try {
      const connex = await this.getConnex();
      this.setState({
        connex,
        connection: {
          isLoading: false,
        }
      }, () => {
        if (auth) {
          this.authorize();
        }
      })
    } catch(error) {
      this.setState({
        connection: {
          error,
          isLoading: false,
        }
      });
    }
  }

  async authorize() {
    const { connex } = window;
    const { auth } = this.props;
    const request = {
      purpose: 'identification',
      payload: {
          type: 'text',
          content: auth,
      },
    };

    const cert = await connex.vendor.sign('cert').request(request);

    this.setState({ cert });
  }

  getConnex() {
    return new Promise((resolve, reject) => {
      if (typeof window.connex !== 'undefined') {
        resolve(window.connex);
      } else {
        reject('connex is not found');
      }
    })
  }

  async getNetwork() {
    const { connex } = this.state;
    const block = await connex.thor.block(0).get();
    const networkId = hexToBytes(block.id).pop();

    return {
      id: networkId,
      name: ConnexProvider.getNetwork(networkId),
    }
  }

  render() {
    const { cert, connection, connex } = this.state;
    const { loading, error } = this.props;

    if (loading && connection.isLoading) {
      return loading;
    } else if (error && connection.error) {
      return error(connection.error);
    }

    return (
      <ConnexContext.Provider
        value={{
          connex,
          cert,
          getNetwork: this.getNetwork,
        }}
      >
        { this.props.children }
      </ConnexContext.Provider>
    )
  }
}

ConnexProvider.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.node,
  error: PropTypes.func,
  auth: PropTypes.node,
};

export default ConnexProvider;

export const withConnex = (WrappedComponent) => {
  class ConnexConsumer extends React.Component {
    render() {
      return (
        <ConnexContext.Consumer>
          {(context) => (
            <WrappedComponent
              {...this.props}
              connex={context.connex}
              cert={context.cert}
              getNetwork={context.getNetwork}
            />
          )}
        </ConnexContext.Consumer>
      )
    }
  }

  if (WrappedComponent.defaultProps) {
    ConnexConsumer.defaultProps = {...WrappedComponent.defaultProps}
  }

  return hoistNonReactStatics(ConnexConsumer, WrappedComponent);
}
