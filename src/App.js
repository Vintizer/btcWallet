import React, { Component } from 'react';
import CONST from "./constants/const.json";
import jQuery from "jquery";
import lightTabsFunction from "./scripts/lightTabs";
import KeyWallet from "./components/keyWallet";
import Sender from "./components/sender";
import Info from "./components/info";
import bitcoin from "bitcoinjs-lib";
import bip39 from "bip39";
import Mnemonic from "bitcore-mnemonic";
import axios from "axios";
import getUtxo from "./scripts/getUtxo";
import getTransactionsModule from "./scripts/gettransactions";

const ip = CONST.ipOut;
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
      "receiveAddress": [],
      "sendAddress": [],
      "root": "",
      "lastReceiveAddress": 0,
      "lastSendAddress": 0,
      "transactions": [],
      "utxo": "",
      "countUtxo": 0,
      "newAddressReceive": ""
    };
    this.generateAddress = this.generateAddress.bind(this);
    this.registerMnemonic = this.registerMnemonic.bind(this);
    this.sendBTC = this.sendBTC.bind(this);
    this.generateReceiveAddress = this.generateReceiveAddress.bind(this);
    this.generateSendAddress = this.generateSendAddress.bind(this);
    this.getFullUtxo = this.getFullUtxo.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }
  isGoodAddress(address) {
    return true;
  }
  findFirstUnused() {
    const root = this.state.root;
    let addrAdd = 0;
    let answer;
    do {
      const pathDerive = "m/44'/1'/0'/0/" + addrAdd;
      const address = root.derivePath(pathDerive).getAddress();
      answer = this.isGoodAddress(address);
      addrAdd++;
    } while (!answer);
    const pathDerive = "m/44'/1'/0'/0/" + addrAdd;
    const address = root.derivePath(pathDerive).getAddress();
    return address;
  }
  getUtxoArr(baseArr, amountToSend) {
    const that = this;
    const network = bitcoin.networks[CONST.network];
    const inpArrAmount = [];
    const inpArrId = [];
    let sumAmount = 0;
    let txSatoshi = 0;
    const txResArr = [];
    const txSatoshiArr = [];
    baseArr.forEach((e) => {
      inpArrAmount.push(e.satoshis);
      inpArrId.push(e.txid);
    });
    inpArrAmount.forEach((e, i) => {
      if (sumAmount < amountToSend) {
        sumAmount += e;
        txResArr.push(inpArrId[i]);
        txSatoshiArr.push(e);
      }
    })
    txSatoshiArr.forEach((e) => {
      txSatoshi += e;
    })
    return {
      txResArr,
      txSatoshi
    };
  }
  getFee() {
    return 1000;
  }
  baseAmount() {
    return 1500;
  }
  send(utxoArr, addressTo, amountToSend, addrMyFirstUnused) {
    if (!amountToSend || !addressTo) {
      return;
    }
    const { txResArr, txSatoshi } = this.getUtxoArr(utxoArr, amountToSend);
    const network = bitcoin.networks[CONST.network];
    const tx = new bitcoin.TransactionBuilder(network);
    txResArr.forEach((e) => {
      tx.addInput(e, 0);
    })
    const fee = this.getFee();
    const baseAmount = this.baseAmount();
    tx.addOutput(addressTo, parseFloat(amountToSend));
    // if (txSatoshi - fee - amountToSend > baseAmount){
    //   tx.addOutput(addrMyFirstUnused, parseFloat(txSatoshi - fee - amountToSend));  
    // }
    // tx.addOutput(addressTo, parseFloat(amountToSend));

    // var keyPair = bitcoin.ECPair.fromWIF(this.state.privatKey, network);

    // tx.sign(0, keyPair);
    // const hexTxId = { "rawtx": tx.build().toHex() };
    // axios.post(ip + "/tx/send", hexTxId)
    //   .then(function (response) {
    //     that.setState({
    //       "txId": response.data.txid
    //     })
    //   })
  }
  sendBTC() {
    var addressTo = document.getElementById('send_address').value;
    var amoutToSend = document.getElementById('send_BTC').value;
    const addr = this.findFirstUnused();
    var stringGetUtxo = ip + "/addr/" + addr + "/utxo";
    fetch(stringGetUtxo)
      .then((res) => {
        return res.json();
      }).then((val) => {
        this.send(val, addressTo, amoutToSend, addr);
      })
  }

  getTransactions() {
    this.setState({
      "transactions": []
    })
    getTransactionsModule((pathDerive) => {
      return this.state.root.derivePath(pathDerive).getAddress()
    }, (data) => {
      this.setState(data);
    });
  }
  // getTrans(address, cb) {
  //   const stringGetTrans = ip + "/txs/?address=" + address;
  //   let res = 0;
  //   fetch(stringGetTrans)
  //     .then((res) => {
  //       return res.json();
  //     }).then((utxoArr) => {
  //       if (utxoArr.txs.length) {
  //         cb(true);
  //       }
  //       cb(false);
  //     })
  // }

  getFullUtxo() {
    this.setState({
      "utxo": "~~~~~"
    })
    getUtxo((pathDerive) => {
      return this.state.root.derivePath(pathDerive).getAddress()
    }, (data) => {
      this.setState(data);
    })
  }

  generateReceiveAddress() {
    const receiveAddressCount = this.state.lastReceiveAddress + 1;
    const root = this.state.root;
    const pathDerive = "m/44'/1'/0'/0/" + receiveAddressCount;
    const address = root.derivePath(pathDerive).getAddress();
    const arrReceive = this.state.receiveAddress.slice();
    arrReceive.push(address);
    this.setState({
      "lastReceiveAddress": receiveAddressCount,
      "receiveAddress": arrReceive
    })
    const that = this;
  }
  generateSendAddress() {
    const sendAddressCount = this.state.lastSendAddress + 1;
    const root = this.state.root;
    const pathDerive = "m/44'/1'/0'/1/" + sendAddressCount;
    const address = root.derivePath(pathDerive).getAddress();
    const arrSend = this.state.sendAddress.slice();
    arrSend.push(address);
    this.setState({
      "lastSendAddress": sendAddressCount,
      "sendAddress": arrSend
    })
    const that = this;
  }
  mnemonicRegister(seedFraze) {
    const network = bitcoin.networks[CONST.network];
    const seed = bip39.mnemonicToSeed(seedFraze);
    const root = bitcoin.HDNode.fromSeedHex(seed, network);
    this.setState({
      "mnemonic": seedFraze,
      "root": root,
      "lastReceiveAddress": 0,
      "lastSendAddress": 0
    }, () => {
      this.getTransactions();
      this.getFullUtxo();
    })
  }
  generateAddress() {
    const seedFraze = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
    this.mnemonicRegister(seedFraze);
  };
  registerMnemonic() {
    const seedFraze = document.getElementById('mnemonic').value.trim();
    if (seedFraze !== this.state.mnemonic) {
      this.mnemonicRegister(seedFraze);
    }
  }
  componentDidMount() {
    lightTabsFunction(jQuery);
    jQuery(".tabs").lightTabs();
  }
  render() {

    return (
      <div>
        <div className="tabs">
          <ul>
            <li>Key management</li>
            <li>Account data</li>
            <li>Send money</li>
          </ul>
          <div>
            <div className="keyWallet">
              <KeyWallet
                registerMnemonic={this.registerMnemonic}
                generateAddress={this.generateAddress}
                privatKey={this.state.privatKey}
                wallet={this.state.wallet}
                publicKey={this.state.publicKey}
                privatKey={this.state.privatKey}
                mnemonic={this.state.mnemonic}
                newAddressReceive={this.state.newAddressReceive}
                sendAddress={this.state.sendAddress}
                generateReceiveAddress={this.generateReceiveAddress}
                generateSendAddress={this.generateSendAddress}
              />
            </div>
            <div className="info">
              <Info
                transactions={this.state.transactions}
                utxo={this.state.utxo}
                getUtxo={this.getFullUtxo}
                getTransactions={this.getTransactions}
              />
            </div>
            <div className="sender">
              <Sender
                sendBTC={this.sendBTC}
                txId={this.state.txId}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default App;
