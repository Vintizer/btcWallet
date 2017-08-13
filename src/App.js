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
      "countUtxo": 0
    };
    this.generateAddress = this.generateAddress.bind(this);
    this.registerMnemonic = this.registerMnemonic.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.sendBTC = this.sendBTC.bind(this);
    this.generateReceiveAddress = this.generateReceiveAddress.bind(this);
    this.generateSendAddress = this.generateSendAddress.bind(this);
    this.getFullUtxo = this.getFullUtxo.bind(this);
  }
  getUtxo(address, cb) {
    const stringGetUtxo = ip + "/addr/" + address + "/utxo";
    let res = 0;
    fetch(stringGetUtxo)
      .then((res) => {
        return res.json();
      }).then((utxoArr) => {
        utxoArr.forEach((e) => {
          res += parseInt(e.satoshis);
        });
        cb(res);
      })

  }
  test20address(gen, cb) {
    console.log('gen', gen);
    let res = 0;
    for (let i = 20 * (gen - 1); i < 20 * gen; i++) {
      const root = this.state.root;
      const pathDerive = "m/44'/1'/0'/0/" + i;
      console.log(pathDerive);
      const address = root.derivePath(pathDerive).getAddress();
      this.getUtxo(address, (getRes) => {
        res += getRes;
        if (i === (20 * gen) - 1) {
          cb(res);
        }
      });
    }
  }
  countUtxo(gen, fullUtxo, cb) {
    let localGen = gen;
    const tryUtxo = (res) => {
      console.log('tryUtxo', res);
      if (res > 0) {
        fullUtxo += res;
        console.log('inside res > 0');
        this.countUtxo(localGen + 1, fullUtxo, cb);
      } else {
        console.log('return', fullUtxo);
        cb(fullUtxo);
      }
    }
    this.test20address(gen, tryUtxo);
  }

  getFullUtxo() {
    this.countUtxo(1, 0, (res) => {
      console.log('fullSRes!!!', res);
      this.setState({
        "utxo": res
      })
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
    const network = bitcoin.networks[CONST.network];
    const seed = bip39.mnemonicToSeed(seedFraze);
    const root = bitcoin.HDNode.fromSeedHex(seed, network);
    this.setState({
      "mnemonic": seedFraze,
      "root": root,
      "lastReceiveAddress": 0,
      "lastSendAddress": 0
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
                transactions={this.state.transactions}
                utxo={this.state.utxo}
                getUtxo={this.getFullUtxo}
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
