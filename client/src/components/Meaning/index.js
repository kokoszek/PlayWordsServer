"use strict";
exports.__esModule = true;
var react_1 = require("react");
function default_1() {
    var _a = (0, react_1.useState)(''), meaning = _a[0], setMeaning = _a[1];
    return (<div>
      <label htmlFor='meaning'>znaczenie(pl)</label>
      <input id='meaning' type='text' value={meaning} onChange={function (e) { return setMeaning(e.target.value); }}/>
    </div>);
}
exports["default"] = default_1;
