import React from 'react';
import Any from '../any.jsx';
import Popup from './popup-base.jsx';
import Form from './form.jsx';

class PopupWithForm extends Any {
	constructor(props) {
		super(props);
	}
	render(p,s,c,m) {
		return this.renderWrap(p,s,this.renderContent(p,s,c,m),m);
	}
	renderContent(p,s,c,m) {
		return content = <div>...</div>;
	}
	renderWrap(p,s,c,m) {
		if (p.noPopup) {
			return <div>{c}</div>;
		} else {
			return <Popup onClose={this.onClose || p.onClose}>{c}</Popup>;
		}
	}
	makePromise(p,s) {
		return p.makePromise(s.code2fa,this);
	}
	onSubmit() {
		var p = this.props;
		if (p.makePromise) {
			return Form.wrapFetch(this, false, this.makePromise(p,this.state))
			.then(x=>{
				if (x && ('message' in x) && ('errors' in x) && Object.keys(x).length==2) {
					// wrong pass (or wrong 2fa code) aready printed
				} else {
					if (p.onClose) return p.onClose(x, this);
				}
				return x;
			});
		} else {
			p.onClose(this.state.code2fa, this);
		}
	}
}

export default PopupWithForm;
