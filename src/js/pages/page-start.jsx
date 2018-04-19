import React from 'react';
import T from '../tags.jsx';

import PageSignUp from './page-signup.jsx';
import PageVerifyEmail from './page-verify-email.jsx';
import PageSet2FA from './page-set2fa.jsx';
import PageSignIn from './page-signin.jsx';
import PageWallets from './page-wallets.jsx';
import PageSettings from './page-settings.jsx';

class PageStart extends T.Page {
	constructor(props) {
		super(props);
        if (!props.m.auth) {
            props.m.api.getAuthData();
        }
	}
	render(p,s,c,m) {
		var auth = m && m.auth;
		// debugger;
		if (!auth) return <PageSignUp {...p} {...s} />;
		if (!auth.email) return <PageSignUp {...p} {...s} />;
		if (auth.emailVerified && m.path.contains["verify-email"]) {
			m.api.gotoHref(T.A.href({href:"/start"},m));
		}
		if (auth.signedIn) {
			debugger;
			m.api.gotoHref(T.A.href({href:"/"},m));
			return <div></div>;
		}
		if (auth.canSignIn) return <PageSignIn {...p} {...s} />;
        if (!auth.emailVerified) return <PageVerifyEmail {...p} {...s} />;
		if (!auth.totpSecretKeyConfirmed) return <PageSet2FA {...p} {...s} />;
		/*
		if (auth && auth.emailVerified && m.path.contains["verify-email"]) {
			m.api.gotoHref(T.A.href({href:"/start"},m));
		}
        if (!auth || !auth.emailVerified) {
			if (auth && (auth.emailVerificationSent || auth.emailLastCodeSentAt)) {
				return <PageVerifyEmail {...p} {...s} />;
			}
            return <PageSignUp {...p} {...s} />;
        }
        if (auth && m.auth.emailVerified && !m.auth.totpSecretKeyConfirmed) {
            return <PageSet2FA {...p} {...s} />;
        }
        return <PageSignIn {...p} {...s} />;
		*/
    }
}

export default PageStart;
