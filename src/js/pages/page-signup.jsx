import React from 'react';
import T from '../tags.jsx';

class ChooseRole extends T.Any {
	componentDidMount() {
		this.toggle = this.toggle.bind(this);
	}
	render(p,s,c,m) {
		if (!m.userTypes) return null;
		var tree = JSON.parse(JSON.stringify(m.userTypes));
		var cls = [
			"btn-group btn-group-toggle d-flex flex-wrap",
			m.device.isMobile ? "flex-column align-items-stretch" : " justify-content-center",
			p.forgotAboutRole ? "blink-3" : "",
		].filter(v=>!!v).join(" ");
		return <div className="register-as">
			<h2 className="form-header">
				<span style={{
					color: p.forgotAboutRole ? "red" : "inherit",
					transition: "color 0.5s linear, font-size 0.5s linear"
				}}>
					Register as
				</span>
			</h2>
			<div className={cls}>
				{(
					tree.map((v,i)=>{
						var button = null;
						var children = null;
						if (v.children && v.children.length) {
							var isActiveSelf = v.id && v.id==p.role;
							var activeChild = v.children.filter(v=>v.id==p.role)[0];
							var isActive = isActiveSelf || activeChild;
							return <T.Select
								key={"role"+i} value={p.role} onChange={this.onChooseViaSelect.bind(this)}
								className={[
									"btn ",
									isActive? "btn-secondary active" : "btn-outline-secondary",
								].join(" ")}
								options={v.children.map(v=>{return {value:v.id,text:v.title}})}
								placeholder={v.title}
								placeholderOnFocus="Please choose..."
								onBlur={this.onChooseViaSelect.bind(this)}
								style={{
									marginLeft: m.device.isMobile ? "-1px" : "",
									marginTop: m.device.isMobile && i ? "-1px" : ""
								}}
							></T.Select>;
						} else {
							return <div
								key={"role"+i} data-v={v.id} onClick={this.onChooseViaButton.bind(this)}
								className={"btn "+(v.id==p.role? "btn-secondary active":" btn-outline-secondary")}
								style={{
									marginLeft: m.device.isMobile ? "-1px" : "",
									marginTop: m.device.isMobile && i ? "-1px" : ""
								}}
							>
								{v.title}
							</div>;
						}
					})
				)}
			</div>
		</div>;
	}
	toggle(e) {
		var id = e.target.getAttribute("data-v");
		if ((this.state||{}).opened==id) {
			this.setState({opened:null});
		} else {
			this.setState({opened:id});
		}
	}
	onChooseViaButton(e) {
		this.props.onChoose(e.target.getAttribute("data-v"));
	}
	onChooseViaSelect(v) {
		this.props.onChoose(v);
	}
}

