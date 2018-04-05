import React from 'react';
import Any from '../any.jsx';

class A extends Any {
	render(p,s,c,m) {
		var href = p.href;
		if (!p.external && m.settings.misc.pathViaHash) {
			if (href=="/") {
				href = "#"
			} else {
				href = "#" + href;
			}
		}
		var also = {};
		var cls = p.className || "";
		if (p.external) {
			also.target = "_blank";
			cls += " external";
		}
		return <a href={href} className={cls} style={p.style} {...also}>{c}</a>;
	}
}

A.propTypes = {
	href: Any.PropTypes.string,
	external: Any.PropTypes.bool
};

export default A;
