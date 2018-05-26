import React from 'react';
import Any from '../any.jsx';
import If from './if.jsx';
import A from './a.jsx';

class ServerError extends Any {
	render(p,s,c,m) {
		var src = p.serverError || p;
		if (!src || !src.message && (!src.errors || src.errors.length==0)) {
			return null;
		}
		var code = (src.message||'').trim();
		return <div className="server-errors">
			<div className="server-error-message">
				{this.code2text(m,code)}
				<If v={code=='ERR_EMAIL_EXISTS'}><span> - <A m={m} href="/signin">log in</A></span></If>
				<If v={code=='ERR_USER_DOES_NOT_EXISTS'}><span> - <A m={m} href="/signup">sign up</A></span></If>
			</div>
			<div>
				{(src.errors||[]).map((v,i)=>{
					return <div className="server-error" key={i}>
					</div>;
				})}
			</div>
		</div>;
	}
	code2text(m,code) {
		switch(code) {
			case 'ERR_EMAIL_EXISTS':
				return <span key={code}>E-mail already registered</span>;
			case 'ERR_EMAIL_INVALID_ADDRESS':
				return <span key={code}>Invalid e-mail address</span>;
			case 'ERR_USER_DOES_NOT_EXISTS':
				return <span key={code}>E-mail not registered</span>;
			case 'ERR_VERIFICATION_CODE_RESEND_NOT_ALLOWED':
				return <span key={code}>Code resend not allowed, try again later</span>;
			case 'ERR_VERIFICATION_CODE_INVALID':
				return <span key={code}>Wrong verification code</span>;
			case 'ERR_INSUFFICIENT_USER_FUNDS':
				return <span key={code}>Insufficient funds</span>;
			case 'ERR_RESET_PASSWORD_FAILED':
				return <span key={code}>Reset password failed</span>;
			case 'ERR_INVALID_EXTERNAL_ADDRESS':
				return <span key={code}>Invalid external address, please check the address</span>;
			case 'ERR_USER_EMAIL_IS_NOT_VERIFIED':
				return <span key={code}>User email not verified</span>;
			case 'ERR_TOTP_PASSWORD_GENERATION_FAILED':
				return <span key={code}>Totp key generation failed, try again later</span>;
			case 'ERR_TOTP_SECRET_KEY_IS_CONFIRMED':
				return <span key={code}>Totp key already confirmed</span>;
			case 'ERR_INVALID_IN_DATA':
				return <span key={code}>Invalid data, please, contact with us</span>;
			case 'ERR_ACCESS_DENIED':
				return <span key={code}>Access denied</span>;
			case 'ERR_ACCESS_INCORRECT_PASSWORD_HASH':
				return <span key={code}>Incorrect password hash</span>;
			case 'ERR_NO_TOTP_RESET_REQUEST':
				return <span key={code}>Invalid totp, please, contact with us</span>;
		}
		return code;
	}
}

export default ServerError;
