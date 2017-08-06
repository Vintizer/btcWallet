import React, { Component } from 'react';
import './info.css';

class Balance extends Component {
    render() {
        return (
            <div>
                <button onClick={this.getBalance}> Запросить баланс </button> <br />
                <input type='text' placeholder="balance" id="balance" /> <br />
                <input type='text' placeholder="unconfirmed balance" id="unconfirmed_balance" /> <br />
            </div>
        );
    }
}

export default Balance;
