import React, { Component } from 'react';
import './info.css';

class Balance extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.getBalance}> Запросить баланс </button> <br />
                <h3 id="balance" >{this.props.balance} </h3><br />
                <h3 id="unconfirmed_balance" >{this.props.unconfirmedBalance}  </h3><br />
            </div>
        );
    }
}

export default Balance;
