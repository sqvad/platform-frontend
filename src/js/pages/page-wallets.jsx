import React from 'react';
import T from '../tags.jsx';

class PageWallets extends T.Page {
	render(p,s,c,m) {
		var _m = JSON.parse(JSON.stringify(PageWallets.mockupModel));
		_m = Object.assign(_m, m);
		var _p = JSON.parse(JSON.stringify(p));
		_p.walletId = "ETH";
		var _s = JSON.parse(JSON.stringify(s));
		if (!_s.tab) {
			_s.tab = "transactions";
			_s.tab = "tokens";
			_s.tab = "send";
			_s.tab = "receive";
		}
		if (!_s.openedTransactions) {
			_s.openedTransactions = {"1":true};
		}
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
						{s.tab=="send"?this.render_send(p,s,c,m):null}
						{s.tab=="receive"?this.render_receive(p,s,c,m):null}
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
					<div className={"btn "+ ((p.tab||s.tab)=="transactions"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"transactions"})}
					>
						TRANSACTIONS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="tokens"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"tokens"})}
					>
						TOKENS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="send"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"send"})}
					>
						SEND
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="receive"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"receive"})}
					>
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
						return <div key={"-"+i} className={"transaction-container" + (opened?" opened":" closed")}
							onClick={()=>{
								var t = JSON.parse(JSON.stringify(s.openedTransactions));
								t[v.id] = !t[v.id];
								this.setState({openedTransactions:t});
							}}
						>
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
	render_send(p,s,c,m) {
		return <SendTokens {...p} {...s} m={m} />;
	}
	render_receive(p,s,c,m) {
		return <div>
			<h2>RECEIVE</h2>
			<h3>RECEIVING ADDRESS</h3>
			<div
				style={{border:"1px solid #e5e6e7",padding:"15px"}}
				className="d-flex align-items-center"
			>
				<img src="/img/qr-test.png" width="145" height="145" />
				<span>
					0x298DB031c12294c7235D00ef6380a4B53c9619a3
					<br />
					Receiver
				</span>
			</div>
			<h3>OTHER ADDRESSES</h3>
			<div
				style={{border:"1px solid #e5e6e7",padding:"15px"}}
				className="d-flex align-items-center"
			>
				<div
					style={{marginRight:"15px",paddingRight:"15px",borderRight:"1px solid #e5e6e7"}}
					className="align-self-stretch"
				>
					<b>Receiver</b>
					<br />
					0x298DB031c12294c7235D00ef6380a4B53c9619a3
				</div>
				<div
					className="d-flex justify-content-between w-100"
				>
					<div>
						<span className="mr-3">
							<span className="icon icon-24 icon-copy"></span>
							Copy
						</span>
						<span>
							<span className="icon icon-24 icon-qr"></span>
							QR-code
						</span>
					</div>
					<div>
						0.1234ETH
					</div>
				</div>
			</div>
		</div>;
	}
}
class SendTokens extends T.Any {
	constructor(props) {
		super(props);
		this.setState({
			currency: props.currency || "ETH",
			priority: props.priority || "medium",
			specifyCustomGasLimit: true,
		})
	}
	render(p,s,c,m) {
		return <div>
			<h2>SEND</h2>
			<p>This form allows you to spend funds from your wallet. Always double check your destination address!</p>

				<T.If v={1}><div style={{maxWidth:"482px"}}><T.Form>
					<T.Input.TxAdr
						name="to" placeholder="Send to"
						onChange={this.onTo.bind(this)} value={s.to} required
					/>
					<div className="d-flex">
						<T.Select
							useFormControl className="form-control mr-3" placeholder="Currency"
							required onChange={this.onCurrency.bind(this)} value={s.currency}
							options={
								m.user.wallets.map(v=>{
									return {value:v.id,title:v.id};
								})
							}
						/>
						<T.Input.Float
							name="amount" placeholder="Amount" min={0} aboveMin={true} max={5} belowMax={false}
							onChange={this.onAmount.bind(this)} value={s.amount} required
						/>
					</div>
					<T.Select
						useFormControl className="form-control" placeholder="Priority"
						required onChange={this.onPriority.bind(this)} value={s.specifyCustomGasLimit ? "custom" : s.priority}
						options={[
							{value:"low",title:"Low"},
							{value:"medium",title:"Medium"},
							{value:"high",title:"High"},
							s.specifyCustomGasLimit ? {value:"custom",title:"Custom"} : null,
						].filter(v=>!!v)}
						disabled={s.specifyCustomGasLimit}
					/>
					<T.Checkbox checked={s.specifyCustomGasLimit} onChange={this.onSpecifyCustomGasLimit.bind(this)}>
						Specify custom gas limit (advanced users)
					</T.Checkbox>
					<T.If v={s.specifyCustomGasLimit}><div>
						<T.Input.Float
							name="customFee" placeholder="Custom fee" min={0} aboveMin={true} exampleNum={0.01}
							onChange={this.onCustomFee.bind(this)} value={s.customFee} required
						/>
						<T.Input.Float
							name="gasLimit" placeholder="Gas limit" min={0} aboveMin={true} exampleNum={0.01}
							onChange={this.onAmount.bind(this)} value={s.amount} required
						/>
					</div></T.If>
					<T.Textarea v={s.note||""} onChange={this.onNote.bind(this)} />
					<div className="mt-4">
						<button type="submit"
							className={[
								"btn btn-lg btn-primary",
								false ? "" : " disabled",
							].join(" ")}
						>
							Sign Up
						</button>
					</div>
				</T.Form></div></T.If>

				<div style={{maxWidth:"548px"}}>
					<h2>REVIEW YOUR TRANSACTION</h2>
					<div style={{border: "1px solid #e5e6e7", padding:"15px"}}>
						<div style={{}}>
							You are about to send the following transaction:
							<br />
							<b>{s.amount} {s.currency}</b> to <b>{s.to}</b>
							<br />
							<b>{s.customFee} {s.currency}</b> as a transaction fee to miners.
						</div>
						<div style={{borderTop: "1px solid #e5e6e7", paddingTop:"15px", marginTop:"15px"}}>
							<b>{s.amount + s.customFee} {s.currency}</b> ETH in total.
							<div className="mt-4">
								<button type="submit"
									className={[
										"btn btn-lg btn-outline-primary",
										"mr-2"
									].join(" ")}
									style={{fontWeight:600}}
								>
									Cancel
								</button>
								<button type="submit"
									className={[
										"btn btn-lg btn-primary",
									].join(" ")}
								>
									Sign transaction
								</button>
							</div>
						</div>
					</div>
				</div>

		</div>;
	}
	onTo(to,toValid) {
		this.setState({to:to.trim(),toValid});
	}
	onCurrency(currency,currencyValid) {
		this.setState({currency,currencyValid});
	}
	onAmount(amount,amountValid) {
		this.setState({amount,amountValid});
	}
	onCustomGasLimit(customGasLimit,customGasLimitValid) {
		this.setState({customGasLimit,customGasLimitValid});
	}
	onPriority(priority,priorityValid) {
		this.setState({priority,priorityValid});
	}
	onSpecifyCustomGasLimit(on) {
		this.setState({specifyCustomGasLimit:on});
	}
	onCustomFee(customFee,customFeeValid) {
		this.setState({customFee,customFeeValid});
	}
	onNote(note) {
		this.setState({note})
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
