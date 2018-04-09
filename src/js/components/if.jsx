import React from 'react';
import Any from '../any.jsx';

class If extends Any {
	render(p,s,c,m) {
		return p.v ? c : null;
	}
}

export default If;
