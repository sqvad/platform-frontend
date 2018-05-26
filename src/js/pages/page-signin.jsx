import React from 'react';
import T from '../tags.jsx';

class PageSignIn extends T.Page {
	constructor(props) {
		super(props);
		this.props.m.api.getAuthData()
		.then(x=>{
			if (x) {
				var m = this.props.m;
				if (x.signedIn) {
					m.api.gotoHref(T.A.href({href:"/"},m));
				} else if (x.emailVerificationSent && !x.emailVerified) {
					// m.api.gotoHref(T.A.href({href:"/verify-email"},m));
				} else if (x.signedInEmail && x.is2FAOn && !x.totpSecretKeyConfirmed) {
					// m.api.gotoHref(T.A.href({href:"/set2fa"},m));
				}
			}
		});
		this.props.m.api.getUserData();
		this.setState({
			email: this.props.m && this.props.m.auth && this.props.m.auth.email || "",
			password:"", //popupForgotPassword: true,
		});
		this.setState({
			emailValid: T.Input.Email.validate(this.state.email)
		});
	}
	render(p,s,c,m) {
		var auth = m.auth;
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...s}>
				<hgroup>
					<h1>LOG IN TO INS ECOSYSTEM</h1>
					<h2>Nice to see you here again</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<T.If v={!(m.auth && m.auth.signedInEmail)}>
					{this.renderEmail(p,s,c,m)}
				</T.If>
				<T.If v={s.popup2fa}>
					{s.popup2fa ? this.render2fa(p,s,c,m) : null}
				</T.If>
				<T.If v={!s.popup2fa && m.auth && m.auth.signedInEmail}>
					{this.render2fa(p,s,c,m)}
				</T.If>
				{s.popupForgotPassword ? this.renderForgotPassword(p,s,c,m) : null}
				{
					!p.m.path.contains["verify-email"] &&
					!s.popup_thanksForRegister_closed && auth && auth.emailVerificationSent && !auth.emailVerified
					? this.renderThanksForRegister(p,s,c,m) : null
				}
				<T.Page.NotificationVerifyEmail {...p} />
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	renderThanksForRegister(p,s,c,m) {
		return <div>
			<T.Popup.ThanksForRegister {...p}
				onClose={(res,popup)=>{
					this.setState({popup_thanksForRegister_closed:popup.state.closeViaCancel});
				}}
				makePromise={()=>{
					return T.Form.delay(0.001)
					.then(()=>p.m.api.requestCodeToVerifyEmail());
				}}
			/>
		</div>;
	}
	render2fa(p,s,c,m) {
		var noPopup = !s.popup2fa && m.auth && m.auth.signedInEmail;
		var noPopup = true;
		var popup = <T.Popup.Put2fa {...p} onClose={()=>this.on2faOk()}
			noPopup={noPopup}
			makePromise={code=>{
				return p.m.api.login2fa(code);
			}}
			str_put2faTo="log in"
		/>;
		if (noPopup) {
			return <div className="d-flex flex-row justify-content-center mt-5">
				<div
					className={[
						m.device.isMobile ? "" : "col-6"
					].filter(v=>!!v).join(" ")}
				>
					{popup}
				</div>
			</div>;
		} else {
			return popup;
		}
	}
	on2faOk() {
		this.setState({popup2fa:false});
		this.props.m.api.gotoHref("/");
	}
	renderForgotPassword(p,s,c,m) {
		return <div>
			<T.Popup.ForgotPassword {...p} onClose={()=>this.onForgotPasswordOk()} />
		</div>;
	}
	onForgotPasswordOk() {
		this.setState({popupForgotPassword:false});
	}
	renderEmail(p,s,c,m) {
		return <T.Form handler={this}>
			<div className="row d-flex justify-content-center mt-4">
				<div className={m.device.isMobile?"":"col-6"} style={{width:m.device.isMobile?"90%":""}}>
					<T.Input.Email
						name="email" onChange={this.onEmail.bind(this)}
						value={s.email} required
						autofocus m={m}
					/>
					<T.Input.Password
						name="password" onChange={this.onPassword.bind(this)}
						value={s.password} required
					/>
					<div className="d-flex justify-content-between mt-4">
						<span>
							<T.Checkbox checked={s.keepMySignedIn} onChange={(on)=>this.setState({keepMySignedIn:on})}>
								Keep me signed in
							</T.Checkbox>
						</span>
						<span>
							<T.A {...p} onClick={()=>this.setState({popupForgotPassword:true})}
								className="external text-muted" style={{fontSize:"0.8em",position:"relative",top:"0.2em"}}
							>
								<span style={{
									fontSize: m.device.isMobile ? "0.9em" : "",
									position: m.device.isMobile ? "relative" : "",
									top: m.device.isMobile ? "-0.2em" : "",
								}}>
									Forgot your password?
								</span>
							</T.A>
						</span>
					</div>
					{this.form && <div className="mt-4">{this.form.renderServerError()}</div>}
					<T.If v={s.againSent}>
						<div className="mt-4">We've sent you a verification link.</div>
					</T.If>
					<div className="d-flex justify-content-center mt-4 mb-4">
						<T.If v={0
							|| (s.serverError||{}).message=="User email is not verified"
							|| (s.serverError||{}).message=="Verification code resend not allowed"
							|| (s.serverError||{}).message=="ERR_USER_EMAIL_IS_NOT_VERIFIED"
							|| (s.serverError||{}).message=="ERR_VERIFICATION_CODE_INVALID"
						}>
							<T.Form.SubmitButton
								canSubmit={true} fetching={s.againFetching}
								type="button" dontChangeText onClick={()=>{
									this.setState({againFetching:true,againSent:false});
									p.m.api.requestCodeToVerifyEmail(s.email)
									.then(()=>{
										this.setState({serverError:null});
										this.setState({againFetching:false,againSent:true});
									})
									.catch(x=>{
										this.setState({serverError:x});
										this.setState({againFetching:false});
									})
								}}
								clsColor="btn-outline-primary" cls={(m.device.isMobile ? "btn-sm" : "btn-lg")+" mr-3"}
							>
								Resend verification link
							</T.Form.SubmitButton>
						</T.If>
						<T.If v={0
							|| (s.serverError||{}).message=="User email is not verified"
							|| (s.serverError||{}).message=="Verification code resend not allowed"
							|| (s.serverError||{}).message=="ERR_USER_EMAIL_IS_NOT_VERIFIED"
							|| (s.serverError||{}).message=="ERR_VERIFICATION_CODE_INVALID"
						}>
							<T.If v={!s.popup_thanksForRegister_closed}>
								<T.Popup.EmailNotVerified {...p} email={s.email || p.m.auth && p.m.auth.email}
									onClose={(res,popup)=>{
										this.setState({popup_thanksForRegister_closed:popup.state.closeViaCancel});
									}}
									makePromise={()=>{
										return T.Form.delay(5)
										.then(()=>p.m.api.requestCodeToVerifyEmail(s.email))
										.then(()=>{
											this.setState({serverError:null});
											this.setState({againFetching:false,againSent:true});
										})
									}}
								/>
							</T.If>
						</T.If>
						<T.Form.SubmitButton
							clsColor="btn-primary" cls="btn-lg"
							canSubmit={s.canSubmit} fetching={s.fetching}
							text="Log In"
						/>
					</div>
				</div>
			</div>
		</T.Form>;
	}
	checkValid() {
		var s = this.state || {};
		this.setState({
			canSubmit: s.emailValid && s.passwordValid
		}, ()=>{this.forceUpdate();});
	}
	onEmail(v, valid) {
		this.setState({email:v,emailValid:valid}, ()=>{this.checkValid()});
	}
	onPassword(v, valid) {
		this.setState({password:v,passwordValid:valid}, ()=>{this.checkValid()});
	}
	onSubmit() {
		return T.Form.wrapFetch(
			this,
			false,
			this.props.m.api.loginEmail(this.state.email, this.state.password, this.state.keepSignedIn)
			.then(x=>{
				this.props.m.api.getUserData();
				return this.props.m.api.getAuthData(true)
				.then(x=>{
					var m = this.props.m;
					if (x) {
						debugger;
						if (x.is2FAOn && !x.totpSecretKeyConfirmed) {
							m.api.gotoHref(T.A.href({href:"/set2fa"},m));
						}
					}
					if (m.path.contains["signin"] && m.auth.signedIn) {
						m.api.gotoHref(T.A.href({href:"/"},m));
					} else {
						if (!m.auth.signedIn) {
							this.setState({popup2fa:true});
						} else {
							window.location.refresh();
						}
					}
				})
			})
		)
	}
}

export default PageSignIn;
