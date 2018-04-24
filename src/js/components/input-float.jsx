import React from 'react';
import Input from './input-base.jsx';
import Currency from './currency.jsx';
import BigNumber from 'bignumber.js';

var bn = x => new BigNumber(x);

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
		if (!(exampleNum && exampleNum.isBigNumber) && typeof exampleNum != typeof 42) exampleNum = 12.34;
		var ret = "";
		if ('defaultHint' in props) {
			ret = props.defaultHint;
		} else {
			ret = "E.g. ";
			var useMin = typeof props.min == typeof 42 || props.min && props.min.isBigNumber;
			var useMax = typeof props.max == typeof 42 || props.max && props.max.isBigNumber;
			var min = props.min;
			var max = props.max;
			var minIsZero = min==0;
			var half = (min + (max - min)/2).toFixed(2);
			var minOrExampleNum = Math.max(min, exampleNum);
			var maxOrExampleNum = Math.min(max, exampleNum);
			if (props.bn) {
				exampleNum = bn(exampleNum);
				min = bn(props.min);
				max = bn(props.max);
				minIsZero = min.isZero();
				half = min.plus( max.minus(min).div(bn(2)) );
				minOrExampleNum = min.greaterThan(exampleNum) ? min : exampleNum;
				maxOrExampleNum = max.lessThan(exampleNum) ? max : exampleNum;
				var format = (v)=>Currency._2number(v, !props.isUsd);
				exampleNum = format(exampleNum);
				min = format(min);
				max = format(max);
				half = format(half);
				minOrExampleNum = format(minOrExampleNum);
				maxOrExampleNum = format(maxOrExampleNum);
			}
			var onlyPositive = minIsZero && props.aboveMin;
			if (useMin && useMax) {
				ret += half
				if (onlyPositive) {
					ret += ` (positive, `;
				} else if (props.aboveMin) {
					ret += ` (above the ${min}, `;
				} else {
					ret += ` (minimum is ${min}, `;
				}
				if (props.belowMax) {
					ret += ` below the ${max})`;
				} else {
					ret += ` maximum is ${max})`;
				}
			} else if (useMin) {
				ret += `${minOrExampleNum} `;
				if (onlyPositive) {
					ret += `(only positive)`;
				} else {
					ret += `(${props.aboveMin?"above the":"minimum is"} ${min})`;
				}
			} else if (useMax) {
				ret += `${maxOrExampleNum} (${props.belowMax?"below the":"maximum is"} ${max})`;
			} else {
				ret += exampleNum;
			}
		}
		return ret;
	}
	render(p,s,c,m) {
		var hint = p.hint || this.formatDefaultHint(p, p.exampleNum);
		return <Input {...p} {...s} hint={hint} max="100" m={m} />;
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
		if (this.props.bn) {
			return this.checkValidViaBN(str, falseIsValid);
		} else {
			return this.checkValidViaFloat(str, falseIsValid);
		}
	}
	checkValidViaBN(str, falseIsValid) {
		var num;
		var isNum = false;
		try {
			num = bn(str);
			isNum = this.checkValidViaBN_isNaN(num);
		} catch(er) {}
		if (!isNum) return falseIsValid ? 10 : false;
		if (!this.checkValidViaBN_min(num)) return falseIsValid ? 20 : false;
		if (!this.checkValidViaBN_max(num)) return falseIsValid ? 30 : false;
		return !falseIsValid;
	}
	checkValidViaBN_isNaN(num) {
		return !num.isNaN() && num.isFinite();
	}
	checkValidViaBN_min(num) {
		var min = this.props.min;
		if (typeof min == typeof 42) {
			min = bn(min);
		} else if (min && max.isBigNumber) {
		} else {
			return true;
		}
		return this.props.aboveMin ? num.greaterThan(min) : num.greaterThanOrEqualTo(min);
	}
	checkValidViaBN_max(num) {
		var max = this.props.max;
		if (typeof max == typeof 42) {
			max = bn(max);
		} else if (max && max.isBigNumber) {
		} else {
			return true;
		}
		return this.props.belowMax ? num.lessThan(max) : num.lessThanOrEqualTo(max);
	}
	checkValidViaFloat(str, falseIsValid) {
		var num = parseFloat(str);
		if (!this.checkValidViaFloat_isNaN(num)) return falseIsValid ? 10 : false;
		if (!this.checkValidViaFloat_min(num)) return falseIsValid ? 20 : false;
		if (!this.checkValidViaFloat_max(num)) return falseIsValid ? 30 : false;
		return !falseIsValid;
	}
	checkValidViaFloat_isNaN(num) {
		return typeof num == 'number' && !isNaN(num);
	}
	checkValidViaFloat_min(num) {
		var min = this.props.min;
		if (typeof max != typeof 42) return true;
		return this.props.aboveMin ? num > min : num >= min;
	}
	checkValidViaFloat_max(num) {
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
