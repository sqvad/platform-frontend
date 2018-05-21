import React from 'react';
import Any from '../any.jsx';
import Headers from './headers.jsx';
import Popup from './popup.jsx';
import Form from './form.jsx';

class Page extends Any {
	render(p,s,c,m) {
		return <PageWrapDevice m={m} {...p}>
			<PageWrapHeader key="header" m={m} {...p} />
			<PageWrapWidth key="width" m={m} {...p} />
		</PageWrapDevice>;
	}
};

class PageWrapWidth extends Any {
	render(p,s,c,m) {
		return <div className="container"><div className="width">{c}</div></div>;
	}
}
class PageWrapHeader extends Any {
	render(p,s,c,m) {
		if (p.header=="short") {
			return <Headers.Short m={m} {...p}>{c}</Headers.Short>;
		}
		if (p.header=="medium") {
			return <Headers.Medium m={m} {...p}>{c}</Headers.Medium>;
		}
		return null;
	}
}
class PageWrapDevice extends Any {
	componentWillMount() {
		super.componentWillMount();
		this.onAnyClick = this.onAnyClick.bind(this);
	}
	render(p,s,c,m) {
		var pagePostfix = p.pagePostfix || s.pagePostfix;
		var device = [
			"page",
			(pagePostfix ? "page-"+pagePostfix : ""),
			(m.device.isMobile ? "" : "no-") + "mobile",
			(m.device.isTablet ? "" : "no-") + "tablet",
			(m.device.isHandlehand ? "" : "no-") + "handlehand",
			(m.device.isDesktop ? "" : "no-") + "desktop",
			"retina-" + m.device.retina,
		].join(" ").replace(/\s+/g, " ");
		return <div className={device} onClick={this.onAnyClick}>{c}{p.popup}</div>;
	}
}
class PageWrapProfile extends Any {
	render(p,s,c,m) {
		var cls = "d-flex";
		if (m.device.isMobile) {
			cls = "d-flex flex-column";
		}
		var style = p.style || {};
		style.minHeight = "100%";
		return <div className={cls} style={style}>
			{c}
		</div>;
	}
}
class PageWrapProfileLeft extends Any {
	render(p,s,c,m) {
		return <div className="d-flex profile-left-menu bg-violet" style={{boxShadow:"0 0 20px rgba(0, 0, 0, 0.23)", zIndex:1}}>
			{c}
		</div>;
	}
}
class PageWrapProfileWidth extends Any {
	render(p,s,c,m) {
		return <div className="w-100" style={p.style||{}}>
			{!p.skipLogo?<div className="profile-logo"></div>:null}
			<div className="profile-center" key="profile-center">
				{c}
			</div>
		</div>;
	}
}

class NotificationVerifyEmail extends Any {
	constructor(props) {
		super(props);
		if (props.m.path.contains["verify-email"]) {
			var codeViaURL = props.m.path.order[2];// /verify-email/r6OKtPg9kYYgm-h-qyOsO7sQ1GGOqUqWBpPvZkRBj6Z
			this.setState({codeViaURL,codeSending:true,codeError:null});
			Form.delay(2)
			.then(()=>{
				props.m.api.verifyEmail(codeViaURL)
				.then(x=>{
					this.props.m.api.getAuthData()
					.then(x=>{
						this.setState({codeSending:false,codeSent:true});
					});
				})
				.catch(x=>{
					this.setState({codeSending:false,codeSent:false,codeError:x});
				});
			});
		}
		// this.setState({codeError:{message:"Wrong code"}});
	}
	render(p,s,c,m) {
		if (s.codeViaURL && !s.verifyEmailForceClosed) {
			return <Popup.VerifyEmail
				{...p} {...s}
				noClose={s.codeSending}
				onClose={(s2,popup)=>{
					this.setState({verifyEmailForceClosed:true});
				}}
			></Popup.VerifyEmail>;
		} else {
			return null;
		}
		/*
		var checkoutEmail = false;
		if (!s.codeError) {
			if (m.auth) {
				var auth = m.auth;
				if (!auth.email) return null;
				if (auth.emailVerified) return null;
				checkoutEmail = true;
			} else {
				return null;
			}
		}
		// if (s.codeSent) return null;
		var sendOtherCode = null;
		if (checkoutEmail || s.codeSent || s.againSent) {
			text = <span>Sent! Please, check out your email.</span>;
		}
		if (s.codeSending || s.againSending) {
		}
		*/
		return <div>

		</div>;
	}
	render_old(p,s,c,m) {
		var checkoutEmail = false;
		if (!s.codeError) {
			if (m.auth) {
				var auth = m.auth;
				if (!auth.email) return null;
				if (auth.emailVerified) return null;
				checkoutEmail = true;
			} else {
				return null;
			}
		}
		if (s.codeSent) return null;
		var sendOtherCode = null;
		if (!s.codeSending || !s.againSending || !(m.auth||{emailVerificationSent:true}).emailVerificationSent) {
			sendOtherCode = <button
				className="btn btn-sm btn-outline-primary ml-2"
				style={{
					paddingTop: "0px",
					paddingBottom: "0px",
					background: "rgba(255,255,255,.1)",
					color: "white",
					borderColor: "white",
				}}
				onClick={this.sendAgain.bind(this)}
			>send other code</button>;
		}
		if (s.codeSent) {
			sendOtherCode = <button
				className="btn btn-sm btn-outline-primary ml-2"
				style={{
					paddingTop: "0px",
					paddingBottom: "0px",
					background: "rgba(255,255,255,.1)",
					color: "white",
					borderColor: "white",
				}}
				onClick={()=>window.location.href.reload()}
			>reload page</button>;
		}
		var text = null;
		if (checkoutEmail || s.codeSent || s.againSent) {
			text = <span>Sent! Please, check out your email.</span>;
		}
		if (s.codeSending || s.againSending) {
			text = <span>
				Sending
				<span style={{
					display: "inline-block",
					width: "24px",
					height: "16px",
					position: "relative",
					marginLeft: "4px",
					color: "white",
				}}>
					<img src="img/loader-white.svg" width="24" height="24"
					style={{
						position: "relative",
						top: "0px",
						color: "white",
					}} />
				</span>
			</span>;
		}
		if (s.codeError || s.againEr) {
			text = <div style={{marginTop:"-0.5em",marginBottom:"-1em"}}>
				<Form.ServerError serverError={s.againEr || s.codeError} />
			</div>
		}
		if (!text) return null;
		return <div className="notification">
			<div style={{marginBottom:"0.5em"}}>
				<b>Verify email</b> {sendOtherCode}
			</div>
			{text}
		</div>;
	}
	sendAgain() {
		var p = this.props;
		this.setState({againSending:true,againSent:false,againEr:null,codeError:null});
		p.m.api.requestCodeToVerifyEmail()
		.then(()=>{
			this.setState({againSending:false,againSent:true});
		})
		.catch(er=>{
			this.setState({againSending:false,againSent:false,againEr:er});
		});
	}
}

Page.NotificationVerifyEmail = NotificationVerifyEmail;

Page.PageWrapWidth = PageWrapWidth;
Page.PageWrapHeader = PageWrapHeader;
Page.PageWrapDevice = PageWrapDevice;
Page.PageWrapProfile = PageWrapProfile;
Page.PageWrapProfileLeft = PageWrapProfileLeft;
Page.PageWrapProfileWidth = PageWrapProfileWidth;

Page.propTypes = {
	pagePostfix: Any.PropTypes.string,
	header: Any.PropTypes.oneOf([
		"none",
		"short",
	])
};

export default Page;
