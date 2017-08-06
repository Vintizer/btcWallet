import React, { Component } from 'react';
import './info.css';

class Sender extends Component {
    render() {
        return (
            <div>
                Отправить <input type='text' placeholder="send BTC" id="send_BTC" /> <br /> ВТС на адрес
                <input type='text' placeholder="send address" id="send_address" value = "muPxtF8g3WVWGNcNw1tVoaZMq56dCbjBSX"/> <br />
                <button onClick={this.props.sendBTC}> Отправить </button> <br />
            </div>
        );
    }
}

export default Sender;
