import React from 'react';
import Input from './input-base.jsx';

class InputTxAdr extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = "E.g. 0xe2c60f3F5880E0F905537D459270c0f3c02d5f";
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
		input._onInvalid.call(this, valid, validOld, input, "Address is invalid", this.defaultHint);
	}
	checkValid(txAdr) {
		return window.Web3.prototype.isAddress(txAdr||'');
	}
}

InputTxAdr.defaultProps = {
	name: "txAdr",
	type: "text",
	placeholder: "TX address",
};

export default InputTxAdr;
