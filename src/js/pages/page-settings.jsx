import React from 'react';
import T from '../tags.jsx';
import PageWallets from './page-wallets.jsx';
import PageForgot2FA from './page-forgot2fa.jsx';

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
		// var tab = s.tab || "2faDisable";
		var divPageStyle = {};
		var divHeaderStyle = {};
		var divContentStyle = {flex:1,paddingBottom:"15px"};
		if (m.device.isMobile) {
			divPageStyle.background = "#f3f5fa";
			divHeaderStyle.background = "#ffffff";
		} else {
			divContentStyle.background = "#f3f5fa";
		}
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s} style={divPageStyle}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p} {...s} tab="settings" />
				</T.Page.PageWrapProfileLeft>
				<div className="w-100 d-flex flex-column">
					<T.Page.PageWrapProfileWidth style={divHeaderStyle}>
						<h1 className="mb-3">Settings</h1>
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
							>2FA</div>
							<div
								className={"btn "+(tab=="2faRecover"? "btn-secondary active":" btn-outline-secondary")}
								onClick={()=>{this.setState({tab:"2faRecover"})}} style={{marginTop:m.device.isMobile?"-1px":""
									,display:"none"
								}}
							>Reset 2FA</div>
						</div>
					</T.Page.PageWrapProfileWidth>
					<div style={divContentStyle}>
						<T.Page.PageWrapProfileWidth skipLogo>
							<div style={{paddingTop:"30px"}}>
								{tab=="general"? this.render_general(p,s,c,m) :null}
								{tab=="changePassword"? this.render_changePassword(p,s,c,m) :null}
								{tab=="2faDisable"? this.render_2faDisable(p,s,c,m) :null}
								{tab=="2faRecover"? this.render_2faRecover(p,s,c,m) :null}
							</div>
						</T.Page.PageWrapProfileWidth>
					</div>
				</div>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	render_general(p,s,c,m) {
		return <div>
			<h2 className="mt-0">DEFAULT CURRENCY</h2>
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
							{id:"KRW", text:"KRW"},
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
			<h2 className="mt-0">CHANGE YOUR PASSWORD</h2>
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
					<T.If v={s.passwordChanged && !s.serverError}>
						<p>
							Password changed.
						</p>
					</T.If>
					<div className={[
						"d-flex mt-4",
						m.device.isMobile ? "justify-content-center" : ""
					].filter(v=>!!v).join(" ")}>
						<T.Form.SubmitButton
							clsColor="btn-primary" cls="btn-lg"
							canSubmit={s.canSubmitPassword && !s.serverError && !s.passwordChanged} fetching={s.fetching}
							text="Save changes"
						/>
					</div>
				</div>
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
		return <Disable2FA {...p} {...s} onDisabled={this.on2faDisabled.bind(this)}/>;
	}
	on2faDisabled() {
		var s = this.state || {};
		if (s.tab=="2faDisable") {
			this.setState({tab:"general"});
		}
	}
	render_2faRecover(p,s,c,m) {
		return <Recover2FA {...p} />;
	}
}

