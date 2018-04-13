
var authdataMockup = {
  "canSignIn": false,
  "email": "zitrix.box+t91@gmail.com",
  "emailVerified": false,
  "fullVerified": false,
  "totpSecretKeyConfirmed": false,
  "id": 0,
};
// {
// 	"canSignIn": true,
// 	"email": "string",
// 	"emailCodeResendAfterPeriod": 0,
// 	"emailCodeValidPeriod": 0,
// 	"emailLastCodeSentAt": "2018-04-11T14:42:58.236Z",
// 	"emailVerificationAttemptsCount": 0,
// 	"emailVerified": true,
// 	"fullVerified": true,
// 	"id": 0,
// 	"passwordResetCodeResendAfterPeriod": 0,
// 	"passwordResetCodeValidPeriod": 0,
// 	"passwordResetLastCodeSentAt": "2018-04-11T14:42:58.236Z",
// 	"totpSecretKeyConfirmed": true
// };

class Api {
	constructor(model) {
		this.model = model;
		this.m = model;
		// this._fetch_domain();
		this._fetchesInProgress = {};
		this._loadJSinProgress = {};
	}
	_fetchGET(url, params_) {
		return this._fetch('GET', url, params_);
	}
	_fetchPOST(url, params_) {
		return this._fetch('POST', url, params_);
	}
	_fetch(method, path, params_) {
		// if (this.logoutNow && method!="logout") {
		// 	return Promise.reject({code:"SIGN_OUT_IN_PROGRESS"});
		// }
		var params;
		if (params_) {
			params = params_ ? JSON.parse(JSON.stringify(params_)) : null;
		}
		var id = method + path +"###"+ JSON.stringify(params);
		if (this._fetchesInProgress[id]) return this._fetchesInProgress[id];
		var domain = this._fetch_domain(method, path, params);
		var ret = this._fetch_transport(id, method, params, domain, path);
		this._fetchesInProgress[id] = ret;
		return ret;
	}
	_fetch_domain(method, path, params) {
		return this.m.settings.api.url;
	}
	_fetch_transport(id, method, params, domain, path) {
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
		var path_ = path;
		if (params) {
			if (method=='GET') {
				if (path_.indexOf("?")==-1) {
					path_ += "?";
				} else {
					if (path_[path_.length-1]!="&") path_ += "&";
				}
				path_ += Object.keys(params).map(k=>{
					var v = params[k];
					return k +"="+ encodeURIComponent(v);
				}).join("&");
			} else {
				headers.body = JSON.stringify(params);
			}
			if (method=='POST') {
				headers.headers["Content-Type"] = "application/json"; // application/x-www-form-urlencoded, multipart/form-data
			}
		}
		var ret = fetch(
			domain + path_,
			headers
		);
		ret.id = id;
		ret.now = now;
		return this._fetch_transport_wrap(ret, method, path, params);
	}
	_fetch_transport_wrap(transport, method, path, params) {
		// console.log(path +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
		return transport.then(x=>{
			return typeof x.json == 'function' ? x.json() : x; // no .json() for mockups
		})
		.then(x=>{
			this._fetchesInProgress[transport.id] = null;
			if (x.errors && x.status) throw x;
			return x;
		})
		.then(x=>{
			return this._fetch_editResponce(x, method, path, params);
		})
		.then(x=>{
			// console.log("200 " + path +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
			return this._fetch_updateModel(x, method, path, params);
		})
		.catch(x=>{
			// console.log("er " + path +" ; "+ document.cookie +" ; "+ JSON.stringify(params));
			this._fetchesInProgress[transport.id] = null;
			throw x;
		})
		;
	}
	_fetch_editResponce(ret, method, path, params) {
		if (ret && typeof ret == 'object') {
			if (Object.keys(ret).join("")=="response") {
				ret = ret.response;
			}
		}
		var cmd = method + path;
		if (cmd=='GET/system/user/types') {
			ret = ret.map(v=>{
				if (v.children && v.children.length==1) {
					return v.children[0];
				}
				return v;
			});
		}
		return ret;
	}
	_fetch_updateModel(ret, method, path, params) {
		var cmd = method + path;
		if (cmd=='GET/auth') {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd=='GET/system/user/types') {
			this.model.userTypes = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/email/verification/confirm')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/auth/register')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/totp/key/confirm')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		return ret;
	}
	_fetch_afterCheck(method, path, params, check, ifFirstCheckIsFalsy, beforeFetch) {
		if (typeof ifFirstCheckIsFalsy == 'function') {
			var firstCheckIsFalsy = check();
			if (firstCheckIsFalsy) {
				ifFirstCheckIsFalsy();
			}
		}
		return new Promise((resolve,reject)=>{
			var again = () => {
				if (!check()) return setTimeout(again,40);
				if (typeof beforeFetch == 'function') {
					beforeFetch(method, path, params);
				}
				this._fetch(method, path, params).then(resolve).catch(reject);
			};
			again();
		});
	}
	requestCodeToVerifyEmail(email) {
		return (email?Promise.resolve():this.getUserData()).then(()=>{
			return this._fetchGET(`/email/verification/code`, {
				email: email || this.model.auth.email
			});
		});
	}
	isEmailAvailable(email) {
		return this._fetchGET('/email/check', {email}).then(x=>{
			// if (x) this.requestCodeToVerifyEmail(email);
			return x;
		});
	}
	getUserTypes() {
		return this._fetchGET('/system/user/types', {lang:"EN"});
	}
	getUserData() {
		return this._fetch_transport_wrap(Promise.resolve( this.model.auth || authdataMockup ), 'GET', '/auth', null);
	}
	verifyEmail(email, code) {
		var params = {code};
		return (email?Promise.resolve():this.getUserData()).then(()=>{
			var email = email || this.model.auth.email;
			return this._fetchPOST(`/email/verification/confirm?email=${encodeURIComponent(email)}&code=${code}`);
		});
		/*
		this._fetch_afterCheck(
			'POST', '/email/verification/confirm', params
			, ()=>!email || !this.model.user
			, ()=>this.getUserData()
			, (method, path, params)=> {
				params.email = email || this.model.user.email;
			}
		).then(x=>{
			debugger;
		});
		*/
	}
	register(params) {
		var params = JSON.parse(JSON.stringify(params));
		params.userType = params.role;
		var whitelist = {
			'userType':1,
			'addressLine1':1,'addressLine2':1,'city':1,'companyDescription':1,'companyName':1,'companyNumber':1,'country':1,'email':1,'firstName':1,'lastName':1,'password':1,'phoneAreaCode':1,'phoneNumberCode':1,'postcode':1,
			loggedIn: 0,
			id: 0,
			lastLoginDate: 0,
			createDate: 0
		};
		var params_ = JSON.parse(JSON.stringify(params));
		params = {};
		var skippedParams = [];
		Object.keys(params_).forEach(k=>{
			if (whitelist[k]) {
				params[k] = params_[k];
			}
		});
		Object.keys(whitelist).forEach(k=>{
			if (whitelist[k] && !(k in params)) {
				skippedParams.push(k);
			}
		});
		if (skippedParams.length) {
			// debugger;
		}
		this._fetch_afterCheck(
			'POST', '/auth/register', params
			, ()=>this.model.userTypes
			, ()=>this.getUserTypes()
			, (method, path, params)=> {
				// debugger;
				// params.userType = this.model.userTypes.filter(v=>v.id==params.userType)[0];
				// if (!params.userType) {
				// 	params.userType = this.model.userTypes.filter(v=>(v.children||[]).filter(v=>v.id==params.userType)[0])[0];
				// }
			}
		).then(x=>{
			debugger;
		});
	}
	generateTotpSecretKey() {
		return this._fetchGET('/totp/key');
	}
	confirmTotpSecretKey(code) {
		return this._fetchPOST('/totp/key/confirm?code='+code.replace(/\D+/g,""));
	}
	_loadLib(scripts) {
		return Promise.all(
			scripts.map(filename=>{
				var already = this._loadJSinProgress[filename];
				if (already) return already;
				this._loadJSinProgress[filename] = new Promise((resolve,reject)=>{
					var tag = document.createElement('script');
					tag.onload = resolve;
					tag.onerror = reject;
					tag.src = filename;
					document.querySelector("head").appendChild(tag);
				});
				return this._loadJSinProgress[filename];
			})
		);
	}
	loadLib_qrcode() {
		// https://www.npmjs.com/package/qrcode
		return this._loadLib(['./qrcode.min.js']);
	}
    getCurrenciesRate() {
        if (this.m.currenciesRate) return Promise.resolve(this.m.currenciesRate);
        if (this.currenciesRatePromise) return this.currenciesRatePromise;
        var keys = this.m.CONSTS.CLASSIC_CURRENIES_KEYS.join(",");
        var rate = {};
        this.currenciesRatePromise = Promise.all(
            ['ETH','BTC','INS'].map(id=>{
                return fetch(
                    `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=${keys}`,
                    {
            			method: 'GET',
            			mode: 'nocors',
            			cache: 'default' ,
                    }
                ).then(x=>x.json())
                .then(x=>{
                    rate[id] = x;
                });
            })
        )
        .then(()=>{
            this.m.currenciesRate = rate;
            this.m.emit('change');
            return this.m.currenciesRate;
        })
        ;
        return this.currenciesRatePromise;
    }
    getDefaultClassicCurrency() {
        var viaLocalStorage = localStorage.getItem(this.m.settings.misc.localStorage_prefix+ "INS_defaultClassicCurrency");
        var viaSettings = this.m.settings.misc.defaultClassicCurrency;
        var viaHardcode = "USD";
        var ret = viaLocalStorage || viaSettings || viaHardcode;
        if (this.m.defaultClassicCurrency!=ret) {
            this.m.defaultClassicCurrency = ret;
            this.m.emit('change');
        }
        return Promise.resolve(ret);
    }
}

export default Api;
