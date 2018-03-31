import React from 'react';
import Input from './input-base.jsx';

class InputEmail extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = "E.g. mymail@gmail.com";
		this.setState({
			onValid: this.onValid.bind(this),
			onInvalid: this.onInvalid.bind(this),
			checkValid: this.checkValid.bind(this),
			hint: props.hint || this.defaultHint
		});
	}
	render(p,s,c,m) {
		return <Input {...p} {...s} m={m} />;
	}
	onValid(valid, validOld, input) {
		input._onValid.call(this, valid, validOld, input);
	}
	onInvalid(valid, validOld, input) {
		input._onInvalid.call(this, valid, validOld, input, "Email is invalid", this.defaultHint);
	}
	checkValid(email) {
		var email = (email||'').trim();
		var example = 'a@1.ua';
		if (email.length<example.length) return false;
		if (email.indexOf('@')<example.indexOf('@')) return false;
		if (email.indexOf('.',email.indexOf('@'))<example.indexOf('.')) return false;
		return true;
	}
}

InputEmail.defaultProps = {
	name: "email",
	type: "email",
	placeholder: "EMAIL",
};

export default InputEmail;
