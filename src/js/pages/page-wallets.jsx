import React from 'react';
import T from '../tags.jsx';

class PageWallets extends T.Page {
	render(p,s,c,m) {
		var _m = JSON.parse(JSON.stringify(PageWallets.mockupModel));
		_m = Object.assign(_m, m);
		var _p = JSON.parse(JSON.stringify(p));
		_p.walletId = "ETH";
		var _s = JSON.parse(JSON.stringify(s));
		_s.tab = "transactions";
		_s.tab = "tokens";
		_s.openedTransactions = {"1":true};
		return this._render(_p,_s,c,_m);
	}
	_render(p,s,c,m) {
		if (p.walletId) {
			return this.renderWallet(p,s,c,m);
		} else {
			return this.render_walletsList(p,s,c,m);
		}
	}
	renderWallet(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.id==p.walletId)[0];
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p} />
				</T.Page.PageWrapProfileLeft>
				<div className="w-100">
					{this.renderWallet_header(p,s,c,m)}
					<div className="profile-center">
						{c}
						{s.tab=="transactions"?this.renderWallet_transactions(p,s,c,m):null}
						{s.tab=="tokens"?this.renderWallet_tokens(p,s,c,m):null}
					</div>
				</div>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	renderWallet_header(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.id==p.walletId)[0];
		return <div className="bg-violet">
			<div className="profile-center wallet-page-header">
				<h1>My {wallet.id} wallet</h1>
				<div className="wallet-page-stat">
					{wallet.value} {wallet.id}
					<br />
					<span className="in-usd">{wallet.usd} USD</span>
				</div>
				<div className="btn-group btn-group-toggle d-flex justify-content-start flex-wrap">
					<div className={"btn "+ ((p.tab||s.tab)=="transactions"?" btn-secondary active":" btn-outline-secondary")}>
						TRANSACTIONS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="tokens"?" btn-secondary active":" btn-outline-secondary")}
					>
						TOKENS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="send"?" btn-secondary active":" btn-outline-secondary")}>
						SEND
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="receive"?" btn-secondary active":" btn-outline-secondary")}>
						RECEIVE
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="settings"?" btn-secondary active":" btn-outline-secondary")}>
						SETTINGS
					</div>
				</div>
			</div>
		</div>;
	}
	renderWallet_tokens(p,s,c,m) {
		return <div className="transactions-tokens">
			<div className="mt-4 d-flex justify-content-between align-items-center">
				<h2>Tokens</h2>
				<T.Checkbox checked={s.showEmptyBalances} onChange={(on)=>this.setState({showEmptyBalances:on})}>
					Show empty balances
				</T.Checkbox>
			</div>
			<table className="table-transactions-tokens w-100">
				<tbody>
					<tr>
						<th>Augur</th><td>REP</td><td className="w-100 text-right">0.00 REP</td>
					</tr>
					<tr>
						<th>Bancor</th><td>BNT</td><td className="w-100 text-right">0.00 BNT</td>
					</tr>
					<tr>
						<th>Basic Attention Token</th><td>BAT</td><td className="w-100 text-right">0.00 BAT</td>
					</tr>
					<tr>
						<th>Binance</th><td>BNB</td><td className="w-100 text-right">0.00 BNB</td>
					</tr>
				</tbody>
			</table>
		</div>;
	}
	renderWallet_transactions(p,s,c,m) {
		var transactions = [
		  { id: 1, date: new Date(2018, 3-1, 22, 10, 56, 42),
			type: "sent", value: "0.0001", currency: "eth", tx: "0xf064a664f6bdf6cfda604c21935bc92c5c7597a7b00f9630c1f8", desc:"thank you", confirmations: 1234 },
		{ id: 2, date: new Date(2018, 3-1, 22, 10, 56, 41),
		  type: "received", value: "0.0001", currency: "eth", tx: "0xf264a664f6bdf6cfda604c21935bc92c5c7597a7b00f9630c1f2", desc:"", confirmations: 1234 },
		{ id: 3, date: new Date(2018, 3-1, 21, 7+12, 12, 13),
		  type: "sent", value: "0.0001", currency: "eth", tx: "0xf364a664f6bdf6cfda604c21935bc92c5c7597a7b00f9630c1f3", desc:"", confirmations: 1234 },
		];
		var byDays = T.Date.groupByDay(JSON.parse(JSON.stringify(transactions)), v=>v.date);
		return <div className="transactions-list">
			<h2>TRANSACTIONS</h2>
			{byDays.map((transactions,i)=>{
				return <div key={i}>
					<h3><T.Date onlyDate v={new Date(transactions[0].date)} /></h3>
					{transactions.map((v,i)=>{
						var opened = s.openedTransactions[""+v.id];
						var descIsSmall = (v.desc || "").length < 100;
						return <div key={"-"+i} className={"transaction-container" + (opened?" opened":" closed")}>
							<div className="transaction-header d-flex">
								<div className="transaction-toggler">
									{opened?"–":"+"}
								</div>
								<div className="transaction-value">
									<span className={v.type=="received" ? "green" : v.type=="sent" ? "red" : ""}>
										{v.value} {v.currency}
									</span>
								</div>
								<div className="transaction-type">
									{v.type}
								</div>
								<div className="transaction-time">
									<T.Date onlyTime v={new Date(v.date)} />
								</div>
							</div>
							{opened?
								<div className="transaction-details d-flex">
									<div className="transaction-details-field">
										<i>Transaction ID</i>
										<br />
										<T.TX tx={v.tx} fullAdrOnDesktop={descIsSmall} {...p} />
										{
											descIsSmall?null:
											<span>
												<br />
												<i>Confirmations</i>
												<br />
												{v.confirmations}
											</span>
										}
									</div>
									{descIsSmall?<div className="transaction-details-field">
										<i>Confirmations</i>
										<br />
										{v.confirmations}
									</div>:null}
									<div className={"transaction-details-field" + (v.desc ? " invert" : "")} style={{flex:1,marginRight:"0"}}>
										<i>Description</i>
										<br />
										{v.desc || "No description"}
									</div>
								</div>
							:null}
						</div>;
					})}
				</div>;
			})}
		</div>;
	}
	render_walletsList(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p} />
				</T.Page.PageWrapProfileLeft>
				<T.Page.PageWrapProfileWidth>
					<h1>Wallets</h1>
					<div className="wallets-list">
						{m.user.wallets.map((v,i)=>{
							return <div key={"wallet"+i} className={"wallet wallet-"+v.id}>
								<div className={"icon-currency-horizontal icon-currency-"+v.id}></div>
								<div className="d-flex flex-row justify-content-between">
									My {v.id} Wallet
									<span>
										{v.value} {v.id}
									</span>
								</div>
								<div className="in-usd">
									{v.usd} USD
								</div>
							</div>;
						})}
					</div>
				</T.Page.PageWrapProfileWidth>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
}

PageWallets.mockupModel = {
	user: {
		userType: "...",
		wallets: [
			{
				id: "ETH",
				value: "0.1234",
				usd: 1012105.00
			},
			{
				id: "BTC",
				value: "0.0001",
				usd: 1.04
			},
			{
				id: "INS",
				value: "0",
				usd: 0
			},
		]
	}
};

export default PageWallets;