class PageSignUp extends T.Page {
	constructor(props) {
		super(props);
		this.setState({page: 1});
		// this.setState({
		// 	page: 2,
		// 	email:"some.box@gmail.com",
		// 	password:"some.box..,,",
		// 	passwordConfirm:"some.box..,,",
		// 	role:"WAREHOUSE_PROVIDER",
		// 	firstName:"walter",
		// 	lastName:"skiner",
		// 	country:"us",
		// 	occupation: "11",
		// 	companyName: "11",
		// 	companyNumber: "11",
		// 	companyDescription: "11",
		// 	addressLine1: "11",
		// 	addressLine2: "11",
		// 	city: "11",
		// 	postcode: "11",
		// 	phoneAreaCode: "11",
		// 	phoneNumberCode: "11",
		// });
		props.m.api.getAuthData();
		props.m.api.getUserData();
		props.m.api.getUserTypes().then(userTypes=>{
			this.setState({userTypes:userTypes});
		});
	}
	render(p,s,c,m) {
		var page1 = <PageSignUp_page1 {...p} {...s} m={m} onSubmit={this.goto2ndPage.bind(this)} />;
		var page2 = <PageSignUp_page2 {...p} {...s} m={m} onPrev={this.goto1stPage.bind(this)} onSubmit={this.register.bind(this)} />;
		if (s.page==1) {
			return <div>
				<div key="page1">{page1}</div>
				<div key="page2" style={{display:"none"}}>{page2}</div>
			</div>;
		} else {
			return <div>
				<div key="page1" style={{display:"none"}}>{page1}</div>
				<div key="page2">{page2}</div>
			</div>;
		}
	}
	goto1stPage(result, skipPage, clb) {
		var changes = {
			role: ('role' in result) ? result.role : this.state.role || this.props.role,
			firstName: ('firstName' in result) ? result.firstName : this.state.firstName || this.props.firstName,
			lastName: ('lastName' in result) ? result.lastName : this.state.lastName || this.props.lastName,
			country: ('country' in result) ? result.country : this.state.country || this.props.country,
			occupation: ('occupation' in result) ? result.occupation : this.state.occupation || this.props.occupation,
			companyName: ('companyName' in result) ? result.companyName : this.state.companyName || this.props.companyName,
			companyNumber: ('companyNumber' in result) ? result.companyNumber : this.state.companyNumber || this.props.companyNumber,
			companyDescription: ('companyDescription' in result) ? result.companyDescription : this.state.companyDescription || this.props.companyDescription,
			addressLine1: ('addressLine1' in result) ? result.addressLine1 : this.state.addressLine1 || this.props.addressLine1,
			addressLine2: ('addressLine2' in result) ? result.addressLine2 : this.state.addressLine2 || this.props.addressLine2,
			city: ('city' in result) ? result.city : this.state.city || this.props.city,
			postcode: ('postcode' in result) ? result.postcode : this.state.postcode || this.props.postcode,
			phoneAreaCode: ('phoneAreaCode' in result) ? result.phoneAreaCode : this.state.phoneAreaCode || this.props.phoneAreaCode,
			phoneNumberCode: ('phoneNumberCode' in result) ? result.phoneNumberCode : this.state.phoneNumberCode || this.props.phoneNumberCode,
		};
		if (skipPage!==true) changes.page = 1;
		this.setState(changes, clb);
	}
	goto2ndPage(result) {
		this.setState({
			role: ('role' in result) ? result.role : this.state.role || this.props.role,
			email: ('email' in result) ? result.email : this.state.email || this.props.email,
			password: ('password' in result) ? result.password : this.state.password || this.props.password,
			passwordConfirm: ('passwordConfirm' in result) ? result.passwordConfirm : this.state.passwordConfirm || this.props.passwordConfirm,
			page: 2
		});
	}
	register(result) {
		return new Promise((resolve, reject)=>{
			this.goto1stPage(result, true, ()=>{
				this.props.m.api.register(this.state).then(resolve).catch(reject)
				.then(x=>{
					var m = this.props.m;
					if (m.path.contains["signup"]) {
						m.api.gotoHref(T.A.href({href:"/"},m));
					}
				});
			});
		});
	}
}
class PageSignUp_page1 extends T.Page {
	constructor(props) {
		super(props);
	}
	render(p,s,c,m) {
		var canSubmit = s.canSubmit;
		var emailUnavaible = s.emailAvaible===false;
		var emailFetching = s.emailAvaible===null;
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...s}>
				<hgroup>
					<h1>SING UP FOR <span className="nobr-mobile">INS ECOSYSTEM</span></h1>
					<h2>Join the breakthrough in the consumer <span className="nobr-mobile">goods industry</span></h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<T.Form onSubmit={()=>{s.canSubmit && p.onSubmit(s)}}>
					<ChooseRole m={m} {...p} {...s} onChoose={this.onRole.bind(this)} />
					<div className="row d-flex justify-content-center">
						<div className="col-sm-6">
							<T.Input.Email
								name="email" onChange={this.onEmail.bind(this)}
								value={s.email} required
								unavaibleForRegistration={emailUnavaible}
								emailFetching={emailFetching}
							/>
							<T.Input.Password
								name="password" onChange={this.onPassword.bind(this)}
								value={s.password} required
							/>
							<T.Input.PasswordConfirm
								onChange={this.onPasswordConfirm.bind(this)}
								value={s.passwordConfirm} required
								password={s.password} autocomplete="off"
							/>
							<div className="d-flex justify-content-center mt-4 mb-3">
								<button type="submit"
									className={[
										"btn btn-lg btn-primary",
										"btn-with-icon-at-right-side",
										canSubmit ? "" : " disabled",
									].join(" ")}
								>
									Next
									<span className={[
										"icon icon-24 icon-next",
										canSubmit ? " icon-white" : " icon-disabled",
									].join(" ")}></span>
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
		var canSubmit_noRole = s.emailValid && s.passwordValid && s.passwordConfirmValid && s.emailAvaible;
		var canSubmit = s.role && canSubmit_noRole;
		this.setState({canSubmit, forgotAboutRole:canSubmit_noRole&&!canSubmit});
		return canSubmit;
	}
	onRole(roleId) {
		this.setState({role:roleId}, ()=>{this.checkValid()});
	}
	onEmail(v, valid) {
		this.setState({email:v,emailValid:valid,emailAvaible:valid?null:true}, ()=>{
			this.checkValid();
			if (valid) {
				this.props.m.api.isEmailAvailable(v)
				.then(v=>{
					// this.setState({emailAvaible:false}, ()=>{this.checkValid()});
					this.setState({emailAvaible:v}, ()=>{this.checkValid()});
				});
			}
		});
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
		this.setState({passwordConfirm:v,passwordConfirmValid:valid}, ()=>{this.checkValid()});
	}
};
class PageSignUp_page2 extends T.Page {
	constructor(props) {
		super(props);
		this.setState({
			firstName: props.firstName,
			lastName: props.lastName,
			country: props.country,
			occupation: props.occupation,
			companyName: props.companyName,
			companyNumber: props.companyNumber,
			companyDescription: props.companyDescription,
			addressLine1: props.addressLine1,
			addressLine2: props.addressLine2,
			city: props.city,
			postcode: props.postcode,
			phoneAreaCode: props.phoneAreaCode,
			phoneNumberCode: props.phoneNumberCode,
		});
		this.checkValid();
		this.countries = [
			{"text":"Afghanistan","id":"AF"},{"text":"Aland Islands !Åland Islands","id":"AX"},{"text":"Albania","id":"AL"},{"text":"Algeria","id":"DZ"},{"text":"American Samoa","id":"AS"},{"text":"Andorra","id":"AD"},{"text":"Angola","id":"AO"},{"text":"Anguilla","id":"AI"},{"text":"Antarctica","id":"AQ"},
			{"text":"Antigua and Barbuda","id":"AG"},{"text":"Argentina","id":"AR"},{"text":"Armenia","id":"AM"},{"text":"Aruba","id":"AW"},{"text":"Australia","id":"AU"},{"text":"Austria","id":"AT"},{"text":"Azerbaijan","id":"AZ"},{"text":"Bahamas","id":"BS"},{"text":"Bahrain","id":"BH"},{"text":"Bangladesh","id":"BD"},{"text":"Barbados","id":"BB"},{"text":"Belarus","id":"BY"},{"text":"Belgium","id":"BE"},{"text":"Belize","id":"BZ"},{"text":"Benin","id":"BJ"},
			{"text":"Bermuda","id":"BM"},{"text":"Bhutan","id":"BT"},{"text":"Bolivia (Plurinational State of)","id":"BO"},{"text":"Bonaire, Sint Eustatius and Saba","id":"BQ"},{"text":"Bosnia and Herzegovina","id":"BA"},{"text":"Botswana","id":"BW"},{"text":"Bouvet Island","id":"BV"},{"text":"Brazil","id":"BR"},{"text":"British Indian Ocean Territory","id":"IO"},{"text":"Brunei Darussalam","id":"BN"},{"text":"Bulgaria","id":"BG"},
			{"text":"Burkina Faso","id":"BF"},{"text":"Burundi","id":"BI"},{"text":"Cabo Verde","id":"CV"},{"text":"Cambodia","id":"KH"},{"text":"Cameroon","id":"CM"},{"text":"Canada","id":"CA"},{"text":"Cayman Islands","id":"KY"},{"text":"Central African Republic","id":"CF"},{"text":"Chad","id":"TD"},{"text":"Chile","id":"CL"},{"text":"China","id":"CN"},{"text":"Christmas Island","id":"CX"},
			{"text":"Cocos (Keeling) Islands","id":"CC"},{"text":"Colombia","id":"CO"},{"text":"Comoros","id":"KM"},{"text":"Congo","id":"CG"},{"text":"Congo (Democratic Republic of the)","id":"CD"},{"text":"Cook Islands","id":"CK"},{"text":"Costa Rica","id":"CR"},{"text":"Cote d'Ivoire !Côte d'Ivoire","id":"CI"},{"text":"Croatia","id":"HR"},{"text":"Cuba","id":"CU"},
			{"text":"Curacao !Curaçao","id":"CW"},{"text":"Cyprus","id":"CY"},{"text":"Czechia","id":"CZ"},{"text":"Denmark","id":"DK"},{"text":"Djibouti","id":"DJ"},{"text":"Dominica","id":"DM"},{"text":"Dominican Republic","id":"DO"},{"text":"Ecuador","id":"EC"},{"text":"Egypt","id":"EG"},{"text":"El Salvador","id":"SV"},{"text":"Equatorial Guinea","id":"GQ"},{"text":"Eritrea","id":"ER"},{"text":"Estonia","id":"EE"},{"text":"Ethiopia","id":"ET"},
			{"text":"Falkland Islands (Malvinas)","id":"FK"},{"text":"Faroe Islands","id":"FO"},{"text":"Fiji","id":"FJ"},{"text":"Finland","id":"FI"},{"text":"France","id":"FR"},{"text":"French Guiana","id":"GF"},{"text":"French Polynesia","id":"PF"},
			{"text":"French Southern Territories","id":"TF"},{"text":"Gabon","id":"GA"},{"text":"Gambia","id":"GM"},{"text":"Georgia","id":"GE"},
			{"text":"Germany","id":"DE"},{"text":"Ghana","id":"GH"},{"text":"Gibraltar","id":"GI"},{"text":"Greece","id":"GR"},{"text":"Greenland","id":"GL"},{"text":"Grenada","id":"GD"},{"text":"Guadeloupe","id":"GP"},{"text":"Guam","id":"GU"},{"text":"Guatemala","id":"GT"},{"text":"Guernsey","id":"GG"},{"text":"Guinea","id":"GN"},{"text":"Guinea-Bissau","id":"GW"},{"text":"Guyana","id":"GY"},{"text":"Haiti","id":"HT"},
			{"text":"Heard Island and McDonald Islands","id":"HM"},{"text":"Holy See","id":"VA"},{"text":"Honduras","id":"HN"},{"text":"Hong Kong","id":"HK"},{"text":"Hungary","id":"HU"},{"text":"Iceland","id":"IS"},{"text":"India","id":"IN"},{"text":"Indonesia","id":"ID"},{"text":"Iran (Islamic Republic of)","id":"IR"},{"text":"Iraq","id":"IQ"},{"text":"Ireland","id":"IE"},
			{"text":"Isle of Man","id":"IM"},{"text":"Israel","id":"IL"},{"text":"Italy","id":"IT"},{"text":"Jamaica","id":"JM"},{"text":"Japan","id":"JP"},{"text":"Jersey","id":"JE"},{"text":"Jordan","id":"JO"},{"text":"Kazakhstan","id":"KZ"},{"text":"Kenya","id":"KE"},{"text":"Kiribati","id":"KI"},{"text":"Korea (Democratic People's Republic of)","id":"KP"},{"text":"Korea (Republic of)","id":"KR"},{"text":"Kuwait","id":"KW"},{"text":"Kyrgyzstan","id":"KG"},
			{"text":"Lao People's Democratic Republic","id":"LA"},{"text":"Latvia","id":"LV"},{"text":"Lebanon","id":"LB"},{"text":"Lesotho","id":"LS"},{"text":"Liberia","id":"LR"},{"text":"Libya","id":"LY"},{"text":"Liechtenstein","id":"LI"},{"text":"Lithuania","id":"LT"},{"text":"Luxembourg","id":"LU"},{"text":"Macao","id":"MO"},
			{"text":"Macedonia (the former Yugoslav Republic of)","id":"MK"},{"text":"Madagascar","id":"MG"},{"text":"Malawi","id":"MW"},{"text":"Malaysia","id":"MY"},{"text":"Maldives","id":"MV"},{"text":"Mali","id":"ML"},{"text":"Malta","id":"MT"},{"text":"Marshall Islands","id":"MH"},{"text":"Martinique","id":"MQ"},{"text":"Mauritania","id":"MR"},{"text":"Mauritius","id":"MU"},{"text":"Mayotte","id":"YT"},{"text":"Mexico","id":"MX"},
			{"text":"Micronesia (Federated States of)","id":"FM"},{"text":"Moldova (Republic of)","id":"MD"},{"text":"Monaco","id":"MC"},{"text":"Mongolia","id":"MN"},{"text":"Montenegro","id":"ME"},{"text":"Montserrat","id":"MS"},{"text":"Morocco","id":"MA"},{"text":"Mozambique","id":"MZ"},{"text":"Myanmar","id":"MM"},{"text":"Namibia","id":"NA"},{"text":"Nauru","id":"NR"},{"text":"Nepal","id":"NP"},{"text":"Netherlands","id":"NL"},{"text":"New Caledonia","id":"NC"},
			{"text":"New Zealand","id":"NZ"},{"text":"Nicaragua","id":"NI"},{"text":"Niger","id":"NE"},{"text":"Nigeria","id":"NG"},{"text":"Niue","id":"NU"},{"text":"Norfolk Island","id":"NF"},{"text":"Northern Mariana Islands","id":"MP"},{"text":"Norway","id":"NO"},{"text":"Oman","id":"OM"},{"text":"Pakistan","id":"PK"},{"text":"Palau","id":"PW"},{"text":"Palestine, State of","id":"PS"},{"text":"Panama","id":"PA"},
			{"text":"Papua New Guinea","id":"PG"},{"text":"Paraguay","id":"PY"},{"text":"Peru","id":"PE"},{"text":"Philippines","id":"PH"},{"text":"Pitcairn","id":"PN"},{"text":"Poland","id":"PL"},{"text":"Portugal","id":"PT"},{"text":"Puerto Rico","id":"PR"},{"text":"Qatar","id":"QA"},{"text":"Reunion !Réunion","id":"RE"},{"text":"Romania","id":"RO"},{"text":"Russian Federation","id":"RU"},{"text":"Rwanda","id":"RW"},{"text":"Saint Barthelemy !Saint Barthélemy","id":"BL"},
			{"text":"Saint Helena, Ascension and Tristan da Cunha","id":"SH"},{"text":"Saint Kitts and Nevis","id":"KN"},{"text":"Saint Lucia","id":"LC"},{"text":"Saint Martin (French part)","id":"MF"},{"text":"Saint Pierre and Miquelon","id":"PM"},{"text":"Saint Vincent and the Grenadines","id":"VC"},{"text":"Samoa","id":"WS"},{"text":"San Marino","id":"SM"},{"text":"Sao Tome and Principe","id":"ST"},
			{"text":"Saudi Arabia","id":"SA"},{"text":"Senegal","id":"SN"},{"text":"Serbia","id":"RS"},{"text":"Seychelles","id":"SC"},{"text":"Sierra Leone","id":"SL"},{"text":"Singapore","id":"SG"},{"text":"Sint Maarten (Dutch part)","id":"SX"},{"text":"Slovakia","id":"SK"},{"text":"Slovenia","id":"SI"},{"text":"Solomon Islands","id":"SB"},{"text":"Somalia","id":"SO"},{"text":"South Africa","id":"ZA"},{"text":"South Georgia and the South Sandwich Islands","id":"GS"},
			{"text":"South Sudan","id":"SS"},{"text":"Spain","id":"ES"},{"text":"Sri Lanka","id":"LK"},{"text":"Sudan","id":"SD"},{"text":"Suriname","id":"SR"},{"text":"Svalbard and Jan Mayen","id":"SJ"},{"text":"Swaziland","id":"SZ"},{"text":"Sweden","id":"SE"},{"text":"Switzerland","id":"CH"},{"text":"Syrian Arab Republic","id":"SY"},{"text":"Taiwan, Province of China[a]","id":"TW"},{"text":"Tajikistan","id":"TJ"},
			{"text":"Tanzania, United Republic of","id":"TZ"},{"text":"Thailand","id":"TH"},{"text":"Timor-Leste","id":"TL"},{"text":"Togo","id":"TG"},{"text":"Tokelau","id":"TK"},{"text":"Tonga","id":"TO"},{"text":"Trinidad and Tobago","id":"TT"},{"text":"Tunisia","id":"TN"},{"text":"Turkey","id":"TR"},{"text":"Turkmenistan","id":"TM"},{"text":"Turks and Caicos Islands","id":"TC"},{"text":"Tuvalu","id":"TV"},{"text":"Uganda","id":"UG"},{"text":"Ukraine","id":"UA"},
			{"text":"United Arab Emirates","id":"AE"},{"text":"United Kingdom of Great Britain and Northern Ireland","id":"GB"},{"text":"United States of America","id":"US"},{"text":"United States Minor Outlying Islands","id":"UM"},{"text":"Uruguay","id":"UY"},{"text":"Uzbekistan","id":"UZ"},{"text":"Vanuatu","id":"VU"},{"text":"Venezuela (Bolivarian Republic of)","id":"VE"},{"text":"Viet Nam","id":"VN"},{"text":"Virgin Islands (British)","id":"VG"},
			{"text":"Virgin Islands (U.S.)","id":"VI"},{"text":"Wallis and Futuna","id":"WF"},{"text":"Western Sahara","id":"EH"},{"text":"Yemen","id":"YE"},{"text":"Zambia","id":"ZM"},{"text":"Zimbabwe","id":"ZW"}
		];
	}
	render(p,s,c,m) {
		var canSubmit = s.canSubmit;
		var extendFields = null;
		if (this.useEntendedFields(s)) {
			extendFields = this.render_extendFields(p,s,c,m);
		}
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...p}>
				<hgroup>
					<h1>SING UP FOR INS ECOSYSTEM</h1>
					<h2>Join the breakthrough in the consumer goods industry</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<T.Form onSubmit={()=>{return this.onSubmit(s)}} hideServerError onServerError={()=>this.forceUpdate()} ref={el=>this.form=el}>
					<ChooseRole m={m} {...p} {...s} onChoose={this.onRole.bind(this)} />
					<div className="row d-flex justify-content-center" style={{marginBottom:"15px"}}>
						<div className="col-sm-6">
							<T.Input value={s.firstName} required
								onChange={this.onFirstName.bind(this)} checkValid={v=>v.length}
								type="text" name="name" placeholder="FIRST NAME" hint={s.firstName?"":"E.g. Walter"}
							/>
							<T.Input value={s.lastName} required
								onChange={this.onLastName.bind(this)} checkValid={v=>v.length}
								type="text" name="second-name" placeholder="LAST NAME" hint={s.lastName?"":"E.g. Skinner"}
							/>
							<T.Select value={s.country} required
								onChange={this.onCountry.bind(this)}
								useFormControl className="form-control" placeholder="COUNTRY"
								name="country" options={this.countries}
							></T.Select>
							{extendFields}
							{this.form && this.form.renderServerError()}
							<div className={"d-flex justify-content-between mt-4"+(m.device.isMobile?" flex-column":"")}>
								<T.Form.SubmitButton
									canSubmit={true} fetching={s.fetching}
									type="button" dontChangeText onClick={p.onPrev.bind(this, s)}
									clsColor="btn-outline-primary" cls="btn-lg btn-with-icon-at-left-side" style={{flex:1}}
								>
									Previous
									<span className={"icon icon-24 icon-prev icon-"+(s.fetching?"gray":"violet")}></span>
								</T.Form.SubmitButton>
								<T.Form.SubmitButton
									canSubmit={canSubmit} fetching={s.fetching}
									text="Sign Up"
									clsColor="btn-primary" cls={"btn-lg btn-with-icon-at-right-side "+(m.device.isMobile?"mt-3":"ml-3")} style={{flex:1}}
								/>
							</div>
						</div>
					</div>
				</T.Form>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	onSubmit() {
		return T.Form.wrapFetch(this, false, this.props.onSubmit(this.state));
	}
	render_extendFields(p,s,c,m) {
		return <div>
			<T.Input value={s.occupation} required
				onChange={this.onOccupation.bind(this)} checkValid={v=>v.length}
				type="text" name="occupation" placeholder="Occupation" hint={s.lastName?"":"E.g. owner or CTO"}
			/>
			<T.Input value={s.companyName} required max="100"
				onChange={this.onCompanyName.bind(this)} checkValid={v=>v.length}
				type="text" name="company-name" placeholder="Company name" hint={s.companyName?"":"E.g. My Company"}
			/>
			<T.Input value={s.companyNumber} required max="50"
				onChange={this.onCompanyNumber.bind(this)} checkValid={v=>v.length}
				type="text" name="company-number" placeholder="Company number" hint={
					s.companyNumber?"":
						!s.country
							? "13-digit identifier assigned by the National Tax Agency, or something like this"
							:
							s.country=="us"
								? "13-digit identifier assigned by the National Tax Agency"
								: "Unique registration code"
				}
			/>
			<T.Input value={s.companyDescription} required max="250"
				onChange={this.onCompanyDescription.bind(this)} checkValid={v=>v.length}
				type="text" name="company-description" placeholder="Company description" hint={s.companyDescription?"":"Something about your business"}
			/>
			<T.Input value={s.addressLine1} required max="150"
				onChange={this.onAddressLine1.bind(this)} checkValid={v=>v.length}
				type="text" name="address-line1" placeholder="Address line 1" hint={s.addressLine1?"":"Address"}
			/>
			<T.Input value={s.addressLine2} max="150"
				onChange={this.onAddressLine2.bind(this)} checkValid={v=>v.length}
				type="text" name="address-line2" placeholder="Address line 2" hint={s.addressLine2?"":"Secondary addresses, PO Box numbers, or special instructions"}
			/>
			<T.Input value={s.city} required max="100"
				onChange={this.onCity.bind(this)} checkValid={v=>v.length}
				type="text" name="city" placeholder="City" hint={s.city?"":"E.g. New York City"}
			/>
			<T.Input value={s.postcode} max="10"
				onChange={this.onPostcode.bind(this)} checkValid={v=>v.length}
				type="text" name="postcode" placeholder="Postcode" hint={s.postcode?"":"E.g. 10001 (if exists)"}
			/>
			<T.Input value={s.phoneAreaCode} max="10"
				onChange={this.onPhoneAreaCode.bind(this)} checkValid={v=>v.length}
				type="text" name="phone-area-code" placeholder="Phone area code" hint={s.phoneAreaCode?"":"If exists. With no country code. For \"+358 9-123...\" is 9."}
			/>
			<T.Input value={s.phoneNumberCode} required max="60"
				onChange={this.onPhoneNumber.bind(this)} checkValid={v=>v.length}
				type="text" name="phone" placeholder="Phone number" hint={s.phoneNumberCode?"":"With no phone area code"}
			/>
		</div>;
	}
	useEntendedFields(s) {
		var id = s && s.role || this.props.role;
		var types = this.props.userTypes;
		var type = (types||[]).filter(v=>v.id==id)[0];
		if (type) {
			return type.userDataType==2;
		}
		return true;
	}
	checkValid() {
		var s = this.state || {};
		var anyway = (s.role || this.props.role) && s.firstNameValid && s.lastNameValid && s.country;
		var viaExtended = true;
		if (this.useEntendedFields(s)) {
			if (!s.occupationValid) viaExtended = false;
			if (!s.companyNameValid) viaExtended = false;
			if (!s.companyNumberValid) viaExtended = false;
			if (!s.companyDescriptionValid) viaExtended = false;
			if (!s.addressLine1Valid) viaExtended = false;
			// if (!s.addressLine2Valid) viaExtended = false;
			if (!s.cityValid) viaExtended = false;
			// if (!s.postcodeValid) viaExtended = false;
			// if (!s.phoneAreaCodeValid) viaExtended = false;
			if (!s.phoneNumberCodeValid) viaExtended = false;
		}
		if (this.form) this.form.forgotAboutServerError();
		this.setState({
			canSubmit: anyway && viaExtended
		});
	}
	onRole(roleId) {
		this.setState({role:roleId}, ()=>{this.checkValid()});
	}
	onFirstName(firstName,firstNameValid) {
		this.setState({firstName,firstNameValid}, ()=>{this.checkValid()});
	}
	onLastName(lastName,lastNameValid) {
		this.setState({lastName,lastNameValid}, ()=>{this.checkValid()});
	}
	onCountry(country) {
		this.setState({country}, ()=>{this.checkValid()});
	}
	onOccupation(occupation,occupationValid) {
		this.setState({occupation,occupationValid}, ()=>{this.checkValid()});
	}
	onCompanyName(companyName,companyNameValid) {
		this.setState({companyName,companyNameValid}, ()=>{this.checkValid()});
	}
	onCompanyNumber(companyNumber,companyNumberValid) {
		this.setState({companyNumber,companyNumberValid}, ()=>{this.checkValid()});
	}
	onCompanyDescription(companyDescription,companyDescriptionValid) {
		this.setState({companyDescription,companyDescriptionValid}, ()=>{this.checkValid()});
	}
	onAddressLine1(addressLine1,addressLine1Valid) {
		this.setState({addressLine1,addressLine1Valid}, ()=>{this.checkValid()});
	}
	onAddressLine2(addressLine2,addressLine2Valid) {
		this.setState({addressLine2,addressLine2Valid}, ()=>{this.checkValid()});
	}
	onCity(city,cityValid) {
		this.setState({city,cityValid}, ()=>{this.checkValid()});
	}
	onPostcode(postcode,postcodeValid) {
		this.setState({postcode,postcodeValid}, ()=>{this.checkValid()});
	}
	onPhoneAreaCode(phoneAreaCode,phoneAreaCodeValid) {
		this.setState({phoneAreaCode,phoneAreaCodeValid}, ()=>{this.checkValid()});
	}
	onPhoneNumber(phoneNumberCode,phoneNumberCodeValid) {
		this.setState({phoneNumberCode,phoneNumberCodeValid}, ()=>{this.checkValid()});
	}
};

export default PageSignUp;
