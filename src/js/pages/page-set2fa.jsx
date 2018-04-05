import React from 'react';
import T from '../tags.jsx';

class PageSet2FA extends T.Page {
	constructor(props) {
		super(props);
		this.setState({});
	}
	render(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="set2fa">
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s}></T.Page.PageWrapHeader>
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
					{s.helpOpened ? this.render_helpOpened(p,s,c,m) : this.render_helpClosed(p,s,c,m)}
					{s.generateOpened ? this.render_generateOpened(p,s,c,m) : null}
					{this.render_generateClosed(p,s,c,m)}
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
			<div className="row d-flex justify-content-center">
				<div className="mb-2 col-8 d-flex flex-column justify-content-center" style={{border:"1px solid #e5e6e7",marginTop:"25px"}}>
					<div className="d-flex justify-content-center" style={{position:"relative",top:"-1.6em"}}>
						<button className="btn btn-lg btn-outline-primary" onClick={()=>{this.setState({helpOpened:false})}} style={{minWidth:"200px"}}>
							How It Works
						</button>
					</div>
					<div className="row d-flex justify-content-center">
						<div className="mb-2 col-9">
							<p style={{"textAlign":"center"}}>You must have an authentication app installed on your phone or tablet. This app generates access codes for your Populous account. We will ask you to enter these codes to confirm some important actions for your account, like login or changing account settings.</p>
							<p style={{"textAlign":"center"}}>If you lost your authentication app or device, you can reset 2FA via email, like your password.</p>
							<p style={{"textAlign":"center"}}>Authentication apps we can recommend are:</p>
							<div className="d-flex align-items-space-between justify-content-between apps-block">
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
									<T.A href="https://authy.com/" external><img src="/img/set2fa-authy.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/></T.A>
									<br />
									<b>Authy</b>
									<br />
									<span>
										<T.A href={"https://itunes.apple.com/"+country+"/app/authy/id494168017"} external className="mr-1">App Store</T.A>
										<T.A href="https://play.google.com/store/apps/details?id=com.authy.authy" external className="ml-1">Google Play</T.A>
									</span>
								</div>
								<div className="app-block">
									<T.A href="https://duo.com/" external><img src="/img/set2fa-duo.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/></T.A>
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
			<div className="row d-flex justify-content-center">
				<div className="mb-4 col-8 d-flex flex-column justify-content-center" style={{border:"1px solid #e5e6e7",marginTop:"25px"}}>
					<div className="row d-flex justify-content-center">
						<div className="mb-2 col-9 pt-4">
							<p style={{"textAlign":"center"}} className="mt-3">
								Add a new account at authentication app and scan the QR-code or enter the key below manually.
							</p>
							<p style={{"textAlign":"center"}}>
								Enter this key:
								<br />
								<b>NZZUI4ZIPI5SS2CAERWVESRDOVQXK32U</b>
							</p>
							<p style={{"textAlign":"center"}}>
								QR-code:
								<br />
								<img src="/img/qr-test.png" width="164" height="164" alt="QR code image" />
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
	render_generateClosed(p,s,c,m) {
		return <div className="mb-4" style={{minWidth:"200px"}}>
			<button className="btn btn-lg btn-primary w-100" onClick={()=>this.setState({generateOpened:!s.generateOpened})}>
				Generate key
			</button>
		</div>;
	}
}

export default PageSet2FA;
