import React from 'react';
import Any from '../any.jsx';
import A from './a.jsx';

class Name extends Any {
	render(p,s,c,m) {
		var userData = m.user;
		if (!userData) return null;
		return <A m={m} href="/wallets" className="d-block mr-3 pt-2 pb-2 text-truncate">{userData.firstName}&nbsp;{userData.lastName}</A>;
	}
}
class Logout extends Any {
	render(p,s,c,m) {
		return <button type="button" className="btn btn-sm btn-outline-secondary" onClick={()=>m.api.logout()}>
			Log Out
			<span className="icon icon-24 icon-logout" />
		</button>;
	}
}
class Login extends Any {
	render(p,s,c,m) {
		return <button type="button" className="btn btn-sm btn-outline-secondary"
			onClick={()=>m.api.gotoHref(A.href({href:"/signin"},m))}
		>
			Log In
			<span className="icon icon-24 icon-next" />
		</button>;
	}
}
class Signup extends Any {
	render(p,s,c,m) {
		return <button type="button" className="btn btn-sm btn-outline-secondary"
			onClick={()=>m.api.gotoHref(A.href({href:"/signup"},m))}
		>
			Sign Up
			<span className="icon icon-24 icon-next" />
		</button>;
	}
}

class HeaderButtons extends Any {
	render(p,s,c,m) {
		var authData = m.auth || {};
		var userData = m.user;
		if (authData.signedIn) {
			return <div className="d-flex align-items-center">
				<Name {...p} />
				<Logout {...p} />
			</div>;
		} else if (authData.signedInEmail) {
			return <div className="d-flex align-items-center">
				{userData?<span className="d-block mr-3 pt-2 pb-2 text-uppercase">{userData.firstName} {userData.lastName}</span>:null}
				{!userData && authData.email?<span className="d-block mr-3 pt-2 pb-2">{authData.email}</span>:null}
				<Logout {...p} />
			</div>;
		} else {
			if (p.isSingupPage) {
				return <div className="d-flex align-items-center">
					<span className="d-block mr-3 pt-2 pb-2 text-uppercase">Already member?</span>
					<Login {...p} />
				</div>;
			} else {
				return <div className="d-flex align-items-center">
					<Signup {...p} />
				</div>;
			}
		}
	}
}
class HeaderShort extends Any {
	render(p,s,c,m) {
		var authData = m.auth || {};
		return <div className="header-short bg-violet">
			<div className="row d-flex flex-row justify-content-between">
				<div className="col-6 pl-0">
					<A m={m} href="/" className="for-logo">
						<div className={m.device.isMobile?"logo logo-nopad-100x33":"logo logo-nopad-131x43"} />
					</A>
				</div>
				<HeaderButtons {...p} />
			</div>
		</div>;
	}
}

class HeaderMedium extends Any {
	render(p,s,c,m) {
		var authData = m.auth || {};
		var userData = m.user;
		return <div className="header-medium bg-violet d-flex flex-column" key="header">
			<div className="row">
				<div className="col-6 pl-0">
					<A m={m} href="/" className="for-logo">
						<div className={m.device.isMobile?"logo logo-nopad-100x33":"logo logo-nopad-131x43"} />
					</A>
				</div>
				<div className="col-6 d-flex pr-0 justify-content-end">
					<HeaderButtons {...p} />
				</div>
			</div>
			<div className="container d-flex flex-column">
				{c}
			</div>
		</div>;
	}
}

class HeaderLeft extends Any {
	render(p,s,c,m) {
		return m.device.isMobile ? this.render_mobile(p,s,c,m) : this.render_default(p,s,c,m);
	}
	render_default(p,s,c,m) {
		return <div className="bg-violet w-100">
			<A className="left-menu-logo" m={m} href="">
				<span className="left-menu-logo-img"></span>
			</A>
			<A className={"left-menu-item"+(p.tab=="wallets"?" active":"")} m={m} href="/wallets">
				<span className={"icon icon-30 icon-lg icon-wallet"+(p.tab!="wallets"?" icon-white":"")}></span>
				<span className="left-menu-item-label">wallets</span>
			</A>
			<A className={"left-menu-item"+(p.tab=="settings"?" active":"")} m={m} href="/settings">
				<span className={"icon icon-30 icon-lg icon-settings"+(p.tab!="settings"?" icon-white":"")}></span>
				<span className="left-menu-item-label">settings</span>
			</A>
			<A className="left-menu-item" m={m} onClick={()=>m.api.logout()}>
				<span className="icon icon-30 icon-lg icon-logout icon-white"></span>
				<span className="left-menu-item-label">log out</span>
			</A>
		</div>;
	}
	render_mobile(p,s,c,m) {
		return <div className="bg-violet w-100">
			<A m={m} href="/" className="for-logo">
				<div className="logo logo-nopad-96x32" />
			</A>
			<div className="burger" onClick={()=>this.setState({opened:!s.opened})} />
			{s.opened?this.render_mobile_opened(p,s,c,m):null}
		</div>;
	}
	render_mobile_opened(p,s,c,m) {
		var spread = {};
		if (m.device.isMobile) {
			spread.className = "d-flex justify-content-between w-100";
			spread.style = {borderTop:"1px solid #302c43"};
		}
		return <div {...spread}>
			<A className={"left-menu-item"+(p.tab=="wallets"?" active":"")} m={m} href="/wallets"
				style={{paddingLeft:m.device.isMobile?"15px":""}}
			>
				<span className={"icon icon-30 icon-lg icon-wallet"+(p.tab!="wallets"?" icon-white":"")}></span>
				<span className="left-menu-item-label">wallets</span>
			</A>
			<A className={"left-menu-item"+(p.tab=="settings"?" active":"")} m={m} href="/settings">
				<span className={"icon icon-30 icon-lg icon-settings"+(p.tab!="settings"?" icon-white":"")}></span>
				<span className="left-menu-item-label">settings</span>
			</A>
			<A className="left-menu-item" m={m}
				style={{paddingRight:m.device.isMobile?"15px":""}}
			>
				<span className="icon icon-30 icon-lg icon-logout icon-white"></span>
				<span className="left-menu-item-label">log out</span>
			</A>
		</div>;
	}
}

var Headers = {
	Short: HeaderShort,
	Medium: HeaderMedium,
	Left: HeaderLeft,
};

export default Headers;
