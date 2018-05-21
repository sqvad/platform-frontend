import React from 'react';
import Input from './input-base.jsx';

class InputPassword extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = this.getHint(props.value);
		this.setState({
			onValid: this.onValid.bind(this),
			onInvalid: this.onInvalid.bind(this),
			checkValid: this.checkValid.bind(this),
			hint: props.hint || this.defaultHint
		});
	}
	getHint(value) {
		value = (value || "")+"";
		var groups = this.haveGroups(value);
		var ret = "";
		if (value.length<10) {
			ret += "Password of at least 10 characters";
		}
		if (!groups.haveAll) {
			if (value.length<10) {
				ret +=", i";
			} else {
				ret += "I";
			}
			ret += "ncluding";
			var dfa = [];
			if (!groups.haveUpper) dfa.push("uppercase letter");
			if (!groups.haveLower) dfa.push("lowercase letter");
			if (!groups.haveNumber) dfa.push("number");
			if (!groups.haveSpecial) dfa.push("special symbol");
			if (dfa.length>1) {
				ret += ":";
			}
			ret += " ";
			ret += dfa.join(", ");
		}
		ret += "."
		return ret;
	}
	haveGroups(value) {
		value = (value || "")+"";
		var haveUpper = false;
		var haveLower = false;
		var haveNumber = false;
		var haveSpecial = false;
		for (var i=0, l=value.length; i<l; i++) {
			var v = value.charAt(i);
			if (/[A-Z]/.test(v)) {
				haveUpper = true;
			} else if (/[a-z]/.test(v)) {
				haveLower = true;
			} else if (/[0-9]/.test(v)) {
				haveNumber = true;
			} else if (v!=" ") {
				haveSpecial = true;
			}
		}
		return {
			haveUpper, haveLower, haveNumber, haveSpecial,
			haveAll: haveUpper&&haveLower&&haveNumber&&haveSpecial
		};
	}
	render(p,s,c,m) {
		var type = "password";
		var hint = p.hint || this.getHint(s.value || p.value);
		return <Input {...p} {...p} {...s} m={m} type={type} />;
	}
	onValid(valid, validOld, input) {
		input._onValid.call(this, valid, validOld, input);
	}
	onInvalid(valid, validOld, input) {
		input._onInvalid.call(this, valid, validOld, input, this.getHint(input.node.value), this.getHint(input.node.value));
	}
	checkValid(str) {
		return this.haveGroups(str).haveAll;
	}
}

InputPassword.defaultProps = {
	name: "password",
	type: "password",
	placeholder: "Password",
};

export default InputPassword;
