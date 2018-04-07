import React from 'react';
import Any from '../any.jsx';

class Checkbox extends Any {
	render(p,s,c,m) {
        return <label className="form-check-label">
            <span className={"checkbox-beauty "+(p.checked?" checked":" unchecked")}>
                <input type="checkbox" className="form-check-input" onChange={(e)=>p.onChange(e.target.checked)} />
                <span className="checkbox-bg">
                    {p.checked ? <span className="checkbox-checked-1"></span> : null}
                    {p.checked ? <span className="checkbox-checked-2"></span> : null}
                </span>
            </span>
            {c}
        </label>;
    }
}

export default Checkbox;
