import React, { Component } from 'react';


class KeyWallet extends Component {
  generateWallet() {
  }
  workWithWallet() {
  }
  render() {
    return (
      <div>
       <button onClick = {this.props.generateAddress}> Создать ключи </button> <br />
       <input type='text' placeholder="address" id = "address" /> <br />
       <input type='text' placeholder="public key" id = "public_key" /> <br />
       <input type='text' placeholder="privat key" id = "privat_key" /> <br />
       <button  onClick = {this.workWithWallet}> Работать с данными ключами </button>
      </div>
    );
  }
}

export default KeyWallet;
