import React from 'react';
import Any from '../any.jsx';

class Select extends Any {
	componentDidMount() {
		this.onChangeViaSelect = this.onChangeViaSelect.bind(this);
	}
	render(p,s,c,m) {
		return this.renderViaSelect(p,s,c,m);
	}
	renderViaSelect(p,s,c,m) {
		var cls;
		if (p.className) {
			cls = p.className;
		} else {
			cls = "";
		}
		var options = p.options.slice(0);
		if (p.placeholder) {
			options.unshift({value:"#placeholder#",text:p.placeholder});
		}
		return <select className={cls} value={p.value} onChange={this.onChangeViaSelect}>
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
}

export default Select;
