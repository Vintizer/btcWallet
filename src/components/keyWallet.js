import React, { Component } from 'react';
import './keyWallet.css';

class KeyWallet extends Component {
  render() {
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
        <button onClick={this.props.generateReceiveAddress}> Получить адрес на получение </button> <br />
        <button onClick={this.props.generateSendAddress}> Получить адрес на отправку </button>

        <div>
          Текущие адреса на получение:
          {this.props.receiveAddress.map((address, index) => {
            return (
              <div key={index}>
                <p className="address">{address}:</p>
              </div>
            )
          })}
        </div>
        <div>
          Текущие адреса:
          {this.props.sendAddress.map((address, index) => {
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
