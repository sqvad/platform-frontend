import React from 'react';
import Input from './input-base.jsx';

class InputPassword extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = "Password of at least 10 characters";
		this.setState({
			onValid: this.onValid.bind(this),
			onInvalid: this.onInvalid.bind(this),
			checkValid: this.checkValid.bind(this),
			hint: props.hint || this.defaultHint
		});
	}
	render(p,s,c,m) {
		var type = "password";
		return <Input {...p} {...p} {...s} m={m} type={type} />;
	}
	onValid(valid, validOld, input) {
		input._onValid.call(this, valid, validOld, input);
	}
	onInvalid(valid, validOld, input) {
		input._onInvalid.call(this, valid, validOld, input, this.defaultHint, this.defaultHint);
	}
	checkValid(str) {
		return str.length>=10;
	}
}

InputPassword.defaultProps = {
	name: "password",
	type: "password",
	placeholder: "PASSWORD",
};

export default InputPassword;
