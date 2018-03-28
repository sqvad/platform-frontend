import CONSTS from './consts.js';

const model = {
	listeners: {
		'change': [],
	},
	on: function(type, clb) {
		this.listeners[type].push(clb);
	},
	emit: function(type) {
		this.listeners[type].forEach(clb=>clb());
	},
};

export default model;
