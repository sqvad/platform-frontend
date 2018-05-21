import React from 'react';
import Any from '../any.jsx';
import If from './if.jsx';
import Popup from './popup-base.jsx';
import PopupWithForm from './popup-with-form.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupThanksForRegister extends PopupWithForm {
	constructor(props) {
		super(props);
		this.setState({code2fa:""});
		this.makePromise = this.makePromise.bind(this);
		this.onClose = this.onClose.bind(this);
	}
	renderContent(p,s,c,m) {
		return <div>
			<h1 className="h1-center mt-0">Thank you for registering!</h1>
			<div className="text-center">
				<div className="mt-4 mb-4">
					<img
						src="img/thanks-for-register.png" width="131" height="123"
						style={{position:"relative",top:"-3px"}}
					/>
				</div>
				<div className="mt-4 mb-4">
					Please verify your email.
					<br />
					We've sent you a verification link
					<If v={s.sent && !s.serverError}><b>{" "}again</b></If>
					.
				</div>
				<If v={s.serverError}><div className="mt-4 mb-4">
					<Form.ServerError serverError={s.serverError} />
					<div style={{marginTop:"-16px"}}>
						<Form.ServerError serverError={{message:"Please, try again later"}} />
					</div>
				</div></If>
				<Form handler={this}>
					<Form.SubmitButton
						canSubmit={true} fetching={s.fetching}
						clsColor="btn-primary" cls="btn-lg mb-3"
					>
						Resend a verification link
					</Form.SubmitButton>
				</Form>
			</div>
		</div>;
	}
	makePromise(p,s) {
		return Form.wrapFetch(this, false, p.makePromise(s,this))
		.then(x=>{
			x;this;
		})
		.catch(x=>{
			x;this;
		})
	}
	onClose(popup) {
		var p = this.props;
		return super.onClose ? super.onClose(null,popup) : p.onClose && p.onClose(null,popup);
	}
}

export default PopupThanksForRegister;
