import React from 'react';
import Input from './input-base.jsx';

class InputEmail extends Input {
	render(p,s,c,m) {
		return <Input {...p} m={m} />;
	}
}

InputEmail.defaultProps = {
	checkValid: function(email) {
		var email = (email||'').trim();
		var example = 'a@1.ua';
		if (email.length<example.length) return false;
		if (email.indexOf('@')<example.indexOf('@')) return false;
		if (email.indexOf('.',email.indexOf('@'))<example.indexOf('.')) return false;
		return true;
	},
	name: "email",
	type: "email",
	placeholder: "EMAIL",
};

export default InputEmail;
