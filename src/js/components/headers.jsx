import React from 'react';
import Any from '../any.jsx';
import A from './a.jsx';

class HeaderShort extends Any {
	render(p,s,c,m) {
		return <div className="header-short bg-violet">
			<div className="container">
				<div className="width page">
					<div className="row">
						<div className="col-6 pl-0">
							<A m={m} href="/" className="for-logo">
								<div className="logo logo-nopad-131x43" />
							</A>
						</div>
						<div className="col-6 pr-0 d-flex align-items-center justify-content-end">
							<A m={m} href="/profile" className="d-block mr-3 pt-2 pb-2">ALEXANDER DOBRIKOV</A>
							<button type="button" className="btn btn-sm btn-outline-secondary">
								Log Out
								<span className="icon icon-24 icon-logout" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}

class HeaderMedium extends Any {
	render(p,s,c,m) {
		return <div className="header-medium bg-violet d-flex" key="header">
			<div className="container d-flex flex-column">
				<div className="row">
					<div className="col-6 pl-0">
						<A m={m} href="/" className="for-logo">
							<div className="logo logo-nopad-131x43" />
						</A>
					</div>
					<div className="col-6 pr-0 d-flex align-items-center justify-content-end">
						<A m={m} href="/profile" className="d-block mr-3 pt-2 pb-2">ALEXANDER DOBRIKOV</A>
						<button type="button" className="btn btn-sm btn-outline-secondary">
							Log Out
							<span className="icon icon-24 icon-logout" />
						</button>
					</div>
				</div>
					{c}
			</div>
		</div>;
	}
}

class HeaderLeft extends Any {
	render(p,s,c,m) {
		return <div className="bg-violet w-100">
			<A className="left-menu-logo" m={m}>
				<span className="left-menu-logo-img"></span>
			</A>
			<A className="left-menu-item active" m={m}>
				<span className="icon icon-30 icon-lg icon-wallet"></span>
				<span className="left-menu-item-label">wallets</span>
			</A>
			<A className="left-menu-item" m={m}>
				<span className="icon icon-30 icon-lg icon-settings icon-white"></span>
				<span className="left-menu-item-label">settings</span>
			</A>
			<A className="left-menu-item hover" m={m}>
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
