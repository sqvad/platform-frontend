import React from 'react';
import Any from '../any.jsx';

class Page extends Any {
	componentWillMount() {
		super.componentWillMount();
		this.onAnyClick = this.onAnyClick.bind(this);
	}
	render(p,s,c,m) {
		var pagePostfix = this.pagePostfix || p.pagePostfix || s.pagePostfix;
		var cls = [
			"width page",
			(pagePostfix ? "page-"+pagePostfix : ""),
			(m.device.isMobile ? "" : "no-") + "mobile",
			(m.device.isTablet ? "" : "no-") + "tablet",
			(m.device.isHandlehand ? "" : "no-") + "handlehand",
			(m.device.isDesktop ? "" : "no-") + "desktop",
		].join(" ").replace(/\s+/g, " ");
		return <div className="container"><div
				className={cls}
				onClick={this.onAnyClick}
			>{c}</div></div>;
	}
};

Page.propTypes = {
	pagePostfix: Any.PropTypes.string
};

export default Page;
