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
		return <div className={device} onClick={this.onAnyClick}>{c}</div>;
	}
}

Page.PageWrapWidth = PageWrapWidth;
Page.PageWrapHeader = PageWrapHeader;
Page.PageWrapDevice = PageWrapDevice;

Page.propTypes = {
	pagePostfix: Any.PropTypes.string,
	header: Any.PropTypes.oneOf([
		"none",
		"short",
	])
};

export default Page;
