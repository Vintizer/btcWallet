import React, { Component } from 'react';
import './info.css';

class Info extends Component {
  render() {
    return (
      <div>
        Текущие ключи, с которыми ведется работа <br/>
        Адрес кошелька: <label>{this.props.wallet}</label> <br/>
        Публичный ключ: <label>{this.props.publicKey}</label> <br/>
        Приватный ключ: <label>{this.props.privatKey}</label> <br/>
      </div>
    );
  }
}

export default Info;
