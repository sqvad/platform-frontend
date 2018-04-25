import React from 'react';
import Any from '../any.jsx';

class Input extends Any {
	constructor(props) {
		super(props);
		this.valid = props.valid;
		this.setState({
			focused: false,
			wasBlurred: 'wasBlurred' in props ? props.wasBlurred : false,
			wasChanged: 'wasChanged' in props ? props.wasChanged : false,
			errorViaRequied: false
		});
	}
	render(p,s,c,m) {
		var cls = 'form-control';
		var hint = p.hint || null;
		if (s.errorViaRequied) {
			hint = "This field is required";
		}
		var inputGroupCls = "input-group with-placeholder";
		if (p.hasError || s.errorViaRequied) inputGroupCls += " has-danger";
		if (p.inputGroupCls) inputGroupCls += " "+p.inputGroupCls;
		var haveValue = p.value && (p.value.length!=0);
		var haveFocus = s.focused;
		var placeholderToUp = haveValue || haveFocus;
		inputGroupCls += haveValue ? " filled" : " empty";
		if (haveFocus) inputGroupCls += " focused";
		if (placeholderToUp) inputGroupCls += " placeholder-to-up";
		var input = <input
			type={(p.type||'text')}
			name={p.name}
			value={p.value} minLength={p.minLength||p.min||"0"} maxLength={p.maxLength||p.max||"99999"}
			className={cls}
			disabled={p.disabled||false}
			readOnly={p.readonly||false}
			onChange={this.onChange.bind(this)}
			onFocus={this.onFocus.bind(this)}
			onBlur={this.onBlur.bind(this)}
			ref={(el=>this.node=el)} />;
		var hintWrapped = p.hintWrapped ? hint : <span className="input-hint">{hint}</span>;
		return <label className={inputGroupCls}>
			{input}
			<span className="placeholder">{p.placeholder}</span>
			{hintWrapped}
		</label>;
	}
	componentDidMount() {
		if (this.node && this.props.autofocus) {
			if (!this.props.m.device.isMobile) {
				this.node.focus();
				this.onFocus();
			}
		}
	}
	onFocus() {
		this.setState({focused:true,errorViaRequied:false}, ()=>{
			if (this.props.onFocus) this.props.onFocus();
			var p = this.props;
			if (this.valid) {
				if (p.onValid) p.onValid(this.valid, this.valid, this);
			} else {
				if (p.onInvalid) p.onInvalid(this.valid, this.valid, this, p.value);
			}
			this.forceUpdate();
		});
	}
	onBlur() {
		var errorViaRequied = this.props.required && (this.props.value||"")=="";
		this.setState({focused:false,wasBlurred:true,errorViaRequied}, ()=>{
			if (this.props.value!="" && this.state.wasChanged && !this.valid) {
				if (this.props.onInvalid) this.props.onInvalid(this.valid, this.valid, this, this.props.value);
			} else if (this.props.value=="" && !errorViaRequied) {
				if (this.props.onValid) this.props.onValid(this.valid, this.valid, this);
			}
			if (this.props.onBlur) this.props.onBlur(this.node.value||'', this.valid, this, this, this.props.value);
			this.forceUpdate();
		});
	}
	onChange() {
		var p = this.props;
		var v = this.node.value||'';
		if (p.regexpRemove) {
			var regexpRemove;
			if (Array.isArray(p.regexpRemove)) {
				regexpRemove = p.regexpRemove;
			} else {
				regexpRemove = [p.regexpRemove];
			}
			v = regexpRemove.reduce((s,v)=>{
				var reg = v.r || v;
				var to = ('v' in v) ? v.v : '';
				return s.replace(reg, to);
			},v);
		}
		var valid;
		var validOld = this.valid;
		if (p.checkValid) {
			valid = p.checkValid(v);
		}
		this.valid = valid;
		if (valid) {
			if (p.onValid) p.onValid(valid, validOld, this);
		} else {
			if (p.onInvalid) p.onInvalid(valid, validOld, this, v);
		}
		if (p.onChange) {
			p.onChange(v, valid, validOld, this);
		}
		this.setState({wasChanged:true});
	}
	_onValid(valid, validOld, input) {
		this.setState({
			hint: this.props.hint || (input.props.value||"")=="" ? this.defaultHint : null,
			hasError: this.props.hasError
		},()=>{this.forceUpdate()});
		if (this.props.onValid) this.props.onValid(valid, validOld, input);
	}
	_onInvalid(valid, validOld, input, errorHint, defaultHint, value) {
		if (input.state.wasBlurred) {
			if (input.state.focused && (input.props.value||"")=="") {
				this.setState({hint:defaultHint,hasError:false},()=>{this.forceUpdate()});
			} else {
				this.setState({hint:errorHint,hasError:true},()=>{this.forceUpdate()});
			}
		}
		if (this.props.onInvalid) this.props.onInvalid(valid, validOld, input, value);
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
		Any.PropTypes.element,
	]),
	hintWrapped: Any.PropTypes.bool,
	checkValid: Any.PropTypes.func,
	required: Any.PropTypes.bool,
	onValid: Any.PropTypes.func,
	onInvalid: Any.PropTypes.func,
	placeholder: Any.PropTypes.string,
	autofocus: Any.PropTypes.bool,
	onChange: Any.PropTypes.func,
	onFocus: Any.PropTypes.func,
	onBlur: Any.PropTypes.func,
	regexp: Any.PropTypes.instanceOf(RegExp),
	regexpRemove: Any.PropTypes.oneOfType([
	Any.PropTypes.oneOfType([
		Any.PropTypes.instanceOf(RegExp),
		Any.PropTypes.shape({
			r: Any.PropTypes.instanceOf(RegExp),
			v: Any.PropTypes.string,
		})
	]),
	Any.PropTypes.arrayOf(
		Any.PropTypes.oneOfType([
			Any.PropTypes.instanceOf(RegExp),
			Any.PropTypes.shape({
				r: Any.PropTypes.instanceOf(RegExp),
				v: Any.PropTypes.string,
			})
		])
	),
]),
};

export default Input;
