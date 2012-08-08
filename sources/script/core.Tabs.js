core.Tabs = new function Tabs() {
	var prefix = "menuItem_";
	var menuList = $("menubox").getElementsByTagName("ul")[0];
	var buttons = [];
	var _constructor = function _constructor(px) {
		var prefix = px;
		this.name = null;
		this.image = null;
		this.function = undefined;
		this.state = true;
		this.isActived = function () {
			return $(prefix + this.name).getElementsByTagName("a")[0].classList.contains("selectedItem");
		}
		this.element = null;
	};
	this.newButton = function newButton(c) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var span = document.createElement("span");
		span.innerHTML = c.name;
		span.classList.add("iconLabel");
		img.src = c.image;
		a.appendChild(img);
		a.appendChild(span);
		li.appendChild(a);
		li.id = prefix + c.name;
		return li;
	}
	this.add = function add(name, src, func) {
		if(!this.contains(name)) {
			var c = new _constructor(prefix);
			c.name = name;
			c.image = src;
			c.function = func;
			c.element = this.newButton(c);
			menuList.appendChild(c.element);
			buttons.push(c);
			this.refresh();
		}
	}
	this.remove = function remove(name) {
		var k = this.contains(name, true);
		if(k) {
			var btn = buttons[k];
			var mi = this.item(btn.name);
			mi.parentNode.removeChild(mi);
			delete buttons[k];
			this.refresh();
		}
	}
	this.tabClicked = function tabClicked() {
		core.setActive($x("//span[@class='iconLabel']"), this);
		var obj = buttons[core.Tabs.contains(this.title, true)];
		if(obj) obj.function(this);
		core.logger.log(sprintf("Tab '%s' clicked and calling constructor > %s", this.title, obj));
	}
	this.refresh = function refresh() {
		core.setTitle($x("//span[@class='iconLabel']"), 1);
		core.removeEventListener($x("//span[@class='iconLabel']"), "click", this.tabClicked, 1);
		core.addEventListener($x("//span[@class='iconLabel']"), "click", this.tabClicked, 1);
		var mb = $("menubox");
		mb.className = (mb.offsetHeight > 0) ? "show" : "";
		setTimeout(function() {core.UI.resize();}, 500);
	}
	this.contains = function contains(name, needId) {
		for(var k in buttons) {
			var btn = buttons[k];
			if(typeof(btn) == "object") {
				if(btn.name == name) {
					if(needId === true)
						return k;
					else
						return true;
				}
			}
		}
		return false;
	}
	this.setState = function setState(st) {
		var k = this.contains(name, true);
		if(k) {
			var btn = buttons[k];
			btn.state = st;
			var mi = this.item(btn.name);
			mi.disabled = (btn.state) ? "" : "disabled";
		}
	}
	this.item = function item(name) {
		return $(prefix + name);
	}
}