import React from 'react';
import Any from '../any.jsx';

class Textarea extends Any {
	render(p,s,c,m) {
		return <div className="input-group with-placeholder flex-column for-textarea">
			<div class="placeholder">Note</div>
			<div>
				<textarea
					value={p.value} onChange={this.onChange.bind(this)}
					className="form-control w-100"
				></textarea>
			</div>
		</div>
	}
	onChange(e) {
		this.props.onChange(e.target.value);
	}
}

export default Textarea;
