import render from './js/render.jsx';
import model from './js/model.js';

if (module.hot) {
    module.hot.accept();
}

(function(){
	iter();
	function iter() {
		var root = document.getElementById("root");
		var settings = root.getAttribute("data-settings");
		if (!settings) {
			requestAnimationFrame(iter);
			return;
		}
		if (root.getAttribute("data-cant-run")) {
			return;
		}
		model.settings = JSON.parse(settings);
        model.defaultKeys = [];
        for (var k in model) {
            model.defaultKeys.push(k);
        }
		render(model);
	}
})();
