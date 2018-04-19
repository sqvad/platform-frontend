import React from 'react';
import Any from '../any.jsx';

class ServerError extends Any {
	render(p,s,c,m) {
		var src = p.serverError || p;
		if (!src || !src.message && (!src.errors || src.errors.length==0)) return null;
		return <div className="server-errors">
			<div className="server-error-message">
				{(src.message||'').trim()}
			</div>
			<div>
				{(src.errors||[]).map((v,i)=>{
					return <div className="server-error" key={i}>
					</div>;
				})}
			</div>
		</div>;
	}
}

export default ServerError;
