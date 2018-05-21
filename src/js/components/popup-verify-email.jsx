import React from 'react';
import Any from '../any.jsx';
import If from './if.jsx';
import Popup from './popup-base.jsx';
import PopupWithForm from './popup-with-form.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupVerifyEmail extends PopupWithForm {
	constructor(props) {
		super(props);
		this.makePromise = this.makePromise.bind(this);
		this.onClose = this.onClose.bind(this);
		// if (props.m.path.contains["verify-email"]) {
		// 	this.setState({codeViaURL:props.m.path.order[2]});// /verify-email/r6OKtPg9kYYgm-h-qyOsO7sQ1GGOqUqWBpPvZkRBj6Z
		// }
		// if (codeViaURL) {
		// 	this.setState({fetching:true,codeError:null});
		// 	Form.delay(2)
		// 	.then(()=>{
		// 		props.m.api.verifyEmail(codeViaURL)
		// 		.then(x=>{
		// 			this.setState({fetching:false,ok:true});
		// 			var auth = this.props.m;
		// 			if (auth && auth.email) {
		// 				this.props.m.api.gotoHref("/");
		// 				this.props.m.api.getAuthData()
		// 				.then(()=>{
		// 					window.location.reload();
		// 				});
		// 			} else {
		// 				this.props.m.api.gotoHref("/signin");
		// 			}
		// 		})
		// 		.catch(x=>{
		// 			this.setState({fetching:false,ok:false,codeError:x});
		// 		});
		// 	});
		// }
	}
	renderContent(p,s,c,m) {
		return <div>
			<h1 className="h1-center mt-0">Verify email</h1>
			<div className="text-center">
				<If v={p.codeSending || s.againSending}><div>
					<div className="mt-4 mb-4">
						<img src="img/loader.svg" width="135" height="135"
						style={{
							position: "relative",
							top: "-2px",
							color: "black",
							opacity: "0.5"
						}} />
					</div>
					<div className="mt-4">
						Please, wait...
					</div>
				</div></If>
				<If v={p.codeSent}>
					<p>Your email is verified. Continue with <A {...p} href="/" onClick={()=>this.onClose()}>log in</A>.</p>
				</If>
				<If v={s.againSent}>
					<p>Sent! Please, check out your email.</p>
				</If>
				<If v={s.againEr || p.codeError}><div className="mt-4">
					<Form.ServerError serverError={s.againEr || p.codeError} />
					<div>
						<Form.SubmitButton
							canSubmit={true} fetching={p.codeSending || s.againSending}
							clsColor="btn-primary" cls="btn-lg"
							onClick={x=>{
								this.setState({againSending:true,againEr:null,noClose:true});
								Form.delay(1)
								.then(x=>{
									return p.m.api.requestCodeToVerifyEmail();
								})
								.then(x=>{
									this.setState({againSending:false,againSent:true,noClose:false});
								})
								.catch(x=>{
									this.setState({againSending:false,againEr:x,noClose:false});
								})
							}}
						>
							Resend a verification link
						</Form.SubmitButton>
					</div>
				</div></If>
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
		return super.onClose ? super.onClose(this.state,popup) : p.onClose && p.onClose(this.state,popup);
	}
}

export default PopupVerifyEmail;
