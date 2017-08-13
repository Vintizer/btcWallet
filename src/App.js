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
      "receiveAddress": [],
      "sendAddress": [],
      "root": "",
      "lastReceiveAddress": 0,
      "lastSendAddress": 0
    };
    this.generateAddress = this.generateAddress.bind(this);
    this.registerMnemonic = this.registerMnemonic.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.sendBTC = this.sendBTC.bind(this);
    this.generateReceiveAddress = this.generateReceiveAddress.bind(this);
    this.generateSendAddress = this.generateSendAddress.bind(this);
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
    setTimeout(function () {
      console.log(that.state);
    }, 850);
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
    setTimeout(function () {
      console.log(that.state);
    }, 850);

  }
  mnemonicRegister(seedFraze) {
    var network = bitcoin.networks[CONST.network];
    var seed = bip39.mnemonicToSeed(seedFraze);
    var root = bitcoin.HDNode.fromSeedHex(seed, network);
    this.setState({
      "mnemonic": seedFraze,
      "root": root
    })
  }
  generateAddress() {
    const seedFraze = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
    this.mnemonicRegister(seedFraze);
  };
  registerMnemonic() {
    const seedFraze = document.getElementById('mnemonic').value;
    this.mnemonicRegister(seedFraze);
  }
  getBalance() {
    alert("getBalance");
  }
  sendBTC() {
    alert("sendBTC");
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
                receiveAddress={this.state.receiveAddress}
                sendAddress={this.state.sendAddress}
                generateReceiveAddress={this.generateReceiveAddress}
                generateSendAddress={this.generateSendAddress}
              />
            </div>
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
