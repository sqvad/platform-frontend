import React from 'react';
import A from './a.jsx';
import Any from '../any.jsx';

class TX extends Any {
	render(p,s,c,m) {
		var tx = p.v || p.tx || p.txHash;
		var txFormatted = tx;
		if (p.fullAdrOnDesktop && p.m.device.isDesktop) {
		} else {
			txFormatted = this.format(tx);
		}
		if (p.isAdr) {
			return <A external m={m} href={"https://etherscan.io/address/"+tx}>{txFormatted}</A>;
		} else {
			return <A external m={m} href={"https://etherscan.io/tx/"+tx}>{txFormatted}</A>;
		}
	}
	format(txHash) {
		return txHash.substr(0,7) +"..."+ txHash.substr(txHash.length-7);
	}
}

export default TX;
