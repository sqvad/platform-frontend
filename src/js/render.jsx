import '../css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.jsx';

var render = function(model) {
	return ReactDOM.render(<App m={model}></App>, document.getElementById("root"));
};

export default render;
