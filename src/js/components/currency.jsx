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
		var isClassical = p.usd || m.settings.classicCurrencies[this._2id(p)];
		return isClassical ? this.render_classical(p,s,c,m) : this.render_coin(p,s,c,m);
	}
	render_classical(p,s,c,m) {
		var str = "...";
		var id = this._2id(p);
		var usdId = p.usdId || m.defaultClassicCurrency;
		var format = this._2format(p,m,id);
		if (m.currenciesRate && usdId && (format||format===0||format==='0')) {
			var rate = (m.currenciesRate[id]||{})[usdId];
			if (rate) {
				var isWei = ('isWei' in p) ? !!p.isWei : p.m.settings.misc.serverSendWei;
				str = Currency._2usd(isWei, this._2value(p), format, bn(1).div(rate));
				str = Currency._2number(str, false);
			}
		}
		return <span className="in-usd">
			{str} {(m.settings.classicCurrencies[usdId]||{}).text||usdId}
		</span>;
	}
	render_coin(p,s,c,m) {
		var str = "...";
		var format = this._2format(p,m,this._2id(p));
		var isWei = ('isWei' in p) ? !!p.isWei : p.m.settings.misc.serverSendWei;
		if ((format||format===0||format==='0')) {
			str = Currency._2coin(isWei, this._2value(p), format);
			if (str.isZero()) {
				str = "0.00";
			} else {
				str = Currency._2number(str, true);
			}
		}
		return <span className="in-wei">
			{str} {this._2id(p)}
		</span>;
	}
	_2id(p) {
		return p.id || p.symbol;
	}
	_2value(p) {
		if ('value' in p) return p.value;
		if ('balance' in p) return p.balance;
		if ('sum' in p) return p.sum;
	}
	_2format(p,m,id) {
		if ('format' in p) return p.format;
		var id = id||this._2id(p);
		if (!m.user) return;
		if (!m.user.wallets) return;
		return ((m.user.wallets||[]).filter(v=>v.symbol==id)[0]||{}).format;
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
Currency.isPositive = function(p, trueFalse_onlyFor_depositAndWithdraw) {
	var v = bn( Currency.prototype._2value(p) );
	if (p.type=="WITHDRAW") {
		return v.isNegative();
	} else {
		if (trueFalse_onlyFor_depositAndWithdraw && p.type!="DEPOSIT") {
			return null;
		}
		return !v.isNegative();
	}
};

export default Currency;
