import React from 'react';
import Input from './input-base.jsx';

class InputFloat extends Input {
	constructor(props) {
		super(props);
		this.defaultHint = this.formatDefaultHint(props, props.exampleNum);
		this.setState({
			onValid: this.onValid.bind(this),
			onInvalid: this.onInvalid.bind(this),
			checkValid: this.checkValid.bind(this),
			hint: props.hint || this.defaultHint
		});
	}
	formatDefaultHint(props, exampleNum) {
		if (typeof exampleNum != typeof 42) exampleNum = 12.34;
		var ret = "";
		if ('defaultHint' in props) {
			ret = props.defaultHint;
		} else {
			ret = "E.g. ";
			var useMin = typeof props.min == typeof 42;
			var useMax = typeof props.max == typeof 42;
			var onlyPositive = props.min==0 && props.aboveMin;
			if (useMin && useMax) {
				ret += (props.min+(props.max-props.min)/2).toFixed(2);
				if (onlyPositive) {
					ret += ` (positive, `;
				} else if (props.aboveMin) {
					ret += ` (above the ${props.min}, `;
				} else {
					ret += ` (minimum is ${props.min}, `;
				}
				if (props.belowMax) {
					ret += ` below the ${props.max})`;
				} else {
					ret += ` maximum is ${props.max})`;
				}
			} else if (useMin) {
				ret += `${Math.max(props.min, exampleNum)} `;
				if (onlyPositive) {
					ret += `(only positive)`;
				} else {
					ret += `(${props.aboveMin?"above the":"minimum is"} ${props.min})`;
				}
			} else if (useMax) {
				ret += `${Math.min(props.max, exampleNum)} (${props.belowMax?"below the":"maximum is"} ${props.max})`;
			} else {
				ret += exampleNum;
			}
		}
		return ret;
	}
	render(p,s,c,m) {
		return <Input {...p} {...s} m={m} />;
	}
	onValid(valid, validOld, input) {
		input._onValid.call(this, valid, validOld, input);
	}
	onInvalid(valid, validOld, input, v) {
		var error = {
			"10": "Is not a number",
			"20": "Minimum is "+ this.props.min,
			"30": "Maximum is "+ this.props.max,
		}[this.checkValid(v, true)];
		input._onInvalid.call(this, valid, validOld, input, error, this.defaultHint, v);
	}
	checkValid(str, falseIsValid) {
		var num = parseFloat(str);
		if (!this.checkValid_isNaN(num)) return falseIsValid ? 10 : false;
		if (!this.checkValid_min(num)) return falseIsValid ? 20 : false;
		if (!this.checkValid_max(num)) return falseIsValid ? 30 : false;
		return !falseIsValid;
	}
	checkValid_isNaN(num) {
		return !isNaN(num);
	}
	checkValid_min(num) {
		var min = this.props.min;
		if (typeof min != typeof 42) return true;
		return this.props.aboveMin ? num > min : num >= min;
	}
	checkValid_max(num) {
		var max = this.props.max;
		if (typeof max != typeof 42) return true;
		return this.props.belowMax ? num < max : num <= max;
	}
}

InputFloat.defaultProps = {
	regexpRemove: [
		// { r:/,/, v:"." },
		{ r:/[^0-9\.-]/g, v:"" },
		{ r:/\.{2,}/g, v:"."},
		{ r:/(\..*)\./g, v:"$1"},
		{ r:/^\./, v:"0."},
		{ r:/^0([0-9])/, v:"$1" },
	],
	type: "text",
	placeholder: "",
};

export default InputFloat;
