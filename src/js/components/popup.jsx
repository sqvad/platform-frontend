import React from 'react';
import Popup from './popup-base.jsx';
import PopupFinish2fa from './popup-finish2fa.jsx';
import PopupPut2fa from './popup-put2fa.jsx';
import PopupConfirm from './popup-confirm.jsx';
import PopupPutPassword from './popup-put-password.jsx';
import PopupForgotPassword from './popup-forgot-password.jsx';
import PopupThanksForRegister from './popup-thanks-for-register.jsx';
import PopupVerifyEmail from './popup-verify-email.jsx';

Popup.Finish2fa = PopupFinish2fa;
Popup.Put2fa = PopupPut2fa;
Popup.PutPassword = PopupPutPassword;
Popup.Confirm = PopupConfirm;
Popup.ForgotPassword = PopupForgotPassword;
Popup.ThanksForRegister = PopupThanksForRegister;
Popup.VerifyEmail = PopupVerifyEmail;

export default Popup;
