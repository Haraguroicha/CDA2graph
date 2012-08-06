var pl = new function pluginLoader(mods) {
	var modules = [];
	this.loadModule = function loadModule(modName) {
		console.log("** pl: Loading Module: " + modName);
		this.addScript("script/" + modName + ".js");
	}
	this.addScript = function addScript(src) {
		var script = document.createElement("script");
		script.setAttribute("type","text/javascript");
		script.setAttribute("src", src);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	this.addModule = function addModule(modName) {
		modules.push(modName);
	}
	this.init = function init(ms) {
		if(ms == undefined) ms = modules;
		if(typeof(ms) == "string") ms = ms.split(",");
		for(var k in ms) {
			var mod = ms[k];
			if(typeof(mod) == "string") {
				this.loadModule(mod);
			}
		}
	}
	if(mods != undefined) {
		this.init(mods);
	}
}