class Disable2FA extends T.Any {
	constructor(props) {
		super(props);
		this.setState({wasEnable:props.m.auth.is2FAOn});
	}
	render(p,s,c,m) {
		var ok = s.sent && !s.serverError;
		var canSubmit = !s.fetching || !s.sent;
		var strNow = s.wasEnable ? "enabled" : "disabled";
		var strSwitch = s.wasEnable ? "disable" : "enable";
		var strSwitched = s.wasEnable ? "disabled" : "enabled";
		return <div>
			<h2 className="mb-3 mt-0">2-FACTOR AUTHENTICATION</h2>
			<p>
				You currently have 2FA&nbsp;
				<T.If v={s.enableAgainSent}><b>
					{strNow}.
				</b></T.If>
				<T.If v={!s.enableAgainSent}><span>
					<T.If v={!ok}><span>
						{strNow}.
					</span></T.If>
					<T.If v={ok}><span>
						<del>{strNow}</del> <b>{strSwitched}.</b>
					</span></T.If>
				</span></T.If>
			</p>
			<p>
				<T.If v={s.wasEnable}><span>
					You can change the 2FA method {"by "}
					<T.If v={ok}><span className="text-muted">
						✔&nbsp;first disabling the current one
					</span></T.If>
					<T.If v={!ok}><span>
						first disabling the current one
					</span></T.If>
					{" and afterwards "}
					<T.If v={s.enableAgainSent}><span><span className="text-muted">
						✔&nbsp;enabling the new method
					</span>.</span></T.If>
					<T.If v={!s.enableAgainSent}><span>
						enabling the new method.
					</span></T.If>
				</span></T.If>
			</p>
			<T.If v={!ok}>
				<button type="submit"
					className={[
						"btn btn-lg btn-primary mt-3",
						canSubmit ? "" : "disabled"
					].filter(v=>!!v).join(" ")}
					disabled={!canSubmit}
					onClick={()=>this.setState({popup:true})}
				>
					{strSwitch} 2FA
				</button>
			</T.If>
			<T.If v={ok}>
				<button type="submit"
					className={[
						"btn btn-lg btn-outline-primary mt-3"
					].filter(v=>!!v).join(" ")}
					onClick={()=>p.onDisabled()}
				>OK</button>
			</T.If>
			<T.If v={s.wasEnable && !s.enableAgainSent}>
				<T.If v={ok || s.popupEnableAgain}>
					<button type="submit"
						className={[
							"btn btn-lg btn-outline-primary mt-3 ml-3",
							s.fetching ? " disabled" : ""
						].filter(v=>!!v).join(" ")}
						disabled={s.fetching}
						onClick={()=>{
							this.setState({popupEnableAgain:true});
						}}
					>Enable</button>
				</T.If>
			</T.If>
			<T.If v={s.popup && p.m.auth.is2FAOn}>
				<T.Popup.Confirm
					{...p} use2fa={true}
					makePromise={(confirmInfo,popup)=>{
						var p = this.props;
						return this.props.m.api.toggle2FASetting(!s.wasEnable, confirmInfo.value)
						.then(x=>{
							var ps = popup && popup.state || {};
							this.setState({fetching:ps.fetching,sent:ps.sent,serverError:ps.serverError});
							return x;
						});
					}}
					catchPromise={er=>{
						this.setState({popup:false,fetching:false,sent:true,serverError:er});
						throw er;
					}}
					onClose={(code,popup)=>{
						if (!popup) {
							this.setState({popup:false});
							return;
						}
						var ret = Promise.resolve();
						var ps = popup.state || {};
						this.setState({popup:false,fetching:ps.fetching,sent:ps.sent,serverError:ps.serverError});
						return ret;
					}}
					str_put2faTo="disable 2FA"
				/>
			</T.If>
			<T.If v={s.popup && !p.m.auth.is2FAOn || s.popupEnableAgain}><div>
				<Recover2FA {...p} onEnabled={()=>{
					this.setState({
						popupEnableAgain:false,
						popup:false,
						sent:true,
						serverError:null,
						// enableAgainSent:true,
					});
				}} />
			</div></T.If>
			<T.If v={0 && s.popupEnableAgain}>
				<T.Popup.Put2fa
					{...p}
					makePromise={(code,popup)=>{
						var p = this.props;
						return this.props.m.api.toggle2FASetting(true, code)
						.then(()=>{
							var ps = popup.state || {};
							this.setState({fetching:ps.fetching,sent:ps.sent,serverError:ps.serverError});
						})
					}}
					onClose={(code,popup)=>{
						if (!popup) {
							this.setState({popupEnableAgain:false});
							return;
						}
						var ret = Promise.resolve();
						var ps = popup.state || {};
						this.setState({
							popupEnableAgain:false,
							fetching:false,
							sent:ps.sent,
							serverError:ps.serverError,
							enableAgainSent:ps.sent,
						});
						return ret;
					}}
				/>
			</T.If>
		</div>
	}
}

