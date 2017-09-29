import React, { Component } from 'react';
import Info from './components/info';
import KeyWallet from './components/keyWallet';
import Balance from './components/balance';
import Sender from './components/sender';
import bitcoin from "bitcoinjs-lib";
import CONST from "./constants/const.json";
import './App.css';
import axios from "axios";

const ip = CONST.ipOut;
const getFee = () => {
  return 1000;
}
const baseAmount = () => {
  return 1500;
}
// const ip = CONST.ipLocal;
class App extends Component {
  constructor() {
    super();
    this.state = {
      "wallet": "",
      "publicKey": "",
      "privatKey": "",
      "balance": "",
      "unconfirmedBalance": "",
      "txId": ""
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
    var stringRequestBalance = ip + "/addr/" + this.state.wallet + "/balance";
    var stringRequestUnconfirmedBalance = ip + "/addr/" + this.state.wallet + "/unconfirmedBalance";
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
    var that = this;
    var network = bitcoin.networks[CONST.network];
    var inpArrAmount = [];
    var inpArrId = [];
    utxoArr.forEach((e) => {
      inpArrAmount.push(e.satoshis);
      inpArrId.push(e.txid);
    });
    var sumAmount = 0;
    var txResArr = [];
    console.log("inpArrAmount")
    console.log(inpArrAmount)
    inpArrAmount.forEach((e, i) => {
      if (sumAmount < amountToSend) {
        console.log(e);
        sumAmount += e;
        txResArr.push(inpArrId[i]);
      }
    })
    var tx = new bitcoin.TransactionBuilder(network);
    let refund;
    if (sumAmount - getFee() - amountToSend > baseAmount()) {
        refund = sumAmount - getFee() - amountToSend;
        console.log('refund',this.state.wallet);
        tx.addOutput(this.state.wallet, parseInt(refund));
    }
    console.log(txResArr);
    txResArr.forEach((e) => {
      tx.addInput(e, 0);
    })
    console.log('addressTo', addressTo);
    tx.addOutput(addressTo, parseFloat(amountToSend));
    var keyPair = bitcoin.ECPair.fromWIF(this.state.privatKey, network);
    tx.sign(0, keyPair);
    console.log(tx.build().toHex());
    const hexTxId = { "rawtx": tx.build().toHex() };
    axios.post(ip + "/tx/send", hexTxId)
      .then(function (response) {
          that.setState({
            "txId": response.data.txid
          })
        console.log("axios");
        console.log(response);
      })
    fetch(ip + "/tx/send", {
      method: 'post',
      body: hexTxId
    })
      .then((res) => {
        that.setState({
          "txId": res.statusText
        })
    // return res.json();
    })
    .then((val) => {
      console.log(val);
      this.state.txId = val;
    })
  }
  sendBTC() {
    var addressTo = document.getElementById('send_address').value;
    var amoutToSend = document.getElementById('send_BTC').value;
    var stringGetUtxo = ip + "/addr/" + this.state.wallet + "/utxo";
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
            txId={this.state.txId}
          />
        </div>
      </div>
    );
  }
}

export default App;
