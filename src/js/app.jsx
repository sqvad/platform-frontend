import React from 'react';
import Api from './api.js';
import PageEmpty from './pages/page-empty.jsx';
import PageSignUp from './pages/page-signup.jsx';
import PageSet2FA from './pages/page-set2fa.jsx';
import PageSignIn from './pages/page-signin.jsx';
import PageWallets from './pages/page-wallets.jsx';
import PageSettings from './pages/page-settings.jsx';
import PageStart from './pages/page-start.jsx';
import PageVerifyEmail from './pages/page-verify-email.jsx';
import PageEA from './pages/page-early-access.jsx';
import PageResetPassword from './pages/page-reset-password.jsx';
import PageForgot2FA from './pages/page-forgot2fa.jsx';

class App extends React.Component {
	componentWillMount() {
		var model = this.props.m;
		this.api = new Api(model);
		model.on('change', ()=>{
			this.needChange = true;
		});
		this.api.pushState = (href,e) => {
			var target = e && e.touches && e.touches[0] && e.touches[0].target || e.target || {};
			if (target && target.getAttribute("data-external-link")) {
				return;
			}
			this.needChange = true;
			window.history.pushState({x:Date.now()}, null, href);
			if (e && e.preventDefault) {
				e.preventDefault();
			}
		};
		if (!this.props.m.settings.misc.showPagesList) {
			this.api.getAuthData();
		}
		this.api.getEnv();
		this.api.getUserData(false);
		this.api.getDefaultClassicCurrency();
		this.onRAF();
	}
	componentWillUnmount() {
		this.deprecated = true;
	}
	onRAF() {
		if (this.deprecated) return;
		if (this.href!=window.location.href || !this.props.m.path) {
			this.href = window.location.href;
			this.props.m.path = this.parsePath();
			this.needChange = true;
		}
		var width = window.innerWidth || document.body.clientWidth;
		if (width!=this.widthPrev || !this.props.m.device) {
			this.needChange = true;
			this.widthPrev = width;
			if (!this.props.m.device) this.props.m.device = {};
			this.props.m.device.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			this.props.m.device.isAndroid = !this.props.m.device.isIOS && (navigator.userAgent.toLowerCase()).indexOf("android") > -1;
			if (width<=761) {
				this.props.m.device.isMobile = true;
				this.props.m.device.isTablet = false;
				this.props.m.device.isHandlehand = true;
				this.props.m.device.isDesktop = false;
			} else if (width<=999) {
				this.props.m.device.isMobile = false;
				this.props.m.device.isTablet = true;
				this.props.m.device.isHandlehand = true;
				this.props.m.device.isDesktop = false;
			} else {
				this.props.m.device.isMobile = false;
				this.props.m.device.isTablet = false;
				this.props.m.device.isHandlehand = false;
				this.props.m.device.isDesktop = true;
			}
			this.props.m.device.retina = Math.round(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
			if (this.props.m.device.retina>3) this.props.m.device.retina = 3;
		}
		if (this.needChange) {
			this.needChange = false;
			this.forceUpdate();
		}
		var m = this.props.m;
		if (m) {
			var at = m.currentBlockNumberAt;
			var duration = (m.settings.misc.checkNewBlockEachSeconds||0)*1000;
			if (at && duration>0 && (Date.now() - at > duration)) {
				this.api.getCurrentBlockNumber();
			}
		}
		requestAnimationFrame(()=>this.onRAF());
	}
	render() {
		var m = Object.assign({}, this.props.m);
		m.api = this.api;
		var spread = {m};
		var Page;
		if (!Page) { // for any users - via url
			// if (m.path.contains["verify-email"] || m.path.contains["start"]) Page = PageStart;
			if (m.path.contains["forgot2fa"]) Page = PageForgot2FA;
			if (m.path.contains["reset-password"]) Page = PageResetPassword;
			if (m.path.contains["verify-email"]) Page = PageVerifyEmail;
			if (m.path.contains["early-access"]) Page = PageEA;
		}
		if (!Page && m.settings.misc.showPagesList) { // for demo
			if (m.path.contains["signup"]) Page = PageSignUp;
			if (m.path.contains["set2fa"]) {
				Page = PageSet2FA;
			}
			if (m.path.contains["signin"]) Page = PageSignIn;
		}
		if (!Page) { // signin for anonymous
			// if (!m.auth || !m.auth.signedIn) {
				if (m.path.contains["signup"]) Page = PageSignUp;
				if (m.path.contains["set2fa"]) Page = PageSet2FA;
				if (m.path.contains["signin"]) Page = PageSignIn;
			// }
		}
		if (!Page) { // for authorized users...
			if (m.auth && m.auth.signedIn || m.settings.misc.showPagesList) {
				var toWallet = false;
				var toSettings = false;
				// ...via url...
				if (m.path.contains["wallets"]) {
					toWallet = true;
				}
				if (m.path.contains["settings"]) {
					toSettings = true;
				}
				// ...or via settings.json
				if (!toWallet || !toSettings) {
					if (!m.settings.misc.showPagesList) {
						if (m.settings.misc.startPage.indexOf("wallets")>-1) {
							toWallet = true;
						}
						if (m.settings.misc.startPage.indexOf("settings")>-1) {
							toSettings = true;
						}
					}
				}
				if (toWallet) {
					Page = PageWallets;
					if (m.path.order.length>3) {
						spread.tab = m.path.order[3];
					}
					if (m.path.order.length>2) {
						spread.walletId = m.path.order[2];
					}
				}
				if (toSettings) {
					Page = PageSettings;
				}
			}
		}
		if (!Page || m.logoutInProgress) { // for anonymous (start or signin)
			if (m.settings.misc.showPagesList) {
				Page = PageEA;
			} else {
				Page = PageStart;
			}
		}
		return <Page {...spread}></Page>;
	}
	parsePath(pathname, search) {
		var path;
		if (pathname) {
			path = pathname;
		} else if (this.props.m.settings.misc.pathViaHash) {
			path = (pathname || window.location.hash).substr(1);
		} else {
			path = (pathname || window.location.pathname).substr(1);
		}
		var ret = {
			contains: {},
			order: path.split('/'),
			search: {},
		};
		if (!path.length) {
			ret.contains.root = true;
		}
		ret.order.forEach(function(v){
			ret.contains[v] = true;
		});
		var search = (search || window.location.search).substr(1);
		search.split('&').forEach(pair=>{
			ret.search[pair.split('=')[0]] = pair.split('=')[1];
		});
		return ret;
	}
}

export default App;
