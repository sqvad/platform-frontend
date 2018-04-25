import React from 'react';
import T from '../tags.jsx';

class PageSet2FA extends T.Page {
	constructor(props) {
		super(props);
		props.m.api.loadLib_qrcode()
		.then(()=>{
			return new Promise(resolve=>{
				this.setState({qrLibLoaded:true}, resolve);
			});
		});
		props.m.api.getAuthData();
		// this.showPopup_finish2fa();
	}
	render(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="set2fa" popup={s.popup}>
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s} noSignIn={true}></T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<h1 className="h1-center d-flex flex-column align-items-center">
					<img src="/img/set2fa-header.png" width="311" height="122" className="d-block mb-4"/>
					PLEASE SETUP 2-FACTOR AUTHENTICATION
					<br />
				</h1>
				<p className="h1-addition">
					2-factor authentication (2FA) is a reliable and simple way to keep the account safe.
					<br />
					Security is in high priority for us, so we ensure that all users setup 2FA.
				</p>
				<div className="d-flex flex-column align-items-center">
					{this.render_helpOpened(p,s,c,m)}
					{this.render_generateOpened(p,s,c,m)}
					{!s.generateOpened ? this.render_generateClosed(p,s,c,m) : this.render_check2fa(p,s,c,m)}
				</div>
				<p className="p-muted" style={{"textAlign":"center"}}>
					Had problems with setup? Please check our tutorials:
					<br />
					<br />
					<T.A {...p} href="https://en.wikipedia.org/wiki/Google_Authenticator" external>Tutorial for Google Authenticator</T.A>
					<br />
					<br />
					<T.A {...p} href="https://authy.com/what-is-2fa/" external>Tutorial for Authy</T.A>
				</p>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	render_helpOpened(p,s,c,m) {
		var country = (m && m.user && m.user.country || "us").toLowerCase();
		return <div>
			<div className={"row d-flex justify-content-center smooth-opening-"+(s.helpOpened?"opened":"closed")} style={{marginTop:"-10px"}}>
				<div className={[
					"d-flex flex-column justify-content-center smooth-opening-border",
					m.device.isDesktop ? "col-9" : "mr-1 ml-1"
				].filter(v=>!!v).join(" ")}>
					<div className="d-flex justify-content-center" style={{position:"relative",top:"-1.6em"}}>
						<button className="btn btn-lg btn-outline-primary"
							onClick={()=>{this.setState({helpOpened:!this.state.helpOpened})}}
						style={{minWidth:"200px"}}>
							How It Works
						</button>
					</div>
					<div className="row d-flex justify-content-center smooth-opening-content">
						<div className="mb-2 col-10">
							<p style={{"textAlign":"center"}}>You must have an authentication app installed on your phone or tablet. This app generates access codes for your INS account. We will ask you to enter these codes to confirm some important actions for your account, like login or changing account settings.</p>
							<p style={{"textAlign":"center"}}>If you lost your authentication app or device, you can reset 2FA via email, like your password.</p>
							<p style={{"textAlign":"center"}}>Authentication apps we can recommend are:</p>
							<div className="d-flex align-items-space-between justify-content-between apps-block mb-4">
								<div className="app-block">
									<img src="/img/set2fa-ga.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/>
									<br />
									<b>Google Authenticator</b>
									<br />
									<span>
										<T.A href={"https://itunes.apple.com/"+country+"/app/google-authenticator/id388497605"} external className="mr-1">App Store</T.A>
										<T.A href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" external className="ml-1">Google Play</T.A>
									</span>
								</div>
								<div className="app-block">
									<img src="/img/set2fa-authy.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/>
									<br />
									<b>Authy</b>
									<br />
									<span>
										<T.A href={"https://itunes.apple.com/"+country+"/app/authy/id494168017"} external className="mr-1">App Store</T.A>
										<T.A href="https://play.google.com/store/apps/details?id=com.authy.authy" external className="ml-1">Google Play</T.A>
									</span>
								</div>
								<div className="app-block">
									<img src="/img/set2fa-duo.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/>
									<br />
									<b>Duo Mobile</b>
									<br />
									<span>
										<T.A href={"https://itunes.apple.com/"+country+"/app/duo-mobile/id422663827"} external className="mr-1">App Store</T.A>
										<T.A href="https://play.google.com/store/apps/details?id=com.duosecurity.duomobile" external className="ml-1">Google Play</T.A>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
	render_helpClosed(p,s,c,m) {
		return <div className="mb-2" style={{minWidth:"200px"}}>
			<button className="btn btn-lg btn-outline-primary w-100" onClick={()=>{this.setState({helpOpened:true})}}>
				How It Works
			</button>
		</div>;
	}
	render_generateOpened(p,s,c,m) {
		return <div className="w-100">
			<div
				className={"row d-flex justify-content-center smooth-opening-"+(s.generateOpened?"opened":"closed")}
				style={{
					marginBottom: s.generateOpened ? "" : "-51px"
				}}
			>
				<div className={[
					"mb-4 d-flex flex-column justify-content-center smooth-opening-border",
					m.device.isDesktop ? "col-9" : "mr-1 ml-1"
				].filter(v=>!!v).join(" ")} style={{marginTop: "0px"}}>
					<div className="row d-flex justify-content-center smooth-opening-content">
						<T.If v={s.totpSecretKey} key="totpSecretKey">
							<div className="mb-2 col-9 pt-4">
								<p style={{"textAlign":"center"}} className="mt-3">
									Add a new account at authentication app and scan the QR-code or enter the key below manually.
								</p>
								<p style={{"textAlign":"center"}}>
									Enter this key:
									<br />
									<b><T.A m={m} href={s.gaLink} external>{s.totpSecretKey}</T.A></b>
								</p>
								<p style={{"textAlign":"center"}}>
									QR-code:
									<br />
									<T.A m={m} href={s.gaLink} external>
										<img src={s.qrDataUrl} width="228" height="228" alt={s.qrDataUrl?"QR code is loading...":"QR code for "+ s.gaLink} />
									</T.A>
								</p>
							</div>
						</T.If>
						<T.If v={!s.totpSecretKey} key="totpSecretKeyLoading">
							<div className="mb-2 col-9 pt-4">
								<p style={{"textAlign":"center"}} className="mt-3">
									Fetching. Please wait...
								</p>
							</div>
						</T.If>
					</div>
				</div>
			</div>
		</div>;
	}
	render_generateClosed(p,s,c,m) {
		return <div className="mb-4" style={{minWidth:"200px"}}>
			<button className="btn btn-lg btn-primary w-100" onClick={()=>this.generateKey()}>
				Generate key
			</button>
		</div>;
	}
	generateKey() {
		var p = this.props;
		Promise.all([
			p.m.api.loadLib_qrcode()
			.then(()=>{
				return new Promise(resolve=>{
					this.setState({qrLibLoaded:true}, resolve);
				});
			}),
			p.m.api.getAuthData()
			.then(()=>{
				return p.m.api.generateTotpSecretKey()
				.then(x=>{
					return new Promise(resolve=>{
						var host = p.m.settings.api.totpDomain;
						if (host=='window.location.hostname') {
							host = window.location.hostname;
						}
						var gaLink = 'otpauth://totp/'+host+':'+p.m.auth.email+'?secret='+x+'&issuer='+host+'&algorithm=SHA1&digits=6&period=30';
						this.setState({totpSecretKey:x,gaLink}, resolve);
					});
				})
			})
		])
		.then(()=>{
			qrcodelib.toDataURL(this.state.gaLink, (err, url)=>{
				this.setState({qrDataUrl:url});
			});
		});
		this.setState({generateOpened:true});
	}
	render_check2fa(p,s,c,m) {
		return <div className="mb-4" style={{minWidth:"200px"}}>
			<button className="btn btn-lg btn-primary w-100" onClick={()=>{
				this.showPopup_finish2fa();
			}}>
				Finish
			</button>
		</div>;
	}
	showPopup_finish2fa() {
		var popup = <T.Popup.Finish2fa {...this.props} onClose={()=>this.setState({popup:null})} />;
		this.setState({popup});
	}
}

export default PageSet2FA;
