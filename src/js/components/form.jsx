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
		if (props.onInit) {
			props.onInit(this);
		}
	}
	render(p,s,c,m) {
		var serverError = null;
		if (!p.hideServerError && !p.handler) {
			serverError = <div className="unexpected-server-error">{this.renderServerError()}</div>;
		}
		return <form onSubmit={this.onSubmit.bind(this)}><div>{c}{serverError}</div></form>
	}
	changeFormState(handler, requiredPropNames, canSubmitDefaultValue, partial) {
		var s = handler.state || {};
		var canSubmit = canSubmitDefaultValue;
		var propNames = ['toValid','amountValid'];
		requiredPropNames.forEach(k=>{
			if (k in partial) {
				if (!partial[k]) canSubmit = false;
			} else if (k in s) {
				if (!s[k]) canSubmit = false;
			} else {
				canSubmit = false;
			}
		});
		partial.canSubmit = canSubmit;
		handler.setState(partial,()=>{this.forgotAboutServerError();});
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
		var m = this.props.m;
		if (!m) {
			if (this.props.handler && this.props.handler.props) {
				m = this.props.handler.props.m;
			}
		}
		return <ServerError m={m} serverError={serverError} />;
	}
}
class SubmitButton extends Any {
	render(p,s,c,m) {
		var canSubmit = p.canSubmit;
		var fetching = p.fetching;
		var dontChangeText = true;
		if ('dontChangeText' in p) dontChangeText = p.dontChangeText;
		var cls = [
			"btn btn-relative",
			fetching ? "btn-link" : p.clsColor,
			p.cls || "",
			!canSubmit || fetching ? "disabled" : ""
		].filter(v=>!!v).join(" ");
		var text = fetching && !dontChangeText ? (p.textLoading || "Loading") : (c || p.text);
		var spread = {};
		if (p.onClick) spread.onClick = p.onClick;
		if (p.style) spread.style = p.style;
		return <button
			{...spread}
			type={p.type || "submit"}
			disabled={!canSubmit || fetching}
			className={cls}
		>
			{p.dontShowLoader ? this.renderText(text, false) : this.renderText(text, fetching)}
			{p.dontShowLoader ? null : this.renderLoader(text, fetching)}
		</button>;
	}
	renderText(text, fetching) {
		if (!fetching) return text;
		return <span style={{visibility:"hidden"}}>{text}</span>;
	}
	renderLoader(text, fetching) {
		if (!fetching) return null;
		return <span style={{
			display: "block",
			width: "24px",
			height: "16px",
			position: "absolute",
			left: "50%",
			top: "50%",
			marginLeft: "-12px",
			marginTop: "-8px",
		}}>
			<img src="img/loader.svg" width="24" height="24"
			style={{
				position: "relative",
				top: "-2px",
				color: "black"
			}} />
		</span>;
	}
}
Form.SubmitButton = SubmitButton;
Form.ServerError = ServerError;
Form.prototype.ServerError = ServerError;
Form.delay = function(sec) {
	if (!sec) sec = 1;
	return new Promise(resolve=>setTimeout(resolve,sec*1000));
};
Form.wrapFetch = function(tag, catchEr, promise) {
	var putTo = tag.form || tag;
	var startAt = Date.now();
	tag.setState({fetching:true,serverError:null,sent:false});
	return promise
	.then(x=>{
		after();
		return x;
	})
	.catch(er=>{
		tag.setState({serverError:er});
		after();
		if (!catchEr) throw er;
		return er;
	});
	function after() {
		tag.setState({fetching:false,sent:true});
	}
};

export default Form;
