import React from 'react';
import T from '../tags.jsx';

class PageEmpty extends T.Page {
	componentWillMount() {
		super.componentWillMount();
	}
	render(p,s,c,m) {
		return <div style={{padding:"30px"}}>
			Pages:
			<ul>
				<li><T.A href="/start" m={m}>[start]</T.A></li>
				<li><T.A href="/signup" m={m}>Sign Up</T.A></li>
				<li><T.A href="/set2fa" m={m}>PageSet2FA</T.A></li>
				<li><T.A href="/signin" m={m}>PageSignIn</T.A></li>
				<li><T.A href="/wallets" m={m}>PageWallets</T.A> – not for anonymous</li>
				<li><T.A href="/settings" m={m}>PageSettings</T.A> – not for anonymous</li>
			</ul>
			<T.If v={!m.auth}>
				<div>
					<p>
						Change <code>showPagesList</code> in settings.json to
						start with <T.A href={m.settings.misc.startPage} m={m}>{m.settings.misc.startPage}</T.A>
						&nbsp;automaticly
						(or <T.A href="/start" m={m}>[start]</T.A> for anonymous).
					</p>
					<p>
						<code>userData</code> is unknown yet – <T.A m={m} href="/"
							onClick={()=>{
								this.setState({pending:true});
								m.api.getAuthData().then(()=>{
									this.setState({pending:false});
								});
							}}
						>fetch user data</T.A>.<T.If v={s.pending}><span>..</span></T.If>
					</p>
				</div>
			</T.If>
			<T.If v={m.auth && !m.auth.signedIn}>
				<p>
					Change <code>showPagesList</code> in settings.json to
					start with <T.A href={m.settings.misc.startPage} m={m}>{m.settings.misc.startPage}</T.A>
					&nbsp;automaticly (or <b><T.A href="/start" m={m}>[start] for anonymous</T.A></b>).
				</p>
			</T.If>
			<T.If v={m.auth && m.auth.signedIn}>
				<div>
					<p>
						Change <code>showPagesList</code> in settings.json
						to <b><T.A href={m.settings.misc.startPage} m={m}>start with {m.settings.misc.startPage}</T.A></b> automaticly
						(or <T.A href="/start" m={m}>[start]</T.A> for anonymous).
					</p>
					<p>
						You are signed in as {m.auth && m.auth.email}.
					</p>
				</div>
			</T.If>
		</div>
	}
};

export default PageEmpty;
