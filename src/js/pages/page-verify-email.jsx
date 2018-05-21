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
			debugger;
			T.Form.delay(1)
			.then(()=>{
				debugger;
				props.m.api.verifyEmail(codeViaURL)
				.then(x=>{
					this.props.m.api.gotoHref("/");
				})
				.catch(x=>{
					this.setState({error:x});
				});
			});
		} else {
			this.setState({code:""});
		}
		props.m.api.getAuthData()
		.then(()=>{
			if (props.m.auth && props.m.auth.emailVerified) {
				this.props.m.api.gotoHref("/");
			}
		});
	}
	render(p,s,c,m) {
		var canSubmit = true;
		return <T.Page.PageWrapDevice m={m} pagePostfix="set2fa">
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s}></T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<div style={{visibility:"hidden"}}>
				<h1 className="h1-center d-flex flex-column align-items-center">
					VERIFY EMAIL
				</h1>
				<div className="d-flex flex-column align-items-center">
					<div style={{maxWidth:"450px",width:"100%"}}>
						<T.Form onSubmit={()=>this.onSubmit()}>
							<div style={{display:"none"}}>
								<T.Input
									value={s.code} onChange={code=>this.setState({code,error:null})}
									placeholder={"Code from your email "}
									hint={"Check out "+ (m.auth && m.auth.email || m.user && m.user.email)}
									required
								/>
							</div>
							<T.If v={!s.error && !s.sendOtherCode_pending && !s.sendOtherCode_ready}>
								<T.If v={m.auth && m.auth.email || m.user && m.user.email}>
									<span>Check out {(m.auth && m.auth.email || m.user && m.user.email)}.</span>
								</T.If>
							</T.If>
							<T.If v={s.error}><p className="mt-4 mb-3" style={{color:"red"}}>
								{s.error && s.error.message}
							</p></T.If>
							<T.If v={s.sendOtherCode_pending}><p className="mt-4 mb-3">
								Sending...
							</p></T.If>
							<T.If v={s.sendOtherCode_ready}><p className="mt-4 mb-3">
								Sent! Please, check out your email.
							</p></T.If>
							<div className={"d-flex justify-content-between mt-4"+(m.device.isMobile?" flex-column":"")}>
								<T.Form.SubmitButton
									type="button" onClick={this.sendOtherCode.bind(this)}
									clsColor="btn-outline-primary" cls="btn-lg"
									canSubmit={!s.fetching} fetching={s.sendOtherCode_pending}
									text="Send other code" style={{flex:1}}
								/>
								<div style={{display:"none"}}>
									<T.Form.SubmitButton
										clsColor="btn-primary" cls={"btn-lg "+(m.device.isMobile?"mt-3":"ml-3")}
										canSubmit={canSubmit} fetching={s.fetching}
										text="Confirm email" style={{flex:1}}
									/>
								</div>
						</div>
					</T.Form>
				</div>
				</div>
				</div>
				<T.Page.NotificationVerifyEmail {...p} />
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	sendOtherCode() {
		this.setState({error:null,sendOtherCode_ready:false,sendOtherCode_pending:true});
		this.props.m.api.requestCodeToVerifyEmail()
		.then(x=>{
			this.setState({error:null,sendOtherCode_ready:true,sendOtherCode_pending:false});
		})
		.catch(x=>{
			this.setState({error:x,sendOtherCode_ready:false,sendOtherCode_pending:false});
		});
	}
	onSubmit() {
		debugger;
		return T.Form.delay(1)
		.then(()=>{
			debugger;
			T.Form.wrapFetch(this, false, this.props.m.api.verifyEmail(this.state.code))
		})
		.catch(x=>{
			this.setState({error:x});
			this.props.m.getUserData();
			this.props.m.getAuthData()
			.then(()=>{
				if (props.m.auth && props.m.auth.emailVerified) {
					this.props.m.api.gotoHref("/");
				}
			});
		});
	}
}

export default PageVerifyEmail;
