import React, { Component } from 'react';
import './info.css';

class Sender extends Component {
    render() {
        return (
            <div>
                Отправить сатоши <input type='text' placeholder="send BTC" id="send_BTC" value = "60200301"/> <br /> ВТС на адрес
                <input type='text' placeholder="send address" id="send_address" value = "n3SLphtGp3GwrTsLC2ZFH6XH3sHtixvziH"/> <br />
                <button onClick={this.props.sendBTC}> Отправить </button> <br />
                {this.props.txId ? `Номер транзакции ${this.props.txId}` : null}
            </div>
        );
    }
}

export default Sender;
