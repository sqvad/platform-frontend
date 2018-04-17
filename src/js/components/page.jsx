import React from 'react';
import Any from '../any.jsx';
import Headers from './headers.jsx';

class Page extends Any {
	render(p,s,c,m) {
		return <PageWrapDevice m={m} {...p}>
			<PageWrapHeader key="header" m={m} {...p} />
			<PageWrapWidth key="width" m={m} {...p} />
		</PageWrapDevice>;
	}
};

class PageWrapWidth extends Any {
	render(p,s,c,m) {
		return <div className="container"><div className="width">{c}</div></div>;
	}
}
class PageWrapHeader extends Any {
	render(p,s,c,m) {
		if (p.header=="short") {
			return <Headers.Short m={m}>{c}</Headers.Short>;
		}
		if (p.header=="medium") {
			return <Headers.Medium m={m}>{c}</Headers.Medium>;
		}
		return null;
	}
}
class PageWrapDevice extends Any {
	componentWillMount() {
		super.componentWillMount();
		this.onAnyClick = this.onAnyClick.bind(this);
	}
	render(p,s,c,m) {
		var pagePostfix = p.pagePostfix || s.pagePostfix;
		var device = [
			(pagePostfix ? "page-"+pagePostfix : ""),
			(m.device.isMobile ? "" : "no-") + "mobile",
			(m.device.isTablet ? "" : "no-") + "tablet",
			(m.device.isHandlehand ? "" : "no-") + "handlehand",
			(m.device.isDesktop ? "" : "no-") + "desktop",
			"retina-" + m.device.retina,
		].join(" ").replace(/\s+/g, " ");
		return <div className={device} onClick={this.onAnyClick}>{c}{p.popup}</div>;
	}
}
class PageWrapProfile extends Any {
	render(p,s,c,m) {
		var cls = "d-flex";
		if (m.device.isMobile) {
			cls = "d-flex flex-column";
		}
		return <div className={cls} style={{minHeight:"100%"}}>
			{c}
		</div>;
	}
}
class PageWrapProfileLeft extends Any {
	render(p,s,c,m) {
		return <div className="d-flex profile-left-menu bg-violet" style={{boxShadow:"0 0 20px rgba(0, 0, 0, 0.23)", zIndex:1}}>
			{c}
		</div>;
	}
}
class PageWrapProfileWidth extends Any {
	render(p,s,c,m) {
		return <div className="w-100">
			{!p.skipLogo?<div className="profile-logo"></div>:null}
			<div className="profile-center" key="profile-center">
				{c}
			</div>
		</div>;
	}
}

Page.PageWrapWidth = PageWrapWidth;
Page.PageWrapHeader = PageWrapHeader;
Page.PageWrapDevice = PageWrapDevice;
Page.PageWrapProfile = PageWrapProfile;
Page.PageWrapProfileLeft = PageWrapProfileLeft;
Page.PageWrapProfileWidth = PageWrapProfileWidth;

Page.propTypes = {
	pagePostfix: Any.PropTypes.string,
	header: Any.PropTypes.oneOf([
		"none",
		"short",
	])
};

export default Page;
