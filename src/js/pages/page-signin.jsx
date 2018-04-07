import React from 'react';
import T from '../tags.jsx';

class PageSignIn extends T.Page {
	constructor(props) {
		super(props);
		this.setState({
			email:"",
			password:"",
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
				<T.Form onSubmit={()=>{s.canSubmit && p.onSubmit(s)}}>
					<div className="row d-flex justify-content-center mt-4">
						<div className="col-6">
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
									<T.A href="" {...p} className="external text-muted" style={{fontSize:"0.8em",position:"relative",top:"0.2em"}}>
										Forgot your password?
									</T.A>
								</span>
							</div>
							<div className="d-flex justify-content-center mt-5">
								<button type="submit"
									className={[
										"btn btn-lg btn-primary",
										s.canSubmit ? "" : " disabled",
									].join(" ")}
								>
									Log In
								</button>
							</div>
						</div>
					</div>
				</T.Form>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
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
}

export default PageSignIn;
