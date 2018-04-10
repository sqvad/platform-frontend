import React from 'react';
import T from '../tags.jsx';

class PageEmpty extends T.Page {
	componentWillMount() {
		super.componentWillMount();
	}
	render(p,s,c,m) {
		return <div style={{padding:"30px"}}>
			Pages:
			<ul>
				<li><T.A href="/signup" m={m}>Sign Up</T.A></li>
				<li><T.A href="/set2fa" m={m}>PageSet2FA</T.A></li>
				<li><T.A href="/signin" m={m}>PageSignIn</T.A></li>
				<li><T.A href="/wallets" m={m}>PageWallets</T.A></li>
				<li><T.A href="/settings" m={m}>PageSettings</T.A></li>
			</ul>
		</div>
	}
};

export default PageEmpty;
