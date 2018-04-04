import React from 'react';
import T from '../tags.jsx';

class ChooseRole extends T.Any {
	componentDidMount() {
		this.toggle = this.toggle.bind(this);
	}
	render(p,s,c,m) {
		var tree = [
			{id:"consumer",title:"Consumer"},
			{id:"supplier",title:"Supplier"},
			{id:"warehouseProvider",title:"Warehouse Provider"},
			{id:"warehouseServices",title:"Warehouse Services", children: [
				{id: "wp#0", title: "Warehouse Services"},
				{id: "wp#1", title: "Independent worker"},
				{id: "wp#2", title: "Staffing agency"},
			]},
			{id:"logisticServices",title:"Logistic Services", children: [
				{id: "ls#0", title: "Logistic Services"},
				{id: "ls#1", title: "Independent courier"},
				{id: "ls#2", title: "Logistics company"},
			]},
		];
		return <div className="register-as">
			<h2 className="form-header">Register as</h2>
			<div className="btn-group btn-group-toggle d-flex justify-content-center flex-wrap">
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
								className={"btn "+(isActive? "btn-secondary active":"btn-outline-secondary")}
								options={v.children.map(v=>{return {value:v.id,text:v.title}})}
								placeholderOnFocus="Please choose..."
								onBlur={this.onChooseViaSelect.bind(this)}
							></T.Select>;
						} else {
							return <div
								key={"role"+i} data-v={v.id} onClick={this.onChooseViaButton.bind(this)}
								className={"btn "+(v.id==p.role? "btn-secondary active":" btn-outline-secondary")}
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
		this.setState({
			page: 1,
			email:"",
			password:"",
			passwordConfirm:"",
			role:"",
			firstName:"",
			lastName:"",
			country:"",
		});
	}
	render(p,s,c,m) {
		var page1 = <PageSignUp_page1 {...p} {...s} m={m} onSubmit={this.goto2ndPage.bind(this)} />;
		var page2 = <PageSignUp_page2 {...p} {...s} m={m} onPrev={this.goto1stPage.bind(this)} />;
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
	goto1stPage(result) {
		this.setState({
			role: result.role || this.state.role || this.props.role,
			firstName: result.firstName || this.state.firstName || this.props.firstName,
			lastName: result.lastName || this.state.lastName || this.props.lastName,
			country: result.country || this.state.country || this.props.country,
			occupation: result.occupation || this.state.occupation || this.props.occupation,
			companyName: result.companyName || this.state.companyName || this.props.companyName,
			companyNumber: result.companyNumber || this.state.companyNumber || this.props.companyNumber,
			companyDescription: result.companyDescription || this.state.companyDescription || this.props.companyDescription,
			addressLine1: result.addressLine1 || this.state.addressLine1 || this.props.addressLine1,
			addressLine2: result.addressLine2 || this.state.addressLine2 || this.props.addressLine2,
			city: result.city || this.state.city || this.props.city,
			postcode: result.postcode || this.state.postcode || this.props.postcode,
			phoneAreaCode: result.phoneAreaCode || this.state.phoneAreaCode || this.props.phoneAreaCode,
			phoneNumberCode: result.phoneNumberCode || this.state.phoneNumberCode || this.props.phoneNumberCode,
			page: 1
		});
	}
	goto2ndPage(result) {
		this.setState({
			role: result.role || this.state.role || this.props.role,
			email: result.email || this.state.email || this.props.email,
			password: result.password || this.state.password || this.props.password,
			passwordConfirm: result.passwordConfirm || this.state.passwordConfirm || this.props.passwordConfirm,
			page: 2
		});
	}
}
class PageSignUp_page1 extends T.Page {
	constructor(props) {
		super(props);
		this.checkValid();
	}
	render(p,s,c,m) {
		var canSubmit = s.canSubmit;
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...s}>
				<hgroup>
					<h1>SING UP FOR INS ECOSYSTEM</h1>
					<h2>Join the breakthrough in the consumer goods industry</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<T.Form onSubmit={()=>{s.canSubmit && p.onSubmit(s)}}>
					<ChooseRole m={m} {...p} {...s} onChoose={this.onRole.bind(this)} />
					<div className="row d-flex justify-content-center">
						<div className="col-6">
							<T.Input.Email
								name="email" onChange={this.onEmail.bind(this)}
								value={s.email} required
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
							<div className="d-flex justify-content-center mt-4">
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
		this.setState({
			canSubmit: s.role && s.emailValid && s.passwordValid && s.passwordConfirmValid
		});
	}
	onRole(roleId) {
		this.setState({role:roleId}, ()=>{this.checkValid()});
	}
	onEmail(v, valid) {
		this.setState({email:v,emailValid:valid}, ()=>{this.checkValid()});
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
		this.checkValid();
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
				<T.Form onSubmit={()=>{p.onSubmit(s)}}>
					<ChooseRole m={m} {...p} {...s} onChoose={this.onRole.bind(this)} />
					<div className="row d-flex justify-content-center">
						<div className="col-6">
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
								name="country" options={[
									{id:"us",text:"USA"},
									{id:"ca",text:"Canada"},
								]}
							></T.Select>
							{extendFields}
							<div className="d-flex justify-content-between mt-4">
								<button
									type="button" onClick={p.onPrev.bind(this, s)}
									className="btn btn-lg btn-outline-primary btn-with-icon-at-left-side"
								>
									Previous
									<span className="icon icon-24 icon-prev icon-violet"></span>
								</button>
								<button type="submit"
									className={[
										"btn btn-lg btn-primary",
										"btn-with-icon-at-right-side",
										canSubmit ? "" : " disabled",
										"ml-3"
									].join(" ")}
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</T.Form>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	render_extendFields(p,s,c,m) {
		return <div>
			<T.Input value={s.occupation} required
				onChange={this.onOccupation.bind(this)} checkValid={v=>v.length}
				type="text" name="occupation" placeholder="Occupation" hint={s.lastName?"":"E.g. owner or CTO"}
			/>
			<T.Input value={s.companyName} required
				onChange={this.onCompanyName.bind(this)} checkValid={v=>v.length}
				type="text" name="company-name" placeholder="Company name" hint={s.companyName?"":"E.g. My Company"}
			/>
			<T.Input value={s.companyNumber} required
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
			<T.Input value={s.companyDescription} required
				onChange={this.onCompanyDescription.bind(this)} checkValid={v=>v.length}
				type="text" name="company-description" placeholder="Company description" hint={s.companyDescription?"":"Something about your business"}
			/>
			<T.Input value={s.addressLine1} required
				onChange={this.onAddressLine1.bind(this)} checkValid={v=>v.length}
				type="text" name="address-line1" placeholder="Address line 1" hint={s.addressLine1?"":"Address"}
			/>
			<T.Input value={s.addressLine2}
				onChange={this.onAddressLine2.bind(this)} checkValid={v=>v.length}
				type="text" name="address-line2" placeholder="Address line 2" hint={s.addressLine2?"":"Secondary addresses, PO Box numbers, or special instructions"}
			/>
			<T.Input value={s.city} required
				onChange={this.onCity.bind(this)} checkValid={v=>v.length}
				type="text" name="city" placeholder="City" hint={s.city?"":"E.g. New York City"}
			/>
			<T.Input value={s.postcode}
				onChange={this.onPostcode.bind(this)} checkValid={v=>v.length}
				type="text" name="postcode" placeholder="Postcode" hint={s.postcode?"":"E.g. 10001 (if exists)"}
			/>
			<T.Input value={s.phoneAreaCode}
				onChange={this.onPhoneAreaCode.bind(this)} checkValid={v=>v.length}
				type="text" name="phone-area-code" placeholder="Phone area code" hint={s.phoneAreaCode?"":"If exists. With no country code. For \"+358 9-123...\" is 9."}
			/>
			<T.Input value={s.phoneNumber} required
				onChange={this.onPhoneNumber.bind(this)} checkValid={v=>v.length}
				type="text" name="phone" placeholder="Phone number" hint={s.phoneNumber?"":"With no phone area code"}
			/>
		</div>;
	}
	useEntendedFields(s) {
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
	onPhoneNumber(phoneNumber,phoneNumberValid) {
		this.setState({phoneNumber,phoneNumberValid}, ()=>{this.checkValid()});
	}
};

export default PageSignUp;
