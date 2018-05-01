/*
import React from 'react';
import Any from '../any.jsx';

class Select extends Any {
	render(p,s,c,m) {
		var select = this.renderViaSelect(p,s,c,m);
		if (p.useFormControl) {
			return this.renderWrap(p,s,select,m);
		} else {
			return select;
		}
	}
	renderWrap(p,s,c,m) {
		var haveValue = p.value && (p.value.length!=0);
		var inputGroupCls = "input-group input-group-with-select with-placeholder";
		inputGroupCls += haveValue ? " filled placeholder-to-up" : " empty";
		if (s.focused) inputGroupCls += " focused";
		if (p.hasError || s.errorViaRequied) inputGroupCls += " has-danger";
		if (p.inputGroupCls) inputGroupCls += " "+ p.inputGroupCls;
		var hint = p.hint || null;
		if (s.errorViaRequied) {
			hint = "This field is required";
		}
		return <label className={inputGroupCls}>
			<span className="placeholder">{p.placeholder}</span>
			{c}
			<span className="input-hint">{hint}</span>
		</label>;
	}
	renderViaSelect(p,s,c,m) {
		var cls;
		if (p.className) {
			cls = p.className;
		} else {
			cls = "";
		}
		cls += " selectpicker";
		var options = p.options.slice(0);
		if (p.placeholderOnFocus && s.focused) {
			options.unshift({value:"#placeholder#",text:p.placeholderOnFocus});
		} else if (p.placeholder && !p.useFormControl) {
			options.unshift({value:"#placeholder#",text:p.placeholder});
		} else if (p.useFormControl) {
			options.unshift({value:"#placeholder#",text:""});
		}
		var _p = JSON.parse(JSON.stringify(p));
		delete _p.useFormControl;
		delete _p.options;
		delete _p.placeholderOnFocus;
		delete _p.inputGroupCls;
		return <select
			{..._p} ref={el=>setTimeout(()=>$(el).selectpicker({size:4}),10)}
			className={cls}
			value={p.value} onChange={this.onChangeViaSelect.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
		>
			{options.map((v,i)=>{
				return <option key={"option"+i} value={v.value||v.id}>{v.text||v.title}</option>
			})}
		</select>;
	}
	onChangeViaSelect(e) {
		var v = e.target.value;
		if (v=="#placeholder#") v = null;
		this.props.onChange(v);
	}
	onFocus() {
		this.setState({focused:true,errorViaRequied:false}, ()=>{
			if (this.props.onFocus) this.props.onFocus();
			this.forceUpdate();
		});
	}
	onBlur() {
		var errorViaRequied = this.props.required && (this.props.value||"")=="";
		this.setState({focused:false,wasBlurred:true,errorViaRequied}, ()=>{
			if (this.props.onBlur) {
				var v;
				if (this.node) {
					v = this.node.value||'';
				} else {
					v = this.props.value||'';
				}
				this.props.onBlur(v, this.valid, this);
			}
			this.forceUpdate();
		});
	}
}

export default Select;
*/

import React from 'react';
import Any from '../any.jsx';

class Select extends Any {
	render(p,s,c,m) {
		var select = this.renderViaSelect(p,s,c,m);
		if (p.useOrangeWrap) {
			return this.renderWrap2(p,s,select,m);
		} else if (p.useFormControl) {
			return this.renderWrap(p,s,select,m);
		} else {
			return select;
		}
	}
	renderWrap(p,s,c,m) {
		var haveValue = p.value && (p.value.length!=0);
		var inputGroupCls = "input-group input-group-with-select with-placeholder";
		inputGroupCls += haveValue ? " filled placeholder-to-up" : " empty";
		if (s.focused) inputGroupCls += " focused";
		if (p.hasError || s.errorViaRequied) inputGroupCls += " has-danger";
		if (p.inputGroupCls) inputGroupCls += " "+ p.inputGroupCls;
		var hint = p.hint || null;
		if (s.errorViaRequied) {
			hint = "This field is required";
		}
		return <label className={inputGroupCls}>
			<span className="placeholder">{p.placeholder}</span>
			{c}
			<span className="input-hint">{hint}</span>
		</label>;
	}
	renderWrap2(p,s,c,m) {
		var style = {};
		if (p.style_selectLabel) {
			style = p.style_selectLabel;
		}
		style.marginLeft = "-1px";
		style.marginTop = "-1px";
		return <label
			className={[
				"btn select-label",
				p.isActive ? "btn-secondary active" : "btn-outline-secondary",
			].join(" ")} style={style}
		>
			<div className="select-box">
				<span className="select-text">{this.getText()}</span>
				<div className="select-text-icon"></div>
			</div>
			{c}
		</label>;
	}
	renderViaSelect(p,s,c,m) {
		var cls;
		if (p.className) {
			cls = p.className;
		} else {
			cls = "";
		}
		var options = this.getOptions();
		var _p = JSON.parse(JSON.stringify(p));
		delete _p.useFormControl;
		delete _p.options;
		delete _p.placeholderOnFocus;
		delete _p.inputGroupCls;
		delete _p.hint;
		this.value = p.value || options[0].text || options[0].title;
		return <select
			{..._p}
			className={cls}
			value={p.value} onChange={this.onChangeViaSelect.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
		>
			{options.map((v,i)=>{
				return <option key={"option"+i} value={v.value||v.id}>{v.text||v.title}</option>
			})}
		</select>;
	}
	getText() {
		var option = this.getActiveOption();
		return option.text || option.title || "";
	}
	getActiveOption() {
		var p = this.props;
		var options = this.getOptions();
		var options_ = options.filter(v=>(v.value||v.id)==p.value);
		if (!options_.length) {
			options_ = [options[0]];
		}
		return options_[0];
	}
	getOptions() {
		var p = this.props;
		var s = this.state || {};
		var options = p.options.slice(0);
		if (p.placeholderOnFocus && s.focused) {
			options.unshift({value:"#placeholder#",text:p.placeholderOnFocus});
		} else if (p.placeholder && !p.useFormControl) {
			options.unshift({value:"#placeholder#",text:p.placeholder});
		} else if (p.useFormControl) {
			options.unshift({value:"#placeholder#",text:""});
		}
		if (p.optionsOnlyWhileFocused) {
			if (!s.focused) {
				var options_ = options.filter(v=>(v.value||v.id)==p.value);
				if (!options_.length) {
					options_ = [options[0]];
				}
				options = options_;
			}
		}
		return options;
	}
	onChangeViaSelect(e) {
		var v = e.target.value;
		if (v=="#placeholder#") v = null;
		this.props.onChange(v);
	}
	onFocus() {
		this.setState({focused:true,errorViaRequied:false}, ()=>{
			if (this.props.onFocus) this.props.onFocus();
			this.forceUpdate();
		});
	}
	onBlur() {
		var errorViaRequied = this.props.required && (this.props.value||"")=="";
		this.setState({focused:false,wasBlurred:true,errorViaRequied}, ()=>{
			if (this.props.onBlur) {
				var v;
				if (this.node) {
					v = this.node.value||'';
				} else {
					v = this.props.value||'';
				}
				this.props.onBlur(v, this.valid, this);
			}
			this.forceUpdate();
		});
	}
}

export default Select;
