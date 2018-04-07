class Api {
	constructor(model) {
		this.model = model;
		this.m = model;
		// this._fetch_domain();
	}
	_fetch(cmd, params_) {
		if (this.logoutNow && method!="logout") {
			return Promise.reject({code:"SIGN_OUT_IN_PROGRESS"});
		}
		var params;
		if (params_) {
			params = params_ ? JSON.parse(JSON.stringify(params_)) : null;
		}
		var method = this._fetch_method(cmd, params);
		var domain = this._fetch_domain(cmd, params);
		var path = this._fetch_path(cmd, params);
		var ret = this._fetch_transport(cmd, method, params, domain, path);
		return ret;
	}
	_fetch_domain(cmd, params) {
		return this.m.settings.api.url;
	}
	_fetch_method(cmd, params) {
		return {
			'getUserTypes': 'GET',
		}[cmd];
	}
	_fetch_path(cmd, params) {
		return {
			'getUserTypes': '/system/user/types?lang=EN',
		}[cmd];
	}
	_fetch_transport(cmd, method, params, domain, path) {
		var now = (new Date())+'';
		var headers = {
			method: method,
			headers: {
				"Access-Control-Allow-Credentials": true,
				"Access-Control-Request-Headers": "Cookie",
			},
			mode: 'cors',
			cache: 'default' ,
			credentials: 'include',
		};
		if (params) {
			headers.body = JSON.stringify(params);
		}
		var ret = fetch(
			domain + path,
			headers
		);
		ret.now = now;
		return this._fetch_transport_wrap(ret, cmd, method, params, domain, path);
	}
	_fetch_transport_wrap(transport, cmd, method, params, domain, path) {
		// console.log(method +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
		return transport.then(x=>{
			return x.json();
		})
		.then(x=>{
			return this._fetch_editResponce(x, cmd, params);
		})
		.then(x=>{
			// console.log("200 " + method +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
			return this._fetch_updateModel(x, cmd, params);
		})
		.catch(x=>{
			// console.log("er " + method +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
			throw x;
		})
		;
	}
	_fetch_editResponce(ret, cmd, params) {
		if (cmd=='getUserTypes') {
			ret.map(v=>{
				if (v.children && v.children.length==1) {
					v.children = null;
					// v.children.shift()
					// var placeholder = v.children.shift();
					// for (var k in placeholder) {
					// 	v[k] = placeholder[k];
					// }
					// if (v.children.length==0) v.children = null;
				} else {
					// debugger;
				}
				return v;
			});
		}
		return ret;
	}
	_fetch_updateModel(ret, cmd, params) {
		if (cmd=='getUserTypes') {
			this.model.userTypes = ret;
			this.model.emit('change');
		}
		return ret;
	}
	_fetch_afterCheck(method, params, check) {
		return new Promise((resolve,reject)=>{
			var again = () => {
				if (!check()) return setTimeout(again,40);
				this._fetch(method, params).then(resolve).catch(reject);
			};
			again();
		});
	}
	fetchUserTypes() {
		return this._fetch('getUserTypes');
	}
}

export default Api;
