import React, { Component } from 'react';
import './info.css';

class Info extends Component {
  render() {
    return (
      <div>
        Текущие ключи, с которыми ведется работа <br />
        {this.props.utxo ?
        `Количество сатоши на кошельке - ${this.props.utxo} Sat`
        : null}   <br /> 
        {this.props.utxo ?
        `Количество биткоинов на кошельке - ${this.props.utxo/100000000} BTC`
        : null}    <br />
        <button onClick={this.props.getUtxo}> getUtxo </button>
        <button onClick={this.props.getTransactions}> getTransactions </button>
        {this.props.transactions.map((transaction, index) => {
            return (
              <div key={index}>
                <p className="transaction">Транзакция - {transaction.txid}</p>
              </div>
            )
          })}
      </div>
    );
  }
}

export default Info;
