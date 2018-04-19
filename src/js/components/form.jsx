import React from 'react';
import Any from '../any.jsx';
import ServerError from './server-error.jsx';

class Form extends Any {
	constructor(props) {
		super(props);
		this.setState({serverError:null});
	}
	render(p,s,c,m) {
		var serverError = null;
		if (!p.hideServerError) {
			serverError = <div className="unexpected-server-error">{this.renderServerError()}</div>;
		}
		return <form onSubmit={this.onSubmit.bind(this)}><div>{c}{serverError}</div></form>
	}
	onSubmit(e) {
		if (e && e.preventDefault) e.preventDefault();
		this.forgotAboutServerError();
		var ret = this.props.onSubmit();
		if (ret) {
			if (typeof ret.catch == typeof function(){}) {
				ret.catch(er=>{
					this.setServerError(er);
					throw er;
				});
			}
		}
		return ret;
	}
	forgotAboutServerError() {
		this.setServerError();
	}
	setServerError(serverError) {
		this.setState({serverError:serverError}, ()=>{
			if (this.props.onServerError) {
				this.props.onServerError(this);
			}
			this.forceUpdate();
		});
	}
	renderServerError() {
		var serverError = this.state.serverError;
		if ('serverError' in this.props) {
			serverError = this.props.serverError;
		};
		return <ServerError serverError={serverError} />;
	}
}
Form.ServerError = ServerError;
Form.prototype.ServerError = ServerError;

export default Form;
