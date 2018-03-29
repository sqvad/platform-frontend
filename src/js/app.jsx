import React from 'react';
import Api from './api.js';
import PageEmpty from './pages/page-empty.jsx';

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
		this.onRAF();
	}
	componentWillUnmount() {
		this.deprecated = true;
	}
	onRAF() {
		if (this.deprecated) return;
		if (this.href!=window.location.href) {
			this.href = window.location.href;
			this.props.m.path = this.parsePath();
			this.needChange = true;
		}
		var width = window.innerWidth || document.body.clientWidth;
		if (width!=this.widthPrev) {
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
		requestAnimationFrame(()=>this.onRAF());
	}
	render() {
		// if (!this.props.m.path) this.onRAF();
		var m = Object.assign({}, this.props.m);
		m.api = this.api;
		var spread = {m};
		var Page;
		// @todo dispatch
		if (!Page) Page = PageEmpty;
		return <Page {...spread}>jsx</Page>;
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
