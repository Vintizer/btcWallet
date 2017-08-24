import React, { Component } from 'react';
import CONST from "./constants/const.json";
import testData from "./constants/testData.json";
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
import sendBTCScript from "./scripts/sendBTC";

const ip = CONST.ipOut;
class App extends Component {

  constructor() {
    super();
    this.emptyState = {
      "wallet": "",
      "publicKey": "",
      "privatKey": "",
      "balance": "",
      "unconfirmedBalance": "",
      "txId": "",
      "mnemonic": "",
      "activeAddresses": [],
      "root": "",
      "lastReceiveAddress": 0,
      "lastSendAddress": 0,
      "transactions": [],
      "curTransactions": [],
      "utxo": "",
      "countUtxo": 0,
      "newAddressReceive": "",
      "maxIndex": 0
    };
    this.state = this.emptyState;
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
  sendBTC() {
    sendBTCScript(this.state.curTransactions, this.state.newAddressReceive);
  }

  getTransactions() {
    this.setState({
      "newAddressReceive": "spin",
      "transactions": []
    }, () => {
      getTransactionsModule((pathDerive) => {
        return this.state.root.derivePath(pathDerive).getAddress()
      }, (data) => {
        this.setState(data);
        this.getDataForSend();
      });
    })
  }

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

  getKeyPairForAddress(addr) {
    const maxIndex = this.state.maxIndex;
    for (let i = 0; i < maxIndex; i++) {
      let pathDerive = "m/44'/1'/0'/0/" + i;
      const curAddr = this.state.root.derivePath(pathDerive).getAddress();
      if (curAddr === addr) {
        return this.state.root.derivePath(pathDerive).keyPair;
      }
    }
    return false;
  }

  getDataForSend() {
    console.log('getDataForSend');
    const transactions = this.state.transactions;
    // const transactions = testData.items;
    const addresses = this.state.activeAddresses;
    const curTransactions = [];
    transactions.forEach((tx) => {
      const vOut = tx.vout;
      const txId = tx.txid;
      vOut.forEach((out) => {
        const curAddr = out.scriptPubKey.addresses[0];
        if (this.getKeyPairForAddress(curAddr)) {
          curTransactions.push({
            txId,
            keyPair: this.getKeyPairForAddress(curAddr),
            volBTC: out.value
          })
        }
      })
    })
    this.setState({
      curTransactions
    }, () => {
      console.log(this.state.curTransactions);
    })
  }
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
                activeAddresses={this.state.activeAddresses}
              />
            </div>
            <div className="info">
              <Info
                transactions={this.state.transactions}
                utxo={this.state.utxo}
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
