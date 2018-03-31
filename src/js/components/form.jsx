import React from 'react';
import Any from '../any.jsx';

class Form extends Any {
	componentWillMount() {
		super.componentWillMount();
	}
	componentDidMount() {
		this.onSubmit = this.props.onSubmit.bind(this);
	}
	render(p,s,c,m) {
		return <form onSubmit={this.onSubmit}><div>{c}</div></form>
	}
}

export default Form;
