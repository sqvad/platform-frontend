import React from 'react';
import Any from '../any.jsx';
import Popup from './popup-base.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupPut2fa extends Any {
	constructor(props) {
		super(props);
		this.setState({code2fa:""});
	}
	render(p,s,c,m) {
		var content = <div>
			<h1 className="h1-center mt-0">ENTER 2-FACTOR <br />AUTHENTICATION CODE</h1>
			<p>
				<img
					src="img/set2fa-popup.png" width="65" height="105"
					style={{float:"left",marginRight:"18px",position:"relative",top:"-3px"}}
				/>
				Please enter the 6-digit code generated by the authentication app on your device to verify the transaction
			</p>
			<Form handler={this}>
				<Input
					type="text" placeholder="AUTHENTICATION CODE"
					hint={s.fetching ? "Loading...": s.serverError ? s.serverError.message : "E.g. 123 456"}
					value={s.code2fa} onChange={(this.onCode.bind(this))}
					hasError={!s.codeValid || !!s.serverError}
					checkValid={str=>(str+'').replace(/\D+/g, "").length==6} required
				/>
				<div className="d-flex flex-column align-items-center justify-content-center mt-4">
					<Form.SubmitButton
						canSubmit={s.codeValid} fetching={s.fetching}
						clsColor="btn-primary" cls="btn-lg mb-3"
					>
						SEND
					</Form.SubmitButton>
					<A m={m} className="text-muted external" href="forgot2fa"><small>I’m not able to log in with 2FA</small></A>
				</div>
			</Form>
		</div>;
		return this.renderWrap(p,s,content,m);
	}
	renderWrap(p,s,c,m) {
		if (p.noPopup) {
			return <div>{c}</div>;
		} else {
			return <Popup onClose={p.onClose}>{c}</Popup>;
		}
	}
	onCode(code2fa,codeValid) {
		this.form.forgotAboutServerError();
		this.setState({code2fa,codeValid}, ()=>{
			this.forceUpdate();
		});
	}
	onSubmit() {
		var p = this.props;
		if (p.makePromise) {
			return Form.wrapFetch(this, false, p.makePromise(this.state.code2fa,this))
			.then(x=>{
				if (p.onClose) return p.onClose(this.state.code2fa, this);
			});
		} else {
			p.onClose(this.state.code2fa, this);
		}
	}
}

export default PopupPut2fa;
