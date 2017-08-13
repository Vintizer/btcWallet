import React, { Component } from 'react';
import './info.css';

class Info extends Component {
  render() {
    return (
      <div>
        Текущие ключи, с которыми ведется работа <br />
        Количество сатоши на кошельке - {this.props.utxo} Sat<br />
        Количество биткоинов на кошельке - {this.props.utxo/100000000} BTC<br />
        <button onClick={this.props.getUtxo}> getUtxo </button>
      </div>
    );
  }
}

export default Info;