class Recover2FA extends T.Any {
	constructor(props) {
		super(props);
		// this.setState({wasEnable:props.m.auth.is2FAOn});
		// props.m.api.loadLib_qrcode();
	}
	render(p,s,c,m) {
		// return <PageForgot2FA {...p} onlyContent={true} />;
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
			<div
				className={[
				"d-flex justify-content-between apps-block",
				m.device.isMobile ? "flex-column align-items-center" : " align-items-space-between"
			].filter(v=>!!v).join(" ")}>
				<div className="app-block">
					<div style={{
						width: m.device.isMobile ? "" : "95%"
					}}>
						<img src="/img/set2fa-ga.png" width="49" height="55" style={{borderBottom:"6px solid transparent"}}/>
					</div>
					<b style={{
						display: "block",
						textAlign: m.device.isMobile ? "" : "left"
					}}>Google Authenticator</b>
					<span style={{
						display:"block",
						textAlign: m.device.isMobile ? "" : "left"
					}}>
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
			<T.If v={!s.newKey}>
				<div style={{marginTop:"36px"}}>
					<T.Form onSubmit={()=>{}}>
						<button type="submit"
							className={[
								"btn btn-lg btn-primary",
								s.showPutOldCodePopup || s.loading ? "disabled" : "",
							].filter(v=>!!v).join(" ")}
							onClick={()=>this.setState({showPutOldCodePopup:true})}
							disabled={s.showPutOldCodePopup || s.loading}
						>
							Generate key
						</button>
					</T.Form>
				</div>
			</T.If>
			<T.If v={s.showPutOldCodePopup}>
				<div>
					<T.Popup.Confirm
						{...p}
						makePromise={confirmInfo=>{
							var s = this.state;
							this.setState({loading:true});
							return p.m.api.totpResetRequest(confirmInfo.value)
							.then(x=>{
								var newKey = x.newSecretKey;
								return p.m.api.loadLib_qrcode()
								.then(()=>{
									var host = p.m.settings.api.totpDomain;
									if (host=='window.location.hostname') {
										host = window.location.hostname;
									}
									var gaLink = 'otpauth://totp/'+host+':'+p.m.auth.email+'?secret='+newKey+'&issuer='+host+'&algorithm=SHA1&digits=6&period=30';
									qrcodelib.toDataURL(gaLink, (err, url)=>{
										this.setState({loading:false,showPutOldCodePopup:false,qrDataUrl:url,newKey,gaLink});
									});
									return x;
								});
							});
						}}
						catchPromise={er=>{
							this.setState({loading:false,showPutOldCodePopup:false});
						}}
						onClose={()=>this.setState({loading:false,showPutOldCodePopup:false})}
					/>
				</div>
			</T.If>
			<T.If v={!s.changed && s.newKey}>
				<div style={{maxWidth:"606px"}} className="mt-4">
					<div style={{border:"1px solid #e5e6e7", background:"white", padding:"29px"}}>
						Add a new account at authentication app and scan the QR-code or enter the key below manually.
						<br /><br />
						Enter this key:{" "}
						<b><T.A m={m} href={s.gaLink} external>{s.newKey}</T.A></b>
						<br /><br />
						<span style={{position:"relative",zIndex:2}}>
							QR-code:<br />
						</span>
						<T.A m={m} href={s.gaLink} external>
							<T.If v={p.m.device.isMobile}>
								<img src={s.qrDataUrl} width="212" height="212" alt={s.qrDataUrl?"QR code is loading...":"QR code for "+ s.gaLink} />
							</T.If>
							<T.If v={!p.m.device.isMobile}>
								<img src={s.qrDataUrl} width="228" height="228" alt={s.qrDataUrl?"QR code is loading...":"QR code for "+ s.gaLink} />
							</T.If>
						</T.A>
					</div>
				</div>
			</T.If>
			<T.If v={s.newKey && !s.changed}>
				<div style={{marginTop:"36px"}}>
					<T.Form onSubmit={()=>{}}>
						<button type="submit"
							className={[
								"btn btn-lg btn-primary",
								s.showPutOldCodePopup || s.loading ? "disabled" : "",
							].filter(v=>!!v).join(" ")}
							onClick={()=>this.setState({showConfirmPopup:true})}
							disabled={s.showConfirmPopup || s.loading}
						>
							Confirm new key
						</button>
					</T.Form>
				</div>
			</T.If>
			<T.If v={s.showConfirmPopup}>
				<div>
					<T.Popup.Confirm
						{...p} use2fa={true}
						makePromise={confirmInfo=>{
							var s = this.state;
							this.setState({loading:true});
							return p.m.api.totpResetConfirm(confirmInfo.value)
							.then(()=>{
								return p.m.api.toggle2FASetting(true, confirmInfo.value);
							})
							.then(()=>{
								this.setState({loading:false,showConfirmPopup:false,changed:true});
								this.props.onEnabled();
							});
						}}
						catchPromise={er=>{
							// debugger;
							this.setState({loading:false,showConfirmPopup:false});
							this.setState({loading:false});
						}}
						onClose={()=>{
							this.setState({loading:false,showConfirmPopup:false})
						}}
						str_put2faTo="enable 2FA"
					/>
				</div>
			</T.If>
			<T.If v={s.changed}>
				<p style={{display:"none"}}>Changed!</p>
			</T.If>
		</div>;
	}
}

PageSettings.mockupModel = PageWallets.mockupModel;

export default PageSettings;
