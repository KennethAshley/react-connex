import React, { Component } from 'react';
import { withConnex } from "./lib";

const wrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const contentStyles = {
  textAlign: 'center'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state ={
      network: {}
    };
  }

  async componentDidMount() {
    const network = await this.props.getNetwork();
    this.setState({ network });
  }

  render() { 
    const { network } = this.state;

    return (
      <div style={wrapperStyles}>
        { (network.id && network.name) &&
          <div style={contentStyles}>
            <div>Your Connected!</div>
            <div>Network Name: {network.name}</div>
            <div>Network Id: {network.id}</div>
          </div>
        }
      </div>
    );
  }
}

export default withConnex(App);
