var pl = new function pluginLoader(mods) {
	var modules = [];
	var actived = 0;
	this.loadModule = function loadModule(modName) {
		console.log("** pl: Loading Module: " + modName);
		this.addScript("script/" + modName + ".js");
		actived++;
	}
	this.addScript = function addScript(src) {
		var script = document.createElement("script");
		script.setAttribute("type","text/javascript");
		script.setAttribute("src", src);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	this.addModule = function addModule(modName) {
		var id = modules.push(modName);
		return modules[id - 1];
	}
	this.init = function init(ms) {
		if(ms == undefined) ms = modules;
		if(typeof(ms) == "string") ms = ms.split(",");
		for(var k = actived; k < ms.length; k++) {
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