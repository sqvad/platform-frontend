import React from 'react';
import Any from '../any.jsx';
import If from './if.jsx';
import Popup from './popup-base.jsx';
import PopupWithForm from './popup-with-form.jsx';
import PopupForgotPassword from './popup-forgot-password.jsx';
import Form from './form.jsx';
import InputPassword from './input-password.jsx';
import A from './a.jsx';

class PopupPutPassword extends PopupWithForm {
	constructor(props) {
		super(props);
		this.setState({password:""});
		this.makePromise = this.makePromise.bind(this);
		this.onClose = this.onClose.bind(this);
	}
	renderContent(p,s,c,m) {
		return <div>
			<If v={!s.popupForgotPassword}><div>
				<h1 className="h1-center mt-0">ENTER YOUR PASSWORD</h1>
				<p style={{textAlign:"center"}}>
					Please, enter your password to sign transaction.
				</p>
				<Form handler={this}>
					<InputPassword
						name="Account password" onChange={(password,passwordValid)=>this.setState({password,passwordValid,serverError:null})}
						value={s.password} required
					/>
					<Form.ServerError m={m} serverError={s.serverError} />
					<div className="d-flex flex-column align-items-center justify-content-center mt-4">
						<Form.SubmitButton
							canSubmit={s.passwordValid} fetching={s.fetching}
							clsColor="btn-primary" cls="btn-lg mb-3"
						>
							SIGN TRANSACTION
						</Form.SubmitButton>
						<A m={m} className="text-muted external" onClick={()=>this.setState({popupForgotPassword:true})}><small>Forgot your password?</small></A>
					</div>
				</Form>
			</div></If>
			<If v={s.popupForgotPassword}>
				<PopupForgotPassword {...p} noPopup />
			</If>
		</div>;
	}
	makePromise(p,s) {
		return Form.wrapFetch(this, false, p.makePromise(s.password,this))
		.catch(x=>{
			if ((x && x.message||"").toLowerCase().indexOf("Password is invalid".toLowerCase())>-1) {
				return x;
			} else if (p.catchPromise) {
				p.catchPromise(x);
			} else {
				throw x;
			}
		});
	}
	onClose() {
		// var s = this.state || {};
		// if (s.popupForgotPassword) {
		// 	this.setState({popupForgotPassword:false});
		// 	return;
		// }
		var p = this.props;
		return super.onClose ? super.onClose() : p.onClose && p.onClose();
	}
}

export default PopupPutPassword;
