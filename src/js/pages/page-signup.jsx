import React from 'react';
import T from '../tags.jsx';

class ChooseRole extends T.Any {
	componentDidMount() {
		this.onChooseViaButton = this.onChooseViaButton.bind(this);
		this.onChooseViaSelect = this.onChooseViaSelect.bind(this);
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
								key={"role"+i} value={p.role} onChange={this.onChooseViaSelect}
								className={"btn "+(isActive? "btn-secondary active":" btn-outline-secondary")}
								placeholder={v.title} options={v.children.map(v=>{return {value:v.id,text:v.title}})}
							></T.Select>;
						} else {
							return <div
								key={"role"+i} data-v={v.id} onClick={this.onChooseViaButton}
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
			page: 2,
			email:"test@test.test",
			password:"j,lvnjdksmnxiw.zl",
			passwordConfirm:"j,lvnjdksmnxiw.zl",
			role:"consumer",
			firstName:"",
			lastName:"",
			country:"",
		});
	}
	render(p,s,c,m) {
		if (s.page==1) {
			return <PageSignUp_page1 {...p} {...s} m={m} onSubmit={this.goto2ndPage.bind(this)} />;
		} else {
			return <PageSignUp_page2 {...p} {...s} m={m} onPrev={this.goto1stPage.bind(this)} />;
		}
	}
	goto1stPage(result) {
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
			<T.Page.PageWrapHeader key="header" m={m} header="medium" {...p}>
				<hgroup>
					<h1>SING UP FOR INS ECOSYSTEM</h1>
					<h2>Join the breakthrough in the consumer goods industry</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<T.Form onSubmit={()=>{p.onSubmit(s)}}>
					<ChooseRole onChoose={this.onRole.bind(this)} m={m} {...s} />
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
		this.setState({password:v,passwordValid:valid}, ()=>{this.checkValid()});
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
					<ChooseRole onChoose={this.onRole.bind(this)} m={m} {...s} />
					<div className="row d-flex justify-content-center">
						<div className="col-6">
							<T.Input
								onChange={(firstName,firstNameValid)=>{this.setState({firstName,firstNameValid})}}
								type="text" name="name" placeholder="FIRST NAME" hint={s.firstName?"":"E.g. Walter"}
								value={s.firstName} required
							/>
							<T.Input
								onChange={(lastName,lastNameValid)=>{this.setState({lastName,lastNameValid})}}
								type="text" name="second-name" placeholder="LAST NAME" hint={s.lastName?"":"E.g. Skinner"}
								value={s.lastName} required
							/>
							<T.Select
								className="form-control"
								placeholder="COUNTRY" options={[]}
							></T.Select>
							<div className="d-flex justify-content-between mt-4">
								<button type="button"
									className={[
										"btn btn-lg btn-outline-primary",
										"btn-with-icon-at-right-side",
									].join(" ")}
								>
									Prev
									<span className={[
										"icon icon-24 icon-next",
										canSubmit ? " icon-white" : " icon-disabled",
									].join(" ")}></span>
								</button>
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
		this.setState({password:v,passwordValid:valid}, ()=>{this.checkValid()});
	}
	onPasswordConfirm(v, valid) {
		this.setState({passwordConfirm:v,passwordConfirmValid:valid}, ()=>{this.checkValid()});
	}
};

export default PageSignUp;
