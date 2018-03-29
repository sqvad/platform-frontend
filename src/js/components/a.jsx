import React from 'react';
import Any from '../any.jsx';

class A extends Any {
	render(p,s,c,m) {
		var href = p.href;
		if (m.settings.misc.pathViaHash) {
			if (href=="/") {
				href = "#"
			} else {
				href = "#" + href;
			}
		}
		return <a href={href} className={p.className}>{c}</a>;
	}
}

A.propTypes = {
	href: Any.PropTypes.string,
	external: Any.PropTypes.bool
};

export default A;
