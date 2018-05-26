import React from 'react';
import Any from '../any.jsx';
import If from './if.jsx';
import Popup from './popup-base.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupForgotPassword extends Any {
	constructor(props) {
		super(props);
		var authData = props.m && props.m.auth || {};
		var email = authData.email||"";
		var emailValid = Input.Email.validate(email);
		this.setState({email,emailValid});
	}
	render(p,s,c,m) {
		if (s.sended && !s.fetching) {
			return <div className="notification">
				<div style={{marginBottom:"0.5em"}}>
					<b>Success</b>
				</div>
				<div>
					Please follow the instructions sent to your email inbox.
				</div>
			</div>;
		}
		var content = <div>
			<h1 className="h1-center mt-0">PASSWORD RESET</h1>
			<p style={{textAlign:"center"}}>
				Please enter your user account login email and we will email instructions to your email address on records to complete the reset of your password.
			</p>
			<Form handler={this}>
				<Input.Email
					placeholder="YOUR ACCOUNT E-MAIL"
					value={s.email||""} onChange={(this.onEmail.bind(this))}
					required readonly={s.fetching}
					autofocus m={m}
				/>
				<If v={s.sended && !s.fetching}><p>
					Sent! Please, check out your email.
				</p></If>
				<If v={s.serverError}>
					<Form.ServerError m={m} message="Invalid email" errors={[0]}></Form.ServerError>
				</If>
				<div className="d-flex flex-column align-items-center justify-content-center mt-4">
					<Form.SubmitButton
						canSubmit={s.emailValid} fetching={s.fetching}
						clsColor="btn-primary" cls="btn-lg mb-3"
					>
						RESET PASSWORD
					</Form.SubmitButton>
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
	onEmail(email,emailValid) {
		this.form.forgotAboutServerError();
		this.setState({email,emailValid,er:null,serverError:null}, ()=>{
			this.forceUpdate();
		});
	}
	onSubmit() {
		this.setState({sended:false,serverError:null});
		return Form.wrapFetch(this, false, this.props.m.api.sendCodeForPasswordReset(this.state.email))
		.then(x=>{
			this.setState({sended:true,serverError:null},()=>{this.forceUpdate()});
		});
	}
}

export default PopupForgotPassword;
