import React from 'react';
import Input from './input-base.jsx';

class InputPassword extends Input {
	render(p,s,c,m) {
		var type = "password";
		if (p.value=="") type = "text";
		return <Input {...p} type={type} m={m} />;
	}
}

InputPassword.defaultProps = {
	checkValid: function(str) {
		return str.length>7;
	},
	name: "password",
	type: "password",
	placeholder: "PASSWORD",
};

export default InputPassword;
