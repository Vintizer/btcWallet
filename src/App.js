import React, { Component } from 'react';
import Info from './components/info';
import KeyWallet from './components/keyWallet';
import Balance from './components/balance';
import Sender from './components/sender';
import bitcoin from "bitcoinjs-lib";
import CONST from "./constants/const.json";
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      "wallet": "",
      "publicKey": "",
      "privatKey": ""
    };
    this.generateAddress = this.generateAddress.bind(this);
  }
  generateAddress(address) {
    var that = this;
    console.log(CONST.network);
    var network = bitcoin.networks[CONST.network];
    var keyPair = bitcoin.ECPair.makeRandom({network});
    
    that.setState({
      "wallet": keyPair.getAddress(),
      "privatKey": keyPair.toWIF(),
      "publicKey": keyPair.getPublicKeyBuffer()
    })
  }
  render() {
    return (
      <div>
        <div className="info">
          <Info
            wallet={this.state.wallet}
            publicKey={this.state.publicKey}
            privatKey={this.state.privatKey}
          />
        </div>
        <div className="keyWallet">
          <KeyWallet
            generateAddress={this.generateAddress}
            wallet={this.state.wallet}
            publicKey={this.state.publicKey}
            privatKey={this.state.privatKey}
          />
        </div>
        <div className="balance">
          <Balance />
        </div>
        <div className="sender">
          <Sender />
        </div>
      </div>
    );
  }
}

export default App;
