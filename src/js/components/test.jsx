import React from 'react';
import Any from '../any.jsx';

class Test extends Any {
	render(p,s,c,m) {
		return <span>works?{c}</span>;
	}
}

export default Test;
