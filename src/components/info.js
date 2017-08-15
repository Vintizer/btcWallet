import React, { Component } from 'react';
import './info.css';

class Info extends Component {

  render() {
    return (
      <div>
        {this.props.utxo ?
          `Количество сатоши на кошельке - ${this.props.utxo} Sat`
          : null}   <br />
        {this.props.utxo && this.props.utxo * 1 === this.props.utxo ?
          `Количество биткоинов на кошельке - ${this.props.utxo / 100000000} BTC`
          : null}    <br />
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
