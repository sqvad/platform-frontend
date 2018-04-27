import React from 'react';
import T from '../tags.jsx';

class PageForgot2FA extends T.Page {
	constructor(props) {
		super(props);
		this.props.m.api.getAuthData();
		this.props.m.api.getUserData();
		this.setState({
			email: this.props.m && this.props.m.auth && this.props.m.auth.email || "",
			password:"", //popupForgotPassword: true,
		});
	}
	render(p,s,c,m) {
		var files = s.files||[];
		var withPreview = files.filter(v=>v.previewIsReady).sort((a,b)=>a.name<b.name);
		var withNoPreview = files.filter(v=>!v.previewIsReady).sort((a,b)=>a.name<b.name);
		withNoPreview = withNoPreview.map(function(v,i){
			return <span key={i} className="upload-a-photo-no-preview">
				{v.name}<br />
			</span>;
		});
		withPreview = withPreview.map(function(v,i){
			var img;
			var ret = <img
				key={i} src={v.previewUrl}
				className="upload-a-photo-preview"
				alt={v.name} title={v.name}
				ref={el=>img=el}
				onLoad={function(){
					console.log(img);
					var isVertical = false;
					var rate;
					if ('naturalWidth' in img) {
						isVertical = img.naturalWidth < img.naturalHeight;
						rate = img.naturalWidth / img.naturalHeight;
					} else {
						isVertical = img.width < img.height;
						rate = img.width / img.height;
					}
					if (isVertical) {
						img.className += " is-vertical";
						img.style["max-width"] = Math.round(img.height * rate) +"px";
					} else {
						img.className += " is-horizontal";
						img.style["max-height"] = Math.round(img.width / rate) +"px";
					}
				}} />;
			return ret;
		});
		return <T.Page.PageWrapDevice m={m} pagePostfix="signup">
			<T.Page.PageWrapHeader key="header" m={m} header="short" {...s}>
			</T.Page.PageWrapHeader>
			<T.Page.PageWrapWidth key="width" m={m} {...p}>
				<h1 className="h1-center mt-5">CONFIRM YOUR REQUEST</h1>
				<p className="text-center">
					Take a high quality photo of yourself holding your ID document and a handwritten note:
					<br /><br />
					<i className="text-muted">"[current date] for INS Ecosystem only"</i>
					<br /><br />
					and upload it here.
				</p>
				<div style={{width:"100%",overflow:"hidden"}}>
					{withNoPreview.length ? <div className="upload-a-photo-list-no-previews mt-2 mb-2">{withNoPreview}</div> : null}
					{withPreview.length ? <div className="upload-a-photo-list-previews mt-2 mb-2">{withPreview}</div> : null}
					<label className="upload-a-photo d-flex flex-column align-items-center">
						{
							!withNoPreview.length && !withPreview.length
							? <div className="upload-a-photo-empty"></div>
							: null
						}
						<button type="button"
						className={[
							"upload-a-photo-btn btn btn-primary btn-with-icon-at-left-side",
							s.sent || s.fetching ? "disabled" : ""
						].filter(v=>!!v).join(" ")}>
							<span className="icon icon-24 icon-download icon-white"></span>
							Upload photo
						</button>
						<input
							type="file" multiple className="upload-a-photo-input" onChange={this.onFiles.bind(this)}
							disabled={s.sent || s.fetching}
						/>
					</label>
				</div>
				<T.If v={s.sent}><div className="mt-4">
					<p style={{textAlign:"center"}}>Sent!</p>
				</div></T.If>
				<T.If v={s.serverEr}><div className="mt-4">
					<p style={{textAlign:"center"}}>Some error...</p>
					<T.Form.ServerError {...s.serverEr} />
				</div></T.If>
				<div className="d-flex flex-column align-items-center mt-4 mb-4">
					<button type="button"
						className={[
							"btn btn-lg btn-primary-outline",
							s.sent || s.fetching || !(this.files||[]).length ? "disabled" : ""
						].filter(v=>!!v).join(" ")}
						onClick={this.onSubmit.bind(this)}
					>
						SUBMIT REQUEST
					</button>
				</div>
			</T.Page.PageWrapWidth>
		</T.Page.PageWrapDevice>;
	}
	onSubmit() {
		this.setState({fetching:true,serverEr:null})
		this.props.m.api.sendTotpResetRequest(this._files)
		.then(()=>{
			this.setState({fetching:false,serverEr:null,sent:true});
		})
		.catch(x=>{
			this.setState({fetching:false,serverEr:x,sent:false});
		})
	}
	onFiles(e) {
		this._files = [].slice.call(e.target.files||[], 0);
		this.files = [];
		this.setState({haveFiles:this.files.length,er:null});
		try {
			this.updatePreviews();
		} catch(er) {
			debugger;
			er;
		}
	}
	updatePreviews() {
		var previewFor = this._files;
		this.files = [];
		[].forEach.call(this._files, (v,i)=>{
			var v_ = {
				size: v.size,
				name: v.name,
				type: v.type,
				previewIsPossible: v.type.match('image.*'),
				previewIsReady: false,
				previewUrl: "",
			}
			this.files[i] = v_;
			this.setState({files:this.files},()=>{this.forceUpdate()});
			if (v_.previewIsPossible) {
				var reader = new FileReader();
				reader.onload = e => {
					if (this._files!=previewFor) return;
					v_.previewIsReady = true;
					v_.previewUrl = e.target.result;
					this.setState({files:this.files},()=>{this.forceUpdate()});
				};
				reader.readAsDataURL(v);
			}
		});
	}
}

export default PageForgot2FA;
