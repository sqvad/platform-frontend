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
	clear: function() {
		for (var k in this) {
			if (this.defaultKeys.indexOf(k)==-1) {
				delete this[k];
			}
		}
		var prefix = this.settings.misc.localStorage_prefix;
		for (var i=0, l=localStorage.length; i<l; i++) {
			var k = localStorage.key(i);
			if (k.indexOf(prefix)==0) {
				localStorage.removeItem(k);
			}
		}
		document.cookie.split(";").forEach(c=>{
			document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		});
	},
	CONSTS: CONSTS,
	Web3: Web3,
};

export default model;
