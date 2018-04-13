import React from 'react';
import Any from '../any.jsx';
import BigNumber from 'bignumber.js';

var bn = x => new BigNumber(x);

class Currency extends Any {
	constructor(props) {
		super(props);
		props.m.api.getCurrenciesRate();
		props.m.api.getDefaultClassicCurrency();
	}
	render(p,s,c,m) {
		var rate = m && m.currenciesRate;
		var id = p.id;
		var isClassical = p.usd || m.CONSTS.CLASSIC_CURRENIES[id];
		return isClassical ? this.render_classical(p,s,c,m) : this.render_coin(p,s,c,m);
	}
	render_classical(p,s,c,m) {
		var str = "...";
		var classic = p.usdId || m.defaultClassicCurrency;
		if (m.currenciesRate && classic) {
			var isWei = ('isWei' in p) ? !!p.isWei : p.m.settings.misc.serverSendWei;
			str = Currency._2usd(isWei, p.value, p.format, m.currenciesRate[p.id][classic]);
			str = Currency._2number(str, false);
		}
		return <span className="in-usd">
			{str} {classic}
		</span>;
	}
	render_coin(p,s,c,m) {
		var str = "...";
		if (m.currenciesRate) {
			var isWei = ('isWei' in p) ? !!p.isWei : p.m.settings.misc.serverSendWei;
			str = Currency._2coin(isWei, p.value, p.format);
			if (str.isZero()) {
				str = "0.00";
			} else {
				str = Currency._2number(str, true);
			}
		}
		return <span className="in-wei">
			{str} {p.id}
		</span>;
	}
}
Currency._2number = function(num_, isCoins) {
	var num = bn(num_);
	if (num.gte( bn(10).toPower(9) )) {
		return num.times(bn(10).toPower(-9)).toFormat(3) + "*10^9";
	} else {
		if (isCoins) {
			var ab = num.toFormat(4).split(".");
			var b = ab[1].replace(/0+$/, '');
			return ab[0] +(b?"."+b:"");
		} else {
			return num.toFormat(2);
		}
	}
};
Currency._2usd = function(isWei, inAny, decimalsCount, rate) {
	return isWei ? Currency.wei2usd(inAny, decimalsCount, rate) : Currency.coin2usd(inAny, rate) ;
};
Currency._2wei = function(isWei, inAny, decimalsCount) {
	return isWei ? bn(inAny) : Currency.coin2wei(inAny, decimalsCount) ;
};
Currency._2coin = function(isWei, inAny, decimalsCount) {
	return isWei ? Currency.wei2coin(inAny, decimalsCount) : bn(inAny);
};
Currency.coin2wei = function(inCoin, decimalsCount) {
	var power = bn(10).toPower(decimalsCount);
	return bn(inCoin||0).times( power );
};
Currency.wei2coin = function(inCoin, decimalsCount) {
	return Currency.coin2wei(inCoin, bn(decimalsCount).times(-1));
};
Currency.coin2usd = function(inCoin, rate) {
	// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,KOW,AUD
	// {"USD":510.68,"EUR":413.85,"CNY":3328.6,"JPY":55226.62,"AUD":653.8}
	// rate (for ETH + USD) == 510.68
	return bn(inCoin).times(bn(rate));
};
Currency.wei2usd = function(inCoin, decimalsCount, rate) {
	// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,KOW,AUD
	// {"USD":510.68,"EUR":413.85,"CNY":3328.6,"JPY":55226.62,"AUD":653.8}
	// rate (for ETH + USD) == 510.68
	return Currency.wei2coin(inCoin, decimalsCount).div(bn(rate));
};

export default Currency;
