import React from 'react';
import Any from '../any.jsx';
import Headers from './headers.jsx';

class Page extends Any {
	componentWillMount() {
		super.componentWillMount();
		this.onAnyClick = this.onAnyClick.bind(this);
	}
	render(p,s,c,m) {
		var pagePostfix = this.pagePostfix || p.pagePostfix || s.pagePostfix;
		var device = [
			(pagePostfix ? "page-"+pagePostfix : ""),
			(m.device.isMobile ? "" : "no-") + "mobile",
			(m.device.isTablet ? "" : "no-") + "tablet",
			(m.device.isHandlehand ? "" : "no-") + "handlehand",
			(m.device.isDesktop ? "" : "no-") + "desktop",
		].join(" ").replace(/\s+/g, " ");
		var header = null;
		if (p.header=="short") {
			header = <Headers.Short m={m} />;
		}
		return <div className={device}>{header}<div className="container">
			<div className="width page" onClick={this.onAnyClick}>{c}</div>
		</div></div>;
	}
};

Page.propTypes = {
	pagePostfix: Any.PropTypes.string,
	header: Any.PropTypes.oneOf([
		"none",
		"short",
	])
};

export default Page;
