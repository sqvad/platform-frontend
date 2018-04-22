import React from 'react';
import T from '../tags.jsx';
import PageWallets from './page-wallets.jsx';

class PageSettings extends T.Page {
	constructor(props) {
		super(props);
		props.m.api.getDefaultClassicCurrency().then(defaultClassicCurrency=>{
			this.setState({defaultClassicCurrency});
		});
	}
	render(p,s,c,m) {
		return this._render(p,s,c,m);
		var _m = JSON.parse(JSON.stringify(PageWallets.mockupModel));
		_m = Object.assign(_m, m);
		var _p = JSON.parse(JSON.stringify(p));
		var _s = JSON.parse(JSON.stringify(s));
		if (!_s.tab) {
			// _s.tab = "general";
			// _s.tab = "changePassword";
			// _s.tab = "2faDisable";
			// _s.tab = "2faRecover";
		}
		return this._render(_p,_s,c,_m);
	}
	_render(p,s,c,m) {
		var tab = s.tab || "general";
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p} {...s} tab="settings" />
				</T.Page.PageWrapProfileLeft>
				<div className="w-100 d-flex flex-column">
					<T.Page.PageWrapProfileWidth>
						<h1>Settings</h1>
						<div
							className={
								[
									"btn-group btn-group-toggle d-flex justify-content-start flex-wrap",
									m.device.isMobile ? "flex-column" : ""
								].filter(v=>v).join(" ")
							}
							style={{marginBottom:"30px"}}
						>
							<div
								className={"btn "+(tab=="general"? "btn-secondary active":" btn-outline-secondary")}
								onClick={()=>{this.setState({tab:"general"})}} style={{marginLeft:m.device.isMobile?"-1px":""}}
							>General</div> 
							<div
								className={"btn "+(tab=="changePassword"? "btn-secondary active":" btn-outline-secondary")}
								onClick={()=>{this.setState({tab:"changePassword"})}} style={{marginTop:m.device.isMobile?"-1px":""}}
							>Change Password</div>
							<div
								className={"btn "+(tab=="2faDisable"? "btn-secondary active":" btn-outline-secondary")}
								onClick={()=>{this.setState({tab:"2faDisable"})}} style={{marginTop:m.device.isMobile?"-1px":""}}
							>Disable 2FA</div>
							<div
								className={"btn "+(tab=="2faRecover"? "btn-secondary active":" btn-outline-secondary")}
								onClick={()=>{this.setState({tab:"2faRecover"})}} style={{marginTop:m.device.isMobile?"-1px":""}}
							>Recover 2FA</div>
						</div>
					</T.Page.PageWrapProfileWidth>
					<div style={{background:"#f3f5fa",flex:1}}>
						<T.Page.PageWrapProfileWidth skipLogo>
							<div style={{paddingTop:"30px"}}>
								{tab=="general"? this.render_general(p,s,c,m) :null}
								{tab=="changePassword"? this.render_changePassword(p,s,c,m) :null}
								{tab=="2faDisable"? this.render_2faDisable(p,s,c,m) :null}
								{tab=="2faRecover"? this.render_2faRecover(p,s,c,m) :null}
							</div>
						</T.Page.PageWrapProfileWidth>
					</div>
					<br /><br />
				</div>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	render_general(p,s,c,m) {
		return <div>
			<h2>DEFAULT CURRENCY</h2>
			<p>You can choose which currency to show by default for your crypto holdings.</p>
			<T.Form onSubmit={()=>this.onCurrency_save()}>
				<div style={{maxWidth:"236px"}}>
					<T.Select
						value={s.defaultClassicCurrency||m.defaultClassicCurrency} onChange={v=>this.onCurrency_choose(v)}
						useFormControl className="form-control" placeholder="Default currency" inputGroupCls="border4sides"
						options={[
							{id:"USD", text:"USD"},
							{id:"EUR", text:"EUR"},
							{id:"CNY", text:"CNY"},
							{id:"JPY", text:"JPY"},
							{id:"KOW", text:"KOW"},
							{id:"AUD", text:"AUD"},
						]}
					/>
				</div>
				<button type="submit"
					className={[
						"btn btn-lg btn-primary",
						(s.defaultClassicCurrency!=m.defaultClassicCurrency) ? "" : " disabled",
					].join(" ")}
				>
					Save changes
				</button>
			</T.Form>
		</div>
	}
	onCurrency_choose(defaultClassicCurrency) {
		// this.props.m.api.setDefaultClassicCurrency(v);
		this.setState({defaultClassicCurrency});
	}
	onCurrency_save() {
		this.props.m.api.setDefaultClassicCurrency(this.state.defaultClassicCurrency)
		.then(defaultClassicCurrency=>{
			this.setState({defaultClassicCurrency});
		});
	}
	render_changePassword(p,s,c,m) {
		return <div>
			<h2>CHANGE YOUR PASSWORD</h2>
			<p>You will be logged out of all other devices after changing your password.</p>
			<T.Form onSubmit={this.onPassword_save.bind(this)} handler={this}>
				<div style={{maxWidth:"482px"}}>
					<T.Input.Password
						value={s.passworCur||""} onChange={this.onPassword_cur.bind(this)}
						inputGroupCls="border4sides" placeholder="Current password" autocomplete="off"
					/>
					<T.Input.Password
						value={s.passworNew||""} onChange={this.onPassword_new.bind(this)}
						inputGroupCls="border4sides" placeholder="New password" autocomplete="off"
					/>
					<T.Input.PasswordConfirm
						value={s.passworConfirm||""} onChange={this.onPassword_confirm.bind(this)}
						password={s.passworNew}
						inputGroupCls="border4sides" placeholder="Repeat new password" autocomplete="off"
					/>
					{this.form && this.form.renderServerError()}
				</div>
				<T.If v={s.passwordChanged && !s.serverError}>
					<p>
						Password changed.
					</p>
				</T.If>
				<T.Form.SubmitButton
					clsColor="btn-primary" cls="btn-lg"
					canSubmit={s.canSubmitPassword && !s.serverError && !s.passwordChanged} fetching={s.fetching}
					text="Save changes"
				/>
			</T.Form>
		</div>
	}
	password_checkValid() {
		var s = this.state || {};
		var passworConfirmValid = s.passworNewValid && s.passworNew==s.passworConfirm;
		var canSubmitPassword = s.passworCurValid && passworConfirmValid;
		this.form.forgotAboutServerError();
		this.setState({passworConfirmValid,canSubmitPassword,passwordChanged:false});
	}
	onPassword_cur(passworCur,passworCurValid) {
		this.setState({passworCur,passworCurValid}, ()=>this.password_checkValid());
	}
	onPassword_new(passworNew,passworNewValid) {
		this.setState({passworNew,passworNewValid}, ()=>this.password_checkValid());
	}
	onPassword_confirm(passworConfirm,passworConfirmValid) {
		this.setState({passworConfirm,passworConfirmValid}, ()=>this.password_checkValid());
	}
	onPassword_save() {
		return T.Form.wrapFetch(this, true,
			this.props.m.api.changePassword(this.state.passworCur, this.state.passworConfirm)
		)
		.then(x=>{
			this.setState({passwordChanged:true});
		});
	}
	render_2faDisable(p,s,c,m) {
		return <div>
			<h2>2-FACTOR AUTHENTICATION</h2>
			<p>
				You currently have 2FA enabled.
				<br />
				You can change the 2FA method by first disabling the current one and afterwards setting up the new method.
			</p>
			<T.Form onSubmit={()=>{}}>
				<button type="submit"
					className={[
						"btn btn-lg btn-primary",
					].join(" ")}
				>
					DISABLE 2FA
				</button>
			</T.Form>
		</div>
	}
	render_2faRecover(p,s,c,m) {
		var country = (m && m.user && m.user.country || "us").toLowerCase();
		return <div style={{maxWidth:"550px"}}>
			<h2>2-FACTOR AUTHENTICATION</h2>
			<p>
				INS encourages two factor authentication (2FA) to protect your account.
				<br />
				Two factor authentication protects your account with your phone as well as your password.
			</p>
			<p>
				Authentication apps we can recommend are:
			</p>
			<div className="d-flex align-items-space-between justify-content-between apps-block">
				<div className="app-block">
					<img src="/img/set2fa-ga.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/>
					<br />
					<b style={{display:"block",textAlign:"left"}}>Google Authenticator</b>
					<span style={{display:"block",textAlign:"left"}}>
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
			<div style={{marginTop:"36px"}}>
				<T.Form onSubmit={()=>{}}>
					<button type="submit"
						className={[
							"btn btn-lg btn-primary",
						].join(" ")}
						style={{}}
					>
						Generate key
					</button>
				</T.Form>
			</div>
			<div style={{maxWidth:"606px"}}>
				<div style={{border:"1px solid #e5e6e7", background:"white", padding:"29px"}}>
					Add a new account at authentication app and scan the QR-code or enter the key below manually.
					<br /><br />
					Save the code below:<br />
					<b>ZSQS6TWCQRTXPRVL</b>
					<br /><br />
					Enter this key:<br />
					<b>NZZUI4ZIPI5SS2CAERWVESRDOVQXK32U</b>
					<br /><br />
					<span style={{position:"relative",zIndex:2}}>
						QR-code:<br />
					</span>
					<img src="./img/qr-test.png" width="164" height="164" style={{marginLeft:"-16px",marginTop:"-5px"}}/>
				</div>
			</div>
		</div>
	}
}

PageSettings.mockupModel = PageWallets.mockupModel;

export default PageSettings;
