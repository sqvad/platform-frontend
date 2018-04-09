import React from 'react';
import Input from './input-base.jsx';
import InputEmail from './input-email.jsx';
import InputPassword from './input-password.jsx';
import InputPasswordConfirm from './input-password-confirm.jsx';
import InputTxAdr from './input-tx-adr.jsx';
import InputFloat from './input-float.jsx';

Input.Email = InputEmail;
Input.Password = InputPassword;
Input.PasswordConfirm = InputPasswordConfirm;
Input.TxAdr = InputTxAdr;
Input.Float = InputFloat;

export default Input;
