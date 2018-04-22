import React from 'react';
import Any from '../any.jsx';
import ServerError from './server-error.jsx';

class Form extends Any {
	constructor(props) {
		super(props);
		this.setState({serverError:null});
		if (props.handler) {
			props.handler.form = this;
		}
	}
	render(p,s,c,m) {
		var serverError = null;
		if (!p.hideServerError && !p.handler) {
			serverError = <div className="unexpected-server-error">{this.renderServerError()}</div>;
		}
		return <form onSubmit={this.onSubmit.bind(this)}><div>{c}{serverError}</div></form>
	}
	onSubmit(e) {
		if (e && e.preventDefault) e.preventDefault();
		this.forgotAboutServerError();
		var ret;
		if (this.props.onSubmit) {
			ret = this.props.onSubmit();
		} else if (this.props.handler && this.props.handler.onSubmit) {
			ret = this.props.handler.onSubmit();
		}
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
			var handler = this.props.handler;
			if (handler) {
				handler.setState({serverError}, ()=>{
					this.forceUpdate();
				});
			}
			this.forceUpdate();
		});
	}
	renderServerError() {
		var serverError = this.state.serverError;
		if (this.props.handler) {
			serverError = this.props.handler.state.serverError;
		}
		if ('serverError' in this.props) {
			serverError = this.props.serverError;
		}
		return <ServerError serverError={serverError} />;
	}
}
class SubmitButton extends Any {
	render(p,s,c,m) {
		var canSubmit = p.canSubmit;
		var fetching = p.fetching;
		var cls = [
			"btn",
			fetching ? "btn-link" : p.clsColor,
			p.cls || "",
			!canSubmit || fetching ? "disabled" : ""
		].filter(v=>!!v).join(" ");
		var text = fetching && !p.dontChangeText ? (p.textLoading || "Loading...") : (c || p.text);
		var spread = {};
		if (p.onClick) spread.onClick = p.onClick;
		if (p.style) spread.style = p.style;
		return <button
			{...spread}
			type={p.type || "submit"}
			disabled={!canSubmit || fetching}
			className={cls}
		>
			{text}
		</button>;
	}
}
Form.SubmitButton = SubmitButton;
Form.ServerError = ServerError;
Form.prototype.ServerError = ServerError;
Form.wrapFetch = function(tag, catchEr, promise) {
	var putTo = tag.form || tag;
	var startAt = Date.now();
	tag.setState({fetching:true,serverError:null});
	return promise
	.then(x=>{
		after();
		return x;
	})
	.catch(er=>{
		tag.setState({serverError:er});
		after();
		if (!catchEr) throw er;
	});
	function after() {
		tag.setState({fetching:false});
	}
};

export default Form;
