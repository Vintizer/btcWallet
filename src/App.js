import React, { Component } from 'react';
import Info from './components/info';
import KeyWallet from './components/keyWallet';
import Balance from './components/balance';
import Sender from './components/sender';
import bitcoin from "bitcoinjs-lib";
import CONST from "./constants/const.json";
import './App.css';
import axios from "axios";
import bip39 from "bip39";
import BigInteger from "bigi";
var Mnemonic = require('bitcore-mnemonic');

// Адрес кошелька: n3SLphtGp3GwrTsLC2ZFH6XH3sHtixvziH 
// Публичный ключ: 217013213619915422249847127520109904218256571481116785301751618624910810123678123 
// Приватный ключ: cS9NhbNJU3ArPKSGghMnvojxcSBr5jJbRjVV6u8qod8WbYC8uLvi 





const ip = CONST.ipLocal;
class App extends Component {
  constructor() {
    super();
    this.state = {
      "wallet": "",
      "publicKey": "",
      "privatKey": "",
      "balance": "",
      "unconfirmedBalance": "",
      "txId": "",
      "mnemonic": "",
      "receiveAddress": "",
      "userAddress": ""
    };
    this.generateAddress = this.generateAddress.bind(this);
    this.registerWIF = this.registerWIF.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.sendBTC = this.sendBTC.bind(this);
  }
  getMnemonic = () => {
    return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
  }

  generateAddress() {
    var network = bitcoin.networks[CONST.network];
    const seedFraze = this.getMnemonic();
    this.setState({
      "mnemonic": seedFraze
    })
    var seed = bip39.mnemonicToSeed(seedFraze);

    var root = bitcoin.HDNode.fromSeedHex(seed, network);

    var external = root.derivePath("m/44'/1'/0'/0/0");
    var internal = root.derivePath("m/44'/1'/0'/1/0");


    // var that = this;
    // var network = bitcoin.networks[CONST.network];
    // var keyPair = bitcoin.ECPair.makeRandom({ network });

    // that.setState({
    //   "wallet": keyPair.getAddress(),
    //   "privatKey": keyPair.toWIF(),
    //   "publicKey": keyPair.getPublicKeyBuffer()
    // })
  };


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
      // console.log(e);
      inpArrAmount.push(e.satoshis);
      inpArrId.push(e.txid);
    });
    var sumAmount = 0;
    var txResArr = [];
    console.log("inpArrAmount")
    console.log(inpArrAmount)
    inpArrAmount.forEach((e, i) => {
      if (sumAmount < amountToSend) {
        sumAmount += e;
        txResArr.push(inpArrId[i]);
      }
    })

    var tx = new bitcoin.TransactionBuilder(network);
    console.log(txResArr);
    txResArr.forEach((e) => {
      tx.addInput(e, 0);
    })
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
            mnemonic={this.state.mnemonic}
            receiveAddress={this.state.receiveAddress}
            userAddress={this.state.userAddress}
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


const createHDChain = () => {
  var d = BigInteger.ONE
  console.log(d);
  const keyPair = new bitcoin.ECPair(d, null);

  const chainCode = Buffer.alloc(32, 1);
  console.log(chainCode);
  var hd = new bitcoin.HDNode.makeRandom();
  console.log(hd.getAddress());
};
window.createHDChain = createHDChain;

const fromSeed = () => {
  var network = bitcoin.networks[CONST.network];
  const seed = "a3580f8f87e6b59b80df424d63e137ff884866d8866737d3ef8a8b149bfe9749f88876e3366e7409831067239be2667eed60d70f3a3818756baf9444350a3bba";

  var root = bitcoin.HDNode.fromSeedHex(seed, network);

  var child = root.derivePath("m/44'/1'/0'/0/0");
  var child2 = root.derivePath("m/0'/0/1");
  console.log('child');
  console.log(child.getAddress());
  console.log(child2.getAddress());
}

window.fromSeed = fromSeed;

const fromMnemonic = () => {
  var network = bitcoin.networks[CONST.network];
  const seedFraze = "yard impulse luxury drive today throw farm pepper survey wreck glass federal";
  var seed = bip39.mnemonicToSeed(seedFraze);
  var root = bitcoin.HDNode.fromSeedHex(seed, network);
  var child = root.derivePath("m/44'/1'/0'/0/0");
  var child2 = root.derivePath("m/0'/0/1");
  console.log('child');
  console.log(child.getAddress());
  console.log(child2.getAddress());

}
window.fromMnemonic = fromMnemonic;