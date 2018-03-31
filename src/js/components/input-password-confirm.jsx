import React from 'react';
import Input from './input-base.jsx';

class InputPasswordConfirm extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = "As previous field";
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
		input._onInvalid.call(this, valid, validOld, input, "Not match", this.defaultHint);
	}
	checkValid(str) {
		return str==this.props.password;
	}
}

InputPasswordConfirm.defaultProps = {
	name: "password-confirm",
	type: "password",
	placeholder: "CONFIRM PASSWORD",
};

export default InputPasswordConfirm;
