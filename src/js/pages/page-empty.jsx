import React from 'react';
import T from '../tags.jsx';

class PageEmpty extends T.Page {
	componentWillMount() {
		super.componentWillMount();
	}
	render(p,s,c,m) {
		return <T.Page m={m} pagePostfix="empty">
			<div>
				@todo src/js/pages/page-empty.jsx
			</div>
		</T.Page>;
	}
};

export default PageEmpty;
