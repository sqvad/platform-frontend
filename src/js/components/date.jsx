import React from 'react';
import Any from '../any.jsx';

class _Date extends Any {
	render(p,s,c,m) {
        var v = p.v;
        var y = v.getFullYear();
        var mon = v.getMonth();
        var mon_ = ["January","February","March","April","May","June","Jule","August","September","October","November","December"][mon];
        var d = v.getDate();
        var h = v.getHours();
        var isPM = h>12;
        if (isPM) h -= 12;
        var h_ = (h<10 ? "0" : "") + h;
        var m = v.getMinutes();
        var m_ = (m<10 ? "0" : "") + m;
        var s = v.getSeconds();
        var s_ = (s<10 ? "0" : "") + s;
		var mutes = p.mutes || {};
		if (mutes.y) y = <span className="text-muted">{y}</span>;
        if (p.onlyDate) {
            return <span>{y}&nbsp;{mon_}&nbsp;{d}</span>;
        } else if (p.onlyTime) {
            return <span>{h_}:{m_}:{s_}&nbsp;{isPM?"pm":"am"}</span>;
        }
	}
}

_Date.groupByDay = function(dates, getDate) {
    if (!getDate) getDate = v=>v;
    var dayKeys = [];
    var byDay = {};
    dates.forEach(v=>{
        var date = new Date(getDate(v));
        var hoursAtDecimals = date / (1*1000*60*60*24);
        var dayI = Math.floor(hoursAtDecimals);
        if (!byDay[dayI]) {
            byDay[dayI] = [];
            dayKeys.push(dayI);
        }
        byDay[dayI].push(v);
    });
    dayKeys.sort((a,b)=>a*1<b*1);
    return dayKeys.map(k=>{
        dates = byDay[k];
        dates.sort((a,b)=>{
            return new Date(getDate(a)) > new Date(getDate(b));
        });
        return dates;
    });
};
_Date.propTypes = {
	v: Any.PropTypes.instanceOf(Date),
    onlyDate: Any.PropTypes.bool,
    onlyTime: Any.PropTypes.bool,
};

export default _Date;
