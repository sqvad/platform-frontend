import React from 'react';
import Any from '../any.jsx';
import PopupPutPassword from './popup-put-password.jsx';
import PopupPut2fa from './popup-put2fa.jsx';

class PopupConfirm extends Any {
	render(p,s,c,m) {
		if (this.use2fa()) {
			return <PopupPut2fa {...p} makePromise={this.makePromise.bind(this)} />;
		} else {
			return <PopupPutPassword {...p} makePromise={this.makePromise.bind(this)} />;
		}
	}
	use2fa() {
		var p = this.props;
		if ('use2fa' in p) return !!p.use2fa;
		if ('usePassword' in p) return !p.usePassword;
		return p.m.auth && p.m.auth.is2FAOn;
	}
	makePromise(value,popup) {
		return this.props.makePromise({value,popup,aborted:!popup,is2fa:this.use2fa()});
	}
}

export default PopupConfirm;
