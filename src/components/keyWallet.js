import React, { Component } from 'react';
import './keyWallet.css';
import Spinner from 'spin.js';

class KeyWallet extends Component {
  spinner = new Spinner();
  render() {
    let address;
    if (this.props.newAddressReceive === "spin") {
      console.log('spin');
      address = "";
      this.spinner.stop();
      this.spinner.spin(document.getElementById('toSpin'));
    } else {
      console.log('not spin');
      address = this.props.newAddressReceive;
      this.spinner.stop();
    }
    if (!this.props.mnemonic) {
      this.props.generateAddress();
    }
    let i = 0;
    return (
      <div>
        <button onClick={this.props.generateAddress}> Создать ключи </button> <br />
        <textarea rows="3" cols="45" placeholder="privat key Mnemonic" id="mnemonic" value="mechanic session device cram device dress face point novel trash chef earth" /> <br />
        <button onClick={this.props.registerMnemonic}> Работать с "мнемоником" введенным вручную </button>
        <div>
          Текущиq HDключ, с которым ведется работа <br />
          Мнемофраза: <label className="mnemo">{this.props.mnemonic}</label> <br />
        </div>


        <div id="toSpin">
          {this.props.newAddressReceive === "spin" ? "" : `Адрес для получения - ${this.props.newAddressReceive}`}
        </div>
        <div>
          Текущие адреса:
          {this.props.activeAddresses.map((address, index) => {
            return (
              <div key={index}>
                <p className="address">{address}:</p>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default KeyWallet;
