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
    this.sendBTC = this.sendBTC.bind(this);
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
    var keyPair = bitcoin.ECPair.fromWIF(document.getElementById('privat_key').value, network);

    that.setState({
      "wallet": keyPair.getAddress(),
      "privatKey": keyPair.toWIF(),
      "publicKey": keyPair.getPublicKeyBuffer()
    })
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
  send(utxoArr, addressTo, amountToSend) {
    if (!amountToSend || !addressTo) {
      return;
    }
    var network = bitcoin.networks[CONST.network];
    var inpArrAmount = [];
    var inpArrId = [];
    utxoArr.forEach((e) => {
      inpArrAmount.push(e.satoshis);
      inpArrId.push(e.txid);
    });
    var sumAmount = 0;
    var txResArr = [];
    inpArrAmount.forEach((e, i) => {
      if (sumAmount < amountToSend) {
        sumAmount += e;
        txResArr.push(inpArrId[i]);
      }
    })

    var tx = new bitcoin.TransactionBuilder(network);
    txResArr.forEach((e) => {
      tx.addInput(e, 0);
    })
    // tx.addOutput(addressTo, amountToSend);
    // var keyPair = bitcoin.ECPair.fromWIF(this.state.privatKey, network);
    // tx.sign(0, keyPair);
    // console.log(tx.build().toHex());
    console.log(tx);
  }
  sendBTC() {
    var that = this;
    
    var addressTo = document.getElementById('send_address').value;
    var amoutToSend = document.getElementById('send_BTC').value;
    var stringGetUtxo = CONST.ip + "/api/addr/" + this.state.wallet + "/utxo";
    fetch(stringGetUtxo)
      .then((res) => {
        return res.json();
      }).then((val) => {
        this.send(val, addressTo, amoutToSend);
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
            balance={this.state.balance}
            unconfirmedBalance={this.state.unconfirmedBalance}
          />
        </div>
        <div className="sender">
          <Sender
            sendBTC={this.sendBTC}
          />
        </div>
      </div>
    );
  }
}

export default App;
