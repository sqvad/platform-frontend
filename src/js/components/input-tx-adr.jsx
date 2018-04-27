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
		var style = {};
		if (m && m.device.isMobile) {
			style = {
				fontSize: "0.73em",
				paddingLeft: "3px",
				paddingRight: "3px",
			};
		}
		var hint = p.hint || this.defaultHint;
		if (!this.fullValid && this.avaible) {
			hint = <span className="input-hint" style={{color:"orange"}}>Wrong control sum</span>;
			return <Input {...p} {...s} m={m} hint={hint} inputStyle={style} hintWrapped={true} />;
		} else {
			if (m && m.device.isMobile) {
				hint = <span className="input-hint" style={{fontSize:"0.75em"}}>{hint}</span>;
				return <Input {...p} {...s} m={m} hint={hint} inputStyle={style} hintWrapped={true} />;
			} else {
				return <Input {...p} {...s} m={m} hint={hint} inputStyle={style} />;
			}
		}
	}
	onValid(valid, validOld, input) {
		input._onValid.call(this, valid, validOld, input);
	}
	onInvalid(valid, validOld, input) {
		input._onInvalid.call(this, valid, validOld, input, "Address is invalid", this.defaultHint);
	}
	checkValid(txAdr) {
		txAdr = txAdr || "";
		var avaible = false;
		if (txAdr.toLowerCase().indexOf("0x")==0) {
			avaible = txAdr.length == 42;
		} else {
			avaible = txAdr.length == 40;
		}
		this.avaible = avaible;
		this.fullValid = window.Web3.prototype.isAddress(txAdr);
		return this.fullValid || this.avaible;
	}
}

InputTxAdr.defaultProps = {
	name: "txAdr",
	type: "text",
	placeholder: "TX address",
};

export default InputTxAdr;
