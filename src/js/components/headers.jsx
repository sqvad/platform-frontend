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
		/*
		return <div className="header-medium bg-violet d-flex" key="header">
			<div className="container d-flex">
				<div className="row d-flex align-items-center justify-content-between" style={{width:"100%"}}>
					<div className="col-2 pl-0 align-self-start">
						<A m={m} href="/" className="for-logo">
							<div className="logo logo-nopad-131x43" />
						</A>
					</div>
					<div className="col-8">
						{c}
					</div>
					<div className="col-2 pr-0 align-self-start d-flex align-items-center justify-content-end">
						<A m={m} href="/profile" className="d-block mr-3 pt-2 pb-2">ALEXANDER DOBRIKOV</A>
						<button type="button" className="btn btn-sm btn-outline-secondary">
							Log Out
							<span className="icon icon-24 icon-logout" />
						</button>
					</div>
				</div>
			</div>
		</div>;
		*/
	}
}

var Headers = {
	Short: HeaderShort,
	Medium: HeaderMedium,
};

export default Headers;
