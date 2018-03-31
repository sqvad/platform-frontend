import React from 'react';
import Any from '../any.jsx';

class Input extends Any {
	constructor(props) {
		super(props);
		this.valid = props.valid;
	}
	render(p,s,c,m) {
		var cls = 'form-control';
		var hint = p.hint || null;
		var inputGFroupCls = p.noInputGroup ? "" : "input-group";
		if (p.hasError) inputGFroupCls += " has-danger";
		if (p.inputGroupCls) inputGFroupCls += " "+p.inputGroupCls;
		var input = <input
			type={(p.type||'text')}
			name={p.name}
			value={p.value}
			className={cls}
			placeholder={p.placeholder}
			disabled={p.disabled||false}
			readOnly={p.readonly||false}
			onChange={this.onChange.bind(this)}
			onFocus={p.onFocus}
			onBlur={p.onBlur}
			ref={(el=>this.node=el)} />;
		if (hint || p.hasError || p.inputGroupCls) {
			return <div className={inputGFroupCls}>
				{input}
				{hint}
			</div>;
		} else {
			return input;
		}
	}
	componentDidMount() {
		if (this.node && this.props.autofocus) {
			if (!this.props.m.device.isMobile) {
				this.node.focus();
			}
		}
	}
	onChange() {
		var p = this.props;
		var v = this.node.value+'';
		var valid;
		var validOld = this.valid;
		if (p.checkValid) {
			valid = p.checkValid(v);
		}
		if (valid && p.regexp && !p.regexp.test(v)) {
			valid = false;
		}
		if (valid!==validOld) {
			this.valid = valid;
			if (valid) {
				if (p.onValid) p.onValid(valid, validOld);
			} else {
				if (p.onInvalid) p.onInvalid(valid, validOld);

			}
		}
		if (p.onChange) {
			p.onChange(v, valid, validOld);
		}
	}
}
Input.propTypes = {
	type: Any.PropTypes.string,
	name: Any.PropTypes.string,
	value: Any.PropTypes.oneOfType([
		Any.PropTypes.string,
		Any.PropTypes.number
	]),
	hasError: Any.PropTypes.bool,
	hint: Any.PropTypes.oneOfType([
		Any.PropTypes.string,
		Any.PropTypes.number,
	]),
	noInputGroup: Any.PropTypes.bool,
	checkValid: Any.PropTypes.func,
	onValid: Any.PropTypes.func,
	onInvalid: Any.PropTypes.func,
	placeholder: Any.PropTypes.string,
	autofocus: Any.PropTypes.bool,
	onChange: Any.PropTypes.func,
	onFocus: Any.PropTypes.func,
	onBlur: Any.PropTypes.func,
};

export default Input;
