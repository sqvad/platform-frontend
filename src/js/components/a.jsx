import React from 'react';
import Any from '../any.jsx';

class A extends Any {
	render(p,s,c,m) {
		var href = A.href(p,m);
		var also = {};
		var cls = p.className || "";
		if (p.external) {
			also.target = "_blank";
			cls += " external";
		}
		if (p.onClick) {
			if (!p.href) {
				also.onClick = (e)=>{
					if (e && e.preventDefault) e.preventDefault();
					p.onClick(e);
				}
			} else {
				also.onClick = p.onClick;
			}
		}
		return <a href={href} className={cls} style={p.style} {...also}>{c}</a>;
	}
}

A.href = function(p,m) {
	var href = p.href;
	if (!p.external && m.settings.misc.pathViaHash) {
		if (href=="/") {
			href = "#"
		} else {
			href = "#" + href;
		}
	}
	return href;
}

A.propTypes = {
	href: Any.PropTypes.string,
	external: Any.PropTypes.bool
};

export default A;
