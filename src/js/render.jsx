import '../css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';

// import Any from './any.jsx';
// import T from './tags.jsx';
//
// Any.prototype.T = T;

import App from './app.jsx';

var render = function(model) {
	return ReactDOM.render(<App m={model}></App>, document.getElementById("root"));
};

export default render;
