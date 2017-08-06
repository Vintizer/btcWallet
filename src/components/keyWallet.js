import React, { Component } from 'react';


class KeyWallet extends Component {
  render() {
    return (
      <div>
       <button onClick = {this.props.generateAddress}> Создать ключи </button> <br />
       <input type='text' placeholder="privat key WIF" id = "privat_key" value="cQMYDbbSrepZ3Qia5gvbSBPsX53LGchCH9hFuk9iZmrkXJctphGC"/> <br />
       <button onClick = {this.props.registerWIF}> Работать с ключем введенным вручную </button>
      </div>
    );
  }
}

export default KeyWallet;
