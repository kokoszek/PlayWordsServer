"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./App.css");
var Navigation_1 = require("./components/Navigation");
var Main_1 = require("./components/Main");
function App() {
    return (<div className="App">
      <Navigation_1["default"] />
      <Main_1["default"] />
    </div>);
}
exports["default"] = App;
