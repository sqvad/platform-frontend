import React from 'react';
import T from '../tags.jsx';

class PageResetPassword extends T.Page {
	constructor(props) {
		super(props);
		this.setState({
			password: "",
			passwordConfirm: "",
		});
		if (props.m.path.contains["reset-password"]) {
			var viaUrl = (props.m.path.order[2]||"").replace(/\s+/g,'');
			this.setState({
				code: viaUrl,
				codeViaURL: viaUrl
			});
		}
	}
	render(p,s,c,m) {
		var canSubmit = s.code && s.passwordConfirmValid;
		return <T.Page.PageWrapDevice m={m} pagePostfix="set2fa">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...s}>
				<hgroup>
					<h1>SET NEW PASSWORD</h1>
					<h2>Hey! Enter your new password</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<div className="d-flex flex-column align-items-center mt-4">
					<div style={{maxWidth:"450px",width:"100%"}}>
						<T.Form handler={this}>
							<T.If v={5>s.codeViaURL.length || s.serverError || s.codeViaURL!=s.code}>
								<T.Input
									placeholder="code" hint="Check your email"
									onChange={this.onCode.bind(this)}
									value={s.code} required autocomplete="off"
								/>
							</T.If>
							<T.Input.Password
								name="password" onChange={this.onPassword.bind(this)}
								value={s.password} required
							/>
							<T.Input.PasswordConfirm
								onChange={this.onPasswordConfirm.bind(this)}
								value={s.passwordConfirm} required
								password={s.password} autocomplete="off"
							/>
							{this.form && this.form.renderServerError()}
							<T.Form.SubmitButton 
								clsColor="btn-primary" cls="btn-lg"
								canSubmit={canSubmit} fetching={s.fetching}
								text="Change password"
							/>
					</T.Form>
				</div>
				</div>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	onCode(code) {
		this.form.forgotAboutServerError();
		this.setState({code});
	}
	onPassword(v, valid) {
		this.setState({
			password:v,
			passwordValid:valid,
			passwordConfirmValid:v==this.state.passwordConfirm,
		}, ()=>{
			this.onPasswordConfirm(this.state.passwordConfirm, this.state.passwordConfirmValid)
		});
	}
	onPasswordConfirm(v, valid) {
		this.form.forgotAboutServerError();
		this.setState({passwordConfirm:v,passwordConfirmValid:valid});
	}
	onSubmit() {
		var after;
		if (this.props.m.path.contains["reset-password"]) {
			after = ()=>{
				var m = this.props.m;
				this.props.m.api.gotoHref(m.auth.signedIn?"/":"/signin");
			};
		}
		return T.Form.wrapFetch(this, false,
			this.props.m.api.resetPassword(this.state.code, this.state.password)
		)
		.then(x=>{
			Promise.all([
				this.props.m.api.getAuthData(),
				this.props.m.api.getUserData()
			]).then(after).catch(after);
		});
	}
}

export default PageResetPassword;
