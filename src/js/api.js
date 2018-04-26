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
		if (this.model.logoutInProgress && path.indexOf('/auth/logout')==-1) {
			return Promise.reject({message:"SIGN_OUT_IN_PROGRESS"});
		}
		var params;
		if (params_) {
			if (params_ instanceof FormData) {
				params = {
					isFormData_: true
				};
			} else {
				params = params_ ? JSON.parse(JSON.stringify(params_)) : null;
			}
		}
		var id = method + path +"###"+ JSON.stringify(params);
		if (this._fetchesInProgress[id]) return this._fetchesInProgress[id];
		var domain = this._fetch_domain(method, path, params);
		if (params_ && params_ instanceof FormData) {
			params.formData = params_;
		}
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
				if (params.isFormData_) {
					headers.body = params.formData
				} else {
					headers.body = JSON.stringify(params);
				}
			}
			if (method=='POST') {
				if (params.isFormData_) {
				} else {
					headers.headers["Content-Type"] = "application/json"; // application/x-www-form-urlencoded, multipart/form-data
				}
			}
			if (method=='PATCH') {
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
		var isOk;
		return transport.then(x=>{
			isOk = x.status==200;
            return typeof x.json == 'function'
                ? x.json().then(v=>v).catch(er=>{
					try {
						console.error(er);
					} catch(er2) {}
                    return {};
                })
                : x;
		})
		.then(x=>{
			this._fetchesInProgress[transport.id] = null;
			if (('errors' in x) && ('message' in x)) {
                if (x.errors) {
                    if (Array.isArray(x.errors) && x.errors.length) {
                        throw x;
                    }
                } else if (x.message===null && x.errors===null && Object.keys(x).length==2) {
					x.message = "Unknown error";
					throw x;
                } else if (x.message) {
                    throw x;
                }
            }
			if (!isOk) {
				throw {
					message: "Unknown error",
					errors: null
				};
			}
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
		if (cmd=='POST/wallet/transactions/list') {
            ret.forEach(v=>{
                if (v.name==v.symbol) {
                    v.name = [
                        this.model.settings.misc.myETHwallet_prefix,
                        v.name,
                        this.model.settings.misc.myETHwallet_postfix,
                    ].map(v=>!!v).join("");
                }
            });
        }
		return ret;
	}
	_fetch_updateModel(ret, method, path, params) {
		var cmd = method + path;
		if (cmd=='GET/auth/data') {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd=='GET/system/user/types') {
			this.model.userTypes = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/register/email/verify/confirm')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/register/data')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/register/totp/key/confirm')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/auth/login/email')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/auth/login/totp')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/user/totp/setting/toggle')>-1) {
			this.model.auth = ret;
			this.model.emit('change');
		}
		if (cmd.indexOf('/user/profile')>-1) {
            this.model.user = this.model.user || {};
            var need = ret || {};
            Object.keys(need).forEach(k=>{
                this.model.user[k] = need[k];
            });
			this.model.emit('change');
		}
		if (cmd.indexOf('/wallet/list')>-1) {
            this.model.user = this.model.user || {};
            this.model.user.wallets = ret;
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
    gotoHref(href) {
		if (this.model.settings.misc.pathViaHash) {
			if (href && href!="#") {
				// window.location.hash = href.charAt(0)=="#" ? href : "#" + href;
				window.history.pushState({x:Date.now()}, null, href.charAt(0)=="#" ? href : "#" + href);
			} else {
				// window.location.hash = "";
				window.history.pushState({x:Date.now()}, null, "#");
			}
		} else {
        	var path = window.location.pathname || "/";
			if (href!="/") {
		        var pathLastChar = path.charAt(path.length-1);
		        if (pathLastChar=="/" && href.charAt(0)==pathLastChar) {
		            href = href.substr(1);
		        }
			}
			window.history.pushState({x:Date.now()}, null, href);
        }
    }
	hrefForEmail(href) {
		var useHash = this.model.settings.misc.pathViaHash;
		if (href.charAt(0)=="/" && !useHash) href = href.substr(1);
		return [
			window.location[useHash?'origin':'href'],
			useHash?"#":"",
			href
		].filter(v=>!!v).join("");
	}
    logout() {
        try {
            this.model.clear();
        } catch(er) {}
        try {
            this.model.logoutInProgress = true;
            // this.model.emit('change');
        } catch(er) {}
        this._fetchPOST('/auth/logout',null)
        .then(()=>{
            this.model.logoutInProgress = false;
            this.model.emit('change');
			this.gotoHref("/");
			window.location.reload();
        })
        .catch(()=>{
            this.model.logoutInProgress = false;
            this.model.emit('change');
			this.gotoHref("/");
			window.location.reload();
        })
    }
    loginEmail(email,password,keepSignedIn) {
        return this._fetchPOST('/auth/login/email',{email,password,keepSignedIn:!!keepSignedIn})
        .then(x=>{
            this.getUserData();
            return x;
        });
    }
    login2fa(code) {
        return this._fetchPOST('/auth/login/totp',{code:code.replace(/[\D]/g,'')})
        .then(x=>{
            this.getUserData();
            return x;
        });
    }
	requestCodeToVerifyEmail(email) {
		return (email?Promise.resolve():this.getAuthData()).then(()=>{
			return this._fetchPOST(`/register/email/verify/code`, {
				email: email || this.model.auth.email
			});
		});
	}
	isEmailAvailable(email) {
		return this._fetchPOST('/system/check/email/availability', {email}).then(x=>{
			// if (x) this.requestCodeToVerifyEmail(email);
			return x;
		});
	}
	changePassword(cur, want) {
		return this._fetchPOST('/user/password/reset', {oldPassword:cur,newPassword:want});
	}
	sendCodeForPasswordReset(email,verificationEndpoint) {
		if (!verificationEndpoint) {
			verificationEndpoint = this.hrefForEmail("/reset-password/%s");
		}
		return this._fetchPOST('/system/password/reset/request', {email,verificationEndpoint:verificationEndpoint})
	}
	resetPassword(code,password) {
		return this._fetchPOST('/system/password/reset/confirm', {code,password})
	}
	getUserTypes() {
		return this._fetchGET('/system/user/types', {lang:"EN"});
	}
	getAuthData() {
		// return this._fetch_transport_wrap(Promise.resolve( this.model.auth || authdataMockup ), 'GET', '/auth', null);
		return this._fetchGET('/auth/data');
	}
	getUserData(andAllRelations) {
		return this._fetchGET('/user/profile')
        .then(()=>{
            if (!andAllRelations) {
                return;
            }
            Promise.all([
                this.getWallets()
            ]);
        })
        .then(()=>this.model.user);
	}
	toggle2FASetting(is2FAOn, code) {
		return this._fetchPOST('/user/totp/setting/toggle',{is2FAOn:!!is2FAOn,code});
	}
	getWallets() {
		return this._fetchGET('/wallet/list').then(()=>this.model.user.wallets);
	}
    updateWalletName(walletId, name) {
		var wallet = this.model.user.wallets.filter(v=>v.symbol==walletId)[0];
        var params = {
            tokenContractAddress: wallet.tokenContractAddress,
            name
        };
        return this._fetch('PATCH','/wallet/name', params);
    }
    getTransactions(walletId, filters) {
        var params = filters || {};
        params.tokenContractAddress = walletId;
        params.pageSize = 100000;
        params.page = 0;
		return this._fetchPOST('/wallet/transactions/list',params);
    }
	verifyEmail(emailVerificationCode) {
		return this._fetchPOST("/register/email/verify/confirm",{emailVerificationCode});
	}
	register(params) {
		var params = JSON.parse(JSON.stringify(params));
		params.userType = params.role;
		var verificationEndpoint = params.verificationEndpoint;
		if (!verificationEndpoint) {
			verificationEndpoint = this.hrefForEmail("/verify-email/%s");
		}
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
		if (params.phoneNumberCode) {
			params.phoneNumber = params.phoneNumberCode;
			delete params.phoneNumberCode;
		}
		params = {
			user: params,
			verificationEndpoint
		};
		return this._fetch_afterCheck(
			'POST', '/register/data', params
			, ()=>this.model.userTypes
			, ()=>this.getUserTypes()
			, (method, path, params)=> {
				// debugger;
				// params.userType = this.model.userTypes.filter(v=>v.id==params.userType)[0];
				// if (!params.userType) {
				// 	params.userType = this.model.userTypes.filter(v=>(v.children||[]).filter(v=>v.id==params.userType)[0])[0];
				// }
			}
		)
        .catch(x=>{
            throw x;
		})
	}
	generateTotpSecretKey() {
		return this._fetchPOST('/register/totp/key/generate');
	}
	confirmTotpSecretKey(code) {
		return this._fetchPOST('/register/totp/key/confirm',{code:code.replace(/\D+/g,"")});
	}
	sendTotpResetRequest(files) {
		var formData = new FormData();
		// formData.append('files', files);
		files.forEach(v=>{
			formData.append('requestData', v);
		});
		return this._fetchPOST('/system/totp/reset/send',formData);
	}
	withdraw(comment,confirmationCode,sum,toAddress,tokenContractAddress) {
		return this._fetchPOST('/wallet/transactions/withdraw',{
			comment:comment||"",
			confirmationCode,
			sum: (sum&&sum.toString) ? sum.toString() : "",
			toAddress,tokenContractAddress
		});
	}
	getDepositAddresses(tokenContractAddress) {
		return this._fetchPOST('/wallet/deposit_address/list',{tokenContractAddress});
	}
	updateDepositAddressName(name,depositAdr,tokenContractAddress) {
		return this._fetch('PATCH','/wallet/deposit_address/name',{
			name, tokenContractAddress,
			address: depositAdr
		});
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
	loadLib_clipboardjs() {
		// https://clipboardjs.com/
		return this._loadLib(['./clipboard.min.js']);
	}
    getCurrenciesRate() {
        if (this.m.currenciesRate) return Promise.resolve(this.m.currenciesRate);
        if (this.currenciesRatePromise) return this.currenciesRatePromise;
        var keys = Object.keys(this.model.settings.classicCurrencies).join(",");
        var rate = {};
        this.currenciesRatePromise = Promise.all(
            this.model.settings.misc.getUSDrateFor.map(id=>{
                return fetch(
                    `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=${keys}`,
                    {
            			method: 'GET',
            			mode: 'nocors',
            			cache: 'no-cache' ,
                        credentials: 'omit'
                    }
                ).then(x=>x.json())
                .then(x=>{
                    if (!x) return;
                    if (x.Response=="Error") return;
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
        var viaLocalStorage = localStorage.getItem(this.m.settings.misc.localStorage_prefix+ "defaultClassicCurrency");
        var viaSettings = this.m.settings.misc.defaultClassicCurrency;
        var viaHardcode = "USD";
        var ret = viaLocalStorage || viaSettings || viaHardcode;
        if (this.m.defaultClassicCurrency!=ret) {
            this.m.defaultClassicCurrency = ret;
            this.m.emit('change');
        }
        return Promise.resolve(ret);
    }
	setDefaultClassicCurrency(v) {
		localStorage.setItem(this.m.settings.misc.localStorage_prefix+ "defaultClassicCurrency", v);
		return this.getDefaultClassicCurrency();
	}
}

export default Api;
