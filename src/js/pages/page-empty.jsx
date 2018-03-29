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
				<p className="mt-4">Default state:</p>
				<div>
					<button type="button" className="btn btn-primary">Primary</button>
					<button type="button" className="btn btn-secondary">Secondary</button>
					<button type="button" className="btn btn-sm btn-primary">Primary</button>
					<button type="button" className="btn btn-sm btn-secondary">Secondary</button>
					<button type="button" className="btn btn-lg btn-primary">Primary</button>
					<button type="button" className="btn btn-lg btn-secondary">Secondary</button>
				</div>
				<div className="mt-3 mb-4">
					<button type="button" className="btn btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-sm btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-sm btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-lg btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-lg btn-outline-secondary">Secondary</button>
				</div>
				<p>Active+hover state:</p>
				<div>
					<button type="button" className="btn active btn-primary">Primary</button>
					<button type="button" className="btn active btn-secondary">Secondary</button>
					<button type="button" className="btn btn-sm active btn-primary">Primary</button>
					<button type="button" className="btn btn-sm active btn-secondary">Secondary</button>
					<button type="button" className="btn btn-lg active btn-primary">Primary</button>
					<button type="button" className="btn btn-lg active btn-secondary">Secondary</button>
				</div>
				<div className="mt-3 mb-4">
					<button type="button" className="btn active btn-outline-primary">Primary</button>
					<button type="button" className="btn active btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-sm active btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-sm active btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-lg active btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-lg active btn-outline-secondary">Secondary</button>
				</div>
				<p>Disabled state:</p>
				<div>
					<button type="button" className="btn disabled btn-primary">Primary</button>
					<button type="button" className="btn disabled btn-secondary">Secondary</button>
					<button type="button" className="btn btn-sm disabled btn-primary">Primary</button>
					<button type="button" className="btn btn-sm disabled btn-secondary">Secondary</button>
					<button type="button" className="btn btn-lg disabled btn-primary">Primary</button>
					<button type="button" className="btn btn-lg disabled btn-secondary">Secondary</button>
				</div>
				<div className="mt-3">
					<button type="button" className="btn disabled btn-outline-primary">Primary</button>
					<button type="button" className="btn disabled btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-sm disabled btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-sm disabled btn-outline-secondary">Secondary</button>
					<button type="button" className="btn btn-lg disabled btn-outline-primary">Primary</button>
					<button type="button" className="btn btn-lg disabled btn-outline-secondary">Secondary</button>
				</div>
			</div>
		</T.Page>;
	}
};

export default PageEmpty;
