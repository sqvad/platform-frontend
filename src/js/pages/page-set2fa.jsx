import React from 'react';
import T from '../tags.jsx';

class PageSet2FA extends T.Page {
	constructor(props) {
		super(props);
		this.setState({});
	}
	render(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s}>
				<hgroup>
					<h1>SING UP FOR INS ECOSYSTEM</h1>
					<h2>Join the breakthrough in the consumer goods industry</h2>
				</hgroup>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
}

export default PageSet2FA;
