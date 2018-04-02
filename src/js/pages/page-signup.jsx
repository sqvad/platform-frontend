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
			{id:"warehouseProvider",title:"Warehouse Provider", children: [
				{id: "wp#1", title: "warehouseProvider#1"},
				{id: "wp#2", title: "warehouseProvider#2"},
				{id: "wp#3", title: "warehouseProvider#3"},
				{id: "wp#4", title: "warehouseProvider#4"},
				{id: "wp#5", title: "warehouseProvider#5"},
				{id: "wp#6", title: "warehouseProvider#6"},
				{id: "wp#7", title: "warehouseProvider#7"},
				{id: "wp#8", title: "warehouseProvider#8"},
			]},
			{id:"warehouseServices",title:"Warehouse Services"},
			{id:"logisticServices",title:"Logistic Services", children: [
				{id: "ls#1", title: "logisticServices#1"},
				{id: "ls#2", title: "logisticServices#2"},
				{id: "ls#3", title: "logisticServices#3"},
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
								placeholder={v.title} options={v.children.map(v=>{return {value:v.id,text:v.title}})}
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
		if (s.page==1) {
			return <div>
				<div key="page1"><PageSignUp_page1 {...p} {...s} m={m} onSubmit={this.goto2ndPage.bind(this)} /></div>
				<div key="page2" style={{display:"none"}}><PageSignUp_page2 {...p} {...s} m={m} onPrev={this.goto1stPage.bind(this)} /></div>
			</div>;
		} else {
			return <div>
				<div key="page1" style={{display:"none"}}><PageSignUp_page1 {...p} {...s} m={m} onSubmit={this.goto2ndPage.bind(this)} /></div>
				<div key="page2"><PageSignUp_page2 {...p} {...s} m={m} onPrev={this.goto1stPage.bind(this)} /></div>
			</div>;
		}
	}
	goto1stPage(result) {
		this.setState({
			role: result.role,
			firstName: result.firstName,
			lastName: result.lastName,
			country: result.country,
			page: 1
		});
	}
	goto2ndPage(result) {
		this.setState({
			role: result.role,
			email: result.email,
			password: result.password,
			passwordConfirm: result.passwordConfirm,
			page: 2
		});
	}
}
class PageSignUp_page1 extends T.Page {
	constructor(props) {
		super(props);
		this.setState({
			role: props.role,
			email: props.email,
			password: props.password,
			passwordConfirm: props.passwordConfirm,
		});
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
				<T.Form onSubmit={()=>{p.onSubmit(s)}}>
					<ChooseRole m={m} {...p} {...s} onChoose={this.onRole.bind(this)} />
					<div className="row d-flex justify-content-center">
						<div className="col-6">
							<T.Input.Email
								onChange={this.onEmail.bind(this)}
								value={s.email} required
							/>
							<T.Input.Password
								onChange={this.onPassword.bind(this)}
								value={s.password} required
							/>
							<T.Input.PasswordConfirm
								onChange={this.onPasswordConfirm.bind(this)}
								value={s.passwordConfirm} required
								password={s.password}
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
		var s = this.state;
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
		this.setState({
			role: props.role,
			firstName: props.firstName,
			lastName: props.lastName,
			country: props.country,
		});
		this.checkValid();
	}
	render(p,s,c,m) {
		var canSubmit = s.canSubmit;
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
								useFormControl  className="form-control" placeholder="COUNTRY"
								options={[
									{id:"us",text:"USA"},
									{id:"ca",text:"Canada"},
								]}
							></T.Select>
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
	checkValid() {
		var s = this.state;
		this.setState({
			canSubmit: (s.role || this.props.role) && s.firstNameValid && s.lastNameValid && s.country
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
};

export default PageSignUp;
