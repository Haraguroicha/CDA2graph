var pl = new function pluginLoader(mods) {
	var modules = [];
	var actived = 0;
	this.loadModule = function loadModule(modName) {
		var date = new Date().toISOString();
		if(typeof(core) != "undefined")
			if(typeof(core.Date) != "undefined") date = new core.Date();
		console.log("** pl[" + date + "]: Loading Module: " + modName);
		this.addScript(modName);
		actived++;
	}
	this.addScript = function addScript(mod) {
		var script = document.createElement("script");
		script.setAttribute("type","text/javascript");
		script.setAttribute("src", "js/" + mod + ".js");
		script.onload = function () {
			$( "#plMessage" ).prepend('<span data-l10n-id="plLoading">Loading </span>\'' + mod + '\'...<br />');
			$( "#plProgress" ).progressbar({value: actived / modules.length * 100});
			setTimeout(function(){pl.init();}, 25);
		}
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	this.addModule = function addModule(modName) {
		var id = modules.push(modName);
		return modules[id - 1];
	}
	this.init = function init(ms) {
		var isEnd = true;
		if(ms == undefined) ms = modules;
		if(typeof(ms) == "string") ms = ms.split(",");
		for(var k = actived; k < ms.length; k++) {
			var mod = ms[k];
			if(typeof(mod) == "string") {
				this.loadModule(mod);
				isEnd = false;
				break;
			}
		}
		if(isEnd && typeof(main) == "function") {
			$( "#plMessage" ).prepend('<span data-l10n-id="plFinalizing">Finalizing</span>...<br/>');
			setTimeout("main();", 500);
		}
	}
	if(mods != undefined) {
		this.init(mods);
	}
}