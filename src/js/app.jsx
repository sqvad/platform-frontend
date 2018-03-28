import React from 'react';

class App extends React.Component {
	componentWillMount() {
		this.props.m.on('change', ()=>{
			this.needChange = true;
		});
	}
	componentWillUnmount() {
		this.deprecated = true;
	}
	onRAF() {
		if (this.deprecated) return;
		if (this.href!=window.location.href) {
			this.href = window.location.href;
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
		}
		if (this.needChange) {
			this.needChange = false;
			this.forceUpdate();
		}
		requestAnimationFrame(()=>this.onRAF());
	}
	render() {
		var m = this.props.m;
		var path = this.parsePath();
		return <div>jsx</div>;
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
