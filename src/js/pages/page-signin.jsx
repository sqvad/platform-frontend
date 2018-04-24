import React from 'react';
import T from '../tags.jsx';

class PageSignIn extends T.Page {
	constructor(props) {
		super(props);
		this.props.m.api.getAuthData();
		this.props.m.api.getUserData();
		this.setState({
			email: this.props.m && this.props.m.auth && this.props.m.auth.email || "",
			password:"", //popupForgotPassword: true,
		});
	}
	render(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...s}>
				<hgroup>
					<h1>LOG IN TO INS ECOSYSTEM</h1>
					<h2>Nice to see you here again</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				{this.renderEmail(p,s,c,m)}
				{s.popup2fa || m.auth && m.auth.signedInEmail ? this.render2fa(p,s,c,m) : null}
				{s.popupForgotPassword ? this.renderForgotPassword(p,s,c,m) : null}
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	render2fa(p,s,c,m) {
		return <div>
			<T.Popup.Put2fa {...p} onClose={()=>this.on2faOk()}
				makePromise={code=>{
					return p.m.api.login2fa(code);
				}}
			/>
		</div>;
	}
	on2faOk() {
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
					/>
					<T.Input.Password
						name="password" onChange={this.onPassword.bind(this)}
						value={s.password} required
					/>
					<div className="d-flex justify-content-between">
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
									fontSize: m.device.isMobile ? "0.8em" : ""
								}}>
									Forgot your password?
								</span>
							</T.A>
						</span>
					</div>
					{this.form && this.form.renderServerError()}
					<div className="d-flex justify-content-center mt-5">
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
		});
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
			this.props.m.api.loginEmail(this.state.email, this.state.password)
			.then(x=>{
				return this.props.m.api.getUserData(true)
				.then(()=>{
					var m = this.props.m;
					if (m.path.contains["signin"]) {
						if (m.signedIn) {
							m.api.gotoHref(T.A.href({href:"/"},m))
						}
					}
				})
			})
		)
	}
}

export default PageSignIn;
