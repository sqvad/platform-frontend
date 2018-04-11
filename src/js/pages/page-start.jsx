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
            props.m.api.getUserData();
        }
	}
	render(p,s,c,m) {
        if (!m.auth || !m.auth.emailVerified) {
            if (!m.auth || !m.auth.emailLastCodeSentAt) {
                return <PageSignUp {...p} {...s} />;
            } else {
                return <PageVerifyEmail {...p} {...s} />;
            }
        }
        if (m.auth && m.auth.emailVerified && !m.auth.totpSecretKeyConfirmed) {
            return <PageSet2FA {...p} {...s} />;
        }
        return <PageSignIn {...p} {...s} />;
        return <div>
            ...
            <code><pre>{JSON.stringify(m,4,4)}</pre></code>
        </div>;
    }
}

export default PageStart;
