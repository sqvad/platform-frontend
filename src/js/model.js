import CONSTS from './consts.js';

var model = {
	listeners: {
		'change': [],
	},
	on: function(type, clb) {
		this.listeners[type].push(clb);
	},
	emit: function(type) {
		this.listeners[type].forEach(clb=>clb());
	},
	Web3: Web3,
};

export default model;
