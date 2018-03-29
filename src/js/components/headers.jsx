import React from 'react';
import Any from '../any.jsx';
import A from './a.jsx';

class HeaderShort extends Any {
	render(p,s,c,m) {
		return <div className="header-short bg-violet">
			<div className="container">
				<div className="width page">
					<div className="row">
						<div className="col-6">
							<A m={m} href="/" className="for-logo">
								<div className="logo logo-nopad-131x43" />
							</A>
						</div>
						<div className="col-6 d-flex align-items-center justify-content-end">
							<A m={m} href="/profile">ALEXANDER DOBRIKOV</A>
							<button type="button" className="btn btn-primary">Primary</button>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}

var Headers = {
	Short: HeaderShort
};

export default Headers;
