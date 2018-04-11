import React from 'react';
import T from '../tags.jsx';

class PageVerifyEmail extends T.Page {
	constructor(props) {
		super(props);
		if (props.m.path.contains["verify-email"]) {
			var codeViaURL = props.m.path.order[2];// /verify-email/r6OKtPg9kYYgm-h-qyOsO7sQ1GGOqUqWBpPvZkRBj6Z
		}
		if (codeViaURL) {
			this.setState({code:codeViaURL});
			props.m.api.verifyEmail(null, codeViaURL)
			.catch(x=>{
				this.setState({error:x});
			});
		} else {
			this.setState({code:""});
		}
	}
	render(p,s,c,m) {
		var canSubmit = true;
		return <T.Page.PageWrapDevice m={m} pagePostfix="set2fa">
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s}></T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<h1 className="h1-center d-flex flex-column align-items-center">
					VERIFY EMAIL
				</h1>
				<div className="d-flex flex-column align-items-center">
					<div style={{maxWidth:"600px"}}>
						<T.Form onSubmit={()=>this.onSubmit()}>
							<T.Input 
								value={s.code} onChange={code=>this.setState({code,error:null})}
								placeholder={"Code from your email "}
								hint={"Check out "+ (m.auth && m.auth.email || m.user && m.user.email)}
								required
							/>
							<T.If v={s.error}><p className="mt-4 mb-3" style={{color:"red"}}>
								{s.error && s.error.message}
							</p></T.If>
							<T.If v={s.sendOtherCode_pending}><p className="mt-4 mb-3">
								Sending...
							</p></T.If>
							<T.If v={s.sendOtherCode_ready}><p className="mt-4 mb-3">
								Sent! Please, check out your email.
							</p></T.If>
							<div className="d-flex justify-content-between mt-4">
								<button
									type="button" onClick={this.sendOtherCode.bind(this)}
									className="btn btn-lg btn-outline-primary"
									disabled={s.sendOtherCode_pending}
								>
									Send other code
								</button>
								<button type="submit"
									className={[
										"btn btn-lg btn-primary",
										canSubmit ? "" : " disabled",
									"ml-3"
								].join(" ")}
							>
								Confirm email
							</button>
						</div>
					</T.Form>
				</div>
				</div>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	sendOtherCode() {
		this.setState({error:null,sendOtherCode_ready:false,sendOtherCode_pending:true});
		this.props.m.api.requestCodeToVerifyEmail()
		.then(x=>{
			this.setState({error:null,sendOtherCode_ready:true,sendOtherCode_pending:false});
			debugger;
			x;
		})
		.catch(x=>{
			this.setState({error:x,sendOtherCode_ready:false,sendOtherCode_pending:false});
		});
	}
	onSubmit() {
		this.props.m.api.verifyEmail(null, this.state.code)
		.catch(x=>{
			this.setState({error:x});
		});
	}
}

export default PageVerifyEmail;
