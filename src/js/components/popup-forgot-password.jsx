import React from 'react';
import Any from '../any.jsx';
import Popup from './popup-base.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupForgotPassword extends Any {
	constructor(props) {
		super(props);
		this.setState({code2fa:""});
	}
	render(p,s,c,m) {
		var content = <div>
			<h1 className="h1-center mt-0">PASSWORD RESET</h1>
			<p style={{textAlign:"center"}}>
				Please enter your user account login email and we will email instructions to your email address on records to complete the reset of your password.
			</p>
			<Form onSubmit={this.onSubmit.bind(this)}>
				<Input.Email
					placeholder="YOUR ACCOUNT E-MAIL"
					hint={
						s.sended ? "Sent! Please, check out your email."
							: s.pending ? "Loading..."
								: s.er ? s.er.message
									: "E.g. my@email.com"
					}
					value={s.email||""} onChange={(this.onEmail.bind(this))}
					required readonly={s.pending || s.sended}
				/>
				<div className="d-flex flex-column align-items-center justify-content-center mt-4">
					<button type="submit"
						disabled={!s.emailValid || s.pending || s.sended}
						className={[
							"btn btn-lg btn-primary", "mb-3",
							(!s.emailValid || s.pending || s.sended) ? "disabled" : "",
						].join(" ")}
					>
						RESET PASSWORD
					</button>
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
		this.setState({email,emailValid,er:null}, ()=>{
			this.forceUpdate();
		});
	}
	onSubmit() {
		this.setState({pending:true, redirect:"#"});
		this.props.m.api.sendCodeForPasswordReset(this.state.email, "#")
		.then(x=>{
			this.setState({pending:false, sended:true},()=>{this.forceUpdate()});
		});
		// this.props.m.api.login2fa(this.state.code2fa)
		// .then(x=>{
		// 	this.props.onClose();
		// })
		// .catch(er=>{
		// 	this.setState({er,pending:false})
		// })
	}
}

export default PopupForgotPassword;
