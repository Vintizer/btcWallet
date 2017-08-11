import React, { Component } from 'react';
import CONST from "./constants/const.json";
import jQuery from "jquery";
import lightTabsFunction from "./scripts/lightTabs";

const ip = CONST.ipLocal;
class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }
  componentDidMount() {
    lightTabsFunction(jQuery);
    jQuery(".tabs").lightTabs();
  }
  render() {

    return (
      <div>
        <div className="tabs">
          <ul>
            <li>Key management</li>
            <li>Account data</li>
            <li>Send money</li>
          </ul>
          <div>
            <div>Первое содержимое</div>
            <div>Второе содержимое</div>
            <div>Третье содержимое</div>
          </div>
        </div>
      </div>
    )
  }

}

export default App;
