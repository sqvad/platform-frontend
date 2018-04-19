import React from 'react';
import Any from '../any.jsx';

class Popup extends Any {
	render(p,s,c,m) {
		return <div key="popup" className="popup-container popup-hidden" onClick={this.onClick.bind(this)} ref={el=>this.nodeContainer=el}>
            <div className="popup" ref={el=>this.nodePopup=el}
            >{c}<div className="popup-close" onClick={this.onClickClose.bind(this)}><span className="icon close clickable"></span></div></div>
        </div>;
	}
	componentDidMount() {
		super.componentDidMount();
		this.onKeyUp = this.onKeyUp.bind(this);
		document.addEventListener('keyup', this.onKeyUp, false);
		var fadeIn = ()=>{
			if (this.nodeContainer) {
				this.nodeContainer.className = (this.nodeContainer.className||'').replace('popup-hidden','');
			}
		};
		setTimeout(fadeIn,20);
		setTimeout(fadeIn,1000);
	}
	componentWillUnmount() {
		super.componentWillUnmount();
		document.removeEventListener('keyup', this.onKeyUp, false);
	}
	onClick(e) {
		if (!this.nodePopup) return;
		if (this.nodePopup.contains(e.target || e.srcElement)) return;
		this.onClickOuter(e);
	}
	onClickOuter(e) {
		this.close();
	}
	onClickClose(e) {
		this.close();
	}
	onKeyUp(e) {
		if (e.keyCode===27) this.close();
	}
	close() {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
}

export default Popup;
