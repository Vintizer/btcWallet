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
      "privatKey": "",
      "balance": "",
      "unconfirmedBalance": ""
    };
    this.generateAddress = this.generateAddress.bind(this);
    this.registerWIF = this.registerWIF.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }
  generateAddress() {
    var that = this;
    var network = bitcoin.networks[CONST.network];
    var keyPair = bitcoin.ECPair.makeRandom({ network });

    that.setState({
      "wallet": keyPair.getAddress(),
      "privatKey": keyPair.toWIF(),
      "publicKey": keyPair.getPublicKeyBuffer()
    })
  }
  registerWIF() {
    var that = this;
    var network = bitcoin.networks[CONST.network];
    if (bitcoin.ECPair.fromWIF(document.getElementById('privat_key').value, network)) {
      var keyPair = bitcoin.ECPair.fromWIF(document.getElementById('privat_key').value, network);

      that.setState({
        "wallet": keyPair.getAddress(),
        "privatKey": keyPair.toWIF(),
        "publicKey": keyPair.getPublicKeyBuffer()
      })
    }
  }
  getBalance() {
    var stringRequestBalance = CONST.ip + "/api/addr/" + this.state.wallet + "/balance";
    var stringRequestUnconfirmedBalance = CONST.ip + "/api/addr/" + this.state.wallet + "/unconfirmedBalance";
    fetch(stringRequestBalance)
      .then((res) => {
        return res.json();
      }).then((val) => {
        this.setState({
          "balance": val + " balance"
        })
      })
    fetch(stringRequestUnconfirmedBalance)
      .then((res) => {
        return res.json();
      }).then((val) => {
        this.setState({
          "unconfirmedBalance": val + " unconfirmed balance"
        })
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
            registerWIF={this.registerWIF}
            generateAddress={this.generateAddress}
            privatKey={this.state.privatKey}
          />
        </div>
        <div className="balance">
          <Balance
            getBalance={this.getBalance}
            balance = {this.state.balance}
            unconfirmedBalance = {this.state.unconfirmedBalance}
          />
        </div>
        <div className="sender">
          <Sender />
        </div>
      </div>
    );
  }
}

export default App;
