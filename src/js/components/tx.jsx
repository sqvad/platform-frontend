import React from 'react';
import A from './a.jsx';
import Any from '../any.jsx';

class TX extends Any {
	render(p,s,c,m) {
		var tx = p.v || p.tx || p.txHash;
		var txFormatted = tx;
		if (p.fullAdr) {
		} else if (p.fullAdrOnDesktop && p.m.device.isDesktop) {
		} else {
			txFormatted = this.format(tx);
		}
		var href = TX.href(m, p.isAdr, tx);
		return <A external m={m} href={href}>{txFormatted}</A>;
	}
	format(txHash) {
		return txHash.substr(0,7) +"..."+ txHash.substr(txHash.length-7);
	}
}
TX.href = function(m,isAdr,tx) {
	// https://ropsten.etherscan.io/address/0xBA46454801BBFB741FFc6Addf58dc6C2cC061FD7
	// var prefix =
	// var prefix = m.settings.misc["@server@isTestnet"] || 1 ? m.settings.misc.testnetEtherscanPrefix : m.settings.misc.mainnetEtherscanPrefix;
	var src = m.settings.misc.etherscanPrefix;
	var prefix = src[m.env] || src["default"];
	if (isAdr) {
		return prefix+"address/"+tx;
	} else {
		return prefix+"tx/"+tx;
	}
}

export default TX;
