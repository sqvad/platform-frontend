import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import CONSTS from './consts.js';

class Any extends React.Component {
	constructor(props) {
		super(props);
		var old_render = this.render;
		this.render = ()=>{
			if (this.deprecated) return null;
			return old_render.call(this, this.props||{}, this.state||{}, this.props.children, this.props.m);
		};
		this.mounted = false;
	}
	setState(stateChange, callback) {
		if (this.deprecated) return;
		if (this.mounted) {
			return super.setState.apply(this, arguments);
		} else {
			var src = this.state || {};
			var add = stateChange || {};
			for (var k in add) {
				src[k] = add[k];
			}
			this.state = src;
			if (callback) {
				callback.call(this);
			}
		}
	}
	componentWillMount() {
		if (super.componentWillMount) {
			super.componentWillMount();
		}
	}
	componentDidMount() {
		this.mounted = true;
		if (super.componentDidMount) {
			super.componentDidMount();
		}
	}
	componentWillUnmount() {
		this.deprecated = true;
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (super.componentWillReceiveProps) {
			return componentWillReceiveProps(nextProps);
		}
		return nextProps;
	}
	onAnyClick(e) {
		if (e && e.target) {
			var href = e.target.href;
			if (href) {
				var api = this.api || this.props.api || this.props.m.api;
				api.pushState(href,e);
			}
		}
	}
	_loadScript(src) {
		if (!this._loadScript_list) this._loadScript_list = {};
		if (this._loadScript_list[src]) return this._loadScript_list[src];
		this._loadScript_list[src] = new Promise(resolve=>{
			var tag = document.createElement('script');
			tag.onload = ()=>{
				this._loadScript_list[src] = true;
				resolve();
			};
			tag.src = src;
			var putTo = document.querySelector('head');
			putTo.insertBefore(tag, putTo.children[putTo.children.length-1]);
		}).then();
		return this._loadScript_list[src];
	}
}

Any.prototype.Anim = CSSTransitionGroup;

Any.prototype.CONSTS = CONSTS;
Any.CONSTS = CONSTS;
Any.PropTypes = PropTypes;
Any.createElement = React.createElement;
export default Any;
