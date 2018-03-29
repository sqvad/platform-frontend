import React from 'react';
import T from '../tags.jsx';

class PageEmpty extends T.Page {
	componentWillMount() {
		super.componentWillMount();
	}
	render(p,s,c,m) {
		return <T.Page m={m} pagePostfix="empty" header="short">
			<div>
				@todo src/js/pages/page-empty.jsx
				<div className="mt-3">
					<button type="button" className="btn btn-primary">Primary</button>
					<button type="button" className="btn btn-secondary">Secondary</button>
					<button type="button" className="btn btn-success">Success</button>
					<button type="button" className="btn btn-danger">Danger</button>
					<button type="button" className="btn btn-warning">Warning</button>
					<button type="button" className="btn btn-info">Info</button>
					<button type="button" className="btn btn-light">Light</button>
					<button type="button" className="btn btn-dark">Dark</button>
					<button type="button" className="btn btn-link">Link</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-outline-success">Success</button>
					<button type="button" className="btn btn-outline-danger">Danger</button>
					<button type="button" className="btn btn-outline-warning">Warning</button>
					<button type="button" className="btn btn-outline-info">Info</button>
					<button type="button" className="btn btn-outline-light">Light</button>
					<button type="button" className="btn btn-outline-dark">Dark</button>
					<button type="button" className="btn btn-outline-link">Link</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn active btn-primary">Primary</button>
					<button type="button" className="btn active btn-secondary">Secondary</button>
					<button type="button" className="btn active btn-success">Success</button>
					<button type="button" className="btn active btn-danger">Danger</button>
					<button type="button" className="btn active btn-warning">Warning</button>
					<button type="button" className="btn active btn-info">Info</button>
					<button type="button" className="btn active btn-light">Light</button>
					<button type="button" className="btn active btn-dark">Dark</button>
					<button type="button" className="btn active btn-link">Link</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn active btn-outline-primary">Primary</button>
					<button type="button" className="btn active btn-outline-secondary">Secondary</button>
					<button type="button" className="btn active btn-outline-success">Success</button>
					<button type="button" className="btn active btn-outline-danger">Danger</button>
					<button type="button" className="btn active btn-outline-warning">Warning</button>
					<button type="button" className="btn active btn-outline-info">Info</button>
					<button type="button" className="btn active btn-outline-light">Light</button>
					<button type="button" className="btn active btn-outline-dark">Dark</button>
					<button type="button" className="btn active btn-outline-link">Link</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn disabled btn-primary">Primary</button>
					<button type="button" className="btn disabled btn-secondary">Secondary</button>
					<button type="button" className="btn disabled btn-success">Success</button>
					<button type="button" className="btn disabled btn-danger">Danger</button>
					<button type="button" className="btn disabled btn-warning">Warning</button>
					<button type="button" className="btn disabled btn-info">Info</button>
					<button type="button" className="btn disabled btn-light">Light</button>
					<button type="button" className="btn disabled btn-dark">Dark</button>
					<button type="button" className="btn disabled btn-link">Link</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn disabled btn-outline-primary">Primary</button>
					<button type="button" className="btn disabled btn-outline-secondary">Secondary</button>
					<button type="button" className="btn disabled btn-outline-success">Success</button>
					<button type="button" className="btn disabled btn-outline-danger">Danger</button>
					<button type="button" className="btn disabled btn-outline-warning">Warning</button>
					<button type="button" className="btn disabled btn-outline-info">Info</button>
					<button type="button" className="btn disabled btn-outline-light">Light</button>
					<button type="button" className="btn disabled btn-outline-dark">Dark</button>
					<button type="button" className="btn disabled btn-outline-link">Link</button>
				</div>
			</div>
		</T.Page>;
	}
};

export default PageEmpty;
