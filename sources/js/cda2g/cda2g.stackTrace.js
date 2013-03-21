function stackTrace(a) {
	var a = a || {guess: !0}, b = a.e || null, a = !!a.guess, c = new stackTrace.implementation, b = c.run(b);
	var r = a ? c.guessAnonymousFunctions(b) : b;
	r.splice(0,3);
	return r;
}
stackTrace.implementation = function() {};
stackTrace.implementation.prototype = {
	run: function(a, b) {
		a = a || this.createException();
		b = b || this.mode(a);
		return "other" === b ? this.other(arguments.callee) : this[b](a)
	},createException: function() {
		try {
			this.undef()
		} catch (a) {
			return a
		}
	},mode: function(a) {
		return a.arguments && a.stack ? "chrome" : "string" === typeof a.message && "undefined" !== typeof window && window.opera ? !a.stacktrace || -1 < a.message.indexOf("\n") && a.message.split("\n").length > a.stacktrace.split("\n").length ? "opera9" : !a.stack ? "opera10a" : 0 > a.stacktrace.indexOf("called from line") ? 
		"opera10b" : "opera11" : a.stack ? "firefox" : "other"
	},instrumentFunction: function(a, b, c) {
		var a = a || window, e = a[b];
		a[b] = function() {
			c.call(this, printStackTrace().slice(4));
			return a[b]._instrumented.apply(this, arguments)
		};
		a[b]._instrumented = e
	},deinstrumentFunction: function(a, b) {
		a[b].constructor === Function && (a[b]._instrumented && a[b]._instrumented.constructor === Function) && (a[b] = a[b]._instrumented)
	},chrome: function(a) {
		a = (a.stack + "\n").replace(/^\S[^\(]+?[\n$]/gm, "").replace(/^\s+(at eval )?at\s+/gm, "").replace(/^([^\(]+?)([\n$])/gm, 
		"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}()@$1").split("\n");
		a.pop();
		return a
	},firefox: function(a) {
		return a.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n")
	},opera11: function(a) {
		for (var b = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/, a = a.stacktrace.split("\n"), c = [], e = 0, f = a.length; e < f; e += 2) {
			var d = b.exec(a[e]);
			if (d) {
				var i = d[4] + ":" + d[1] + ":" + d[2], d = d[3] || "global code", d = d.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, 
				"{anonymous}");
				c.push(d + "@" + i + " -- " + a[e + 1].replace(/^\s+/, ""))
			}
		}
		return c
	},opera10b: function(a) {
		for (var b = /^(.*)@(.+):(\d+)$/, a = a.stacktrace.split("\n"), c = [], e = 0, f = a.length; e < f; e++) {
			var d = b.exec(a[e]);
			d && c.push((d[1] ? d[1] + "()" : "global code") + "@" + d[2] + ":" + d[3])
		}
		return c
	},opera10a: function(a) {
		for (var b = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i, a = a.stacktrace.split("\n"), c = [], e = 0, f = a.length; e < f; e += 2) {
			var d = b.exec(a[e]);
			d && c.push((d[3] || "{anonymous}") + "()@" + d[2] + ":" + d[1] + " -- " + a[e + 
			1].replace(/^\s+/, ""))
		}
		return c
	},opera9: function(a) {
		for (var b = /Line (\d+).*script (?:in )?(\S+)/i, a = a.message.split("\n"), c = [], e = 2, f = a.length; e < f; e += 2) {
			var d = b.exec(a[e]);
			d && c.push("{anonymous}()@" + d[2] + ":" + d[1] + " -- " + a[e + 1].replace(/^\s+/, ""))
		}
		return c
	},other: function(a) {
		for (var b = /function\s*([\w\-$]+)?\s*\(/i, c = [], e, f; a && a.arguments && 10 > c.length; )
			e = b.test(a.toString()) ? RegExp.$1 || "{anonymous}" : "{anonymous}", f = Array.prototype.slice.call(a.arguments || []), c[c.length] = e + "(" + this.stringifyArguments(f) + 
			")", a = a.caller;
		return c
	},stringifyArguments: function(a) {
		for (var b = [], c = Array.prototype.slice, e = 0; e < a.length; ++e) {
			var f = a[e];
			void 0 === f ? b[e] = "undefined" : null === f ? b[e] = "null" : f.constructor && (f.constructor === Array ? b[e] = 3 > f.length ? "[" + this.stringifyArguments(f) + "]" : "[" + this.stringifyArguments(c.call(f, 0, 1)) + "..." + this.stringifyArguments(c.call(f, -1)) + "]" : f.constructor === Object ? b[e] = "#object" : f.constructor === Function ? b[e] = "#function" : f.constructor === String ? b[e] = '"' + f + '"' : f.constructor === Number && (b[e] = 
			f))
		}
		return b.join(",")
	},sourceCache: {},ajax: function(a) {
		var b = this.createXMLHTTPObject();
		if (b)
			try {
				return b.open("GET", a, !1), b.send(null), b.responseText
			} catch (c) {
			}
		return ""
	},createXMLHTTPObject: function() {
		for (var a, b = [function() {
				return new XMLHttpRequest
			}, function() {
				return new ActiveXObject("Msxml2.XMLHTTP")
			}, function() {
				return new ActiveXObject("Msxml3.XMLHTTP")
			}, function() {
				return new ActiveXObject("Microsoft.XMLHTTP")
			}], c = 0; c < b.length; c++)
			try {
				return a = b[c](), this.createXMLHTTPObject = b[c], a
			} catch (e) {
			}
	},isSameDomain: function(a) {
		return "undefined" !== typeof location && -1 !== a.indexOf(location.hostname)
	},getSource: function(a) {
		a in this.sourceCache || (this.sourceCache[a] = this.ajax(a).split("\n"));
		return this.sourceCache[a]
	},guessAnonymousFunctions: function(a) {
		for (var b = 0; b < a.length; ++b) {
			var c = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/, e = a[b], f = /\{anonymous\}\(.*\)@(.*)/.exec(e);
			if (f) {
				var d = c.exec(f[1]);
				d && (c = d[1], f = d[2], d = d[3] || 0, c && (this.isSameDomain(c) && f) && (c = this.guessAnonymousFunction(c, f, d), a[b] = e.replace("{anonymous}", 
				c)))
			}
		}
		return a
	},guessAnonymousFunction: function(a, b) {
		var c;
		try {
			c = this.findFunctionName(this.getSource(a), b)
		} catch (e) {
			c = "getSource failed with url: " + a + ", exception: " + e.toString()
		}
		return c
	},findFunctionName: function(a, b) {
		for (var c = /function\s+([^(]*?)\s*\(([^)]*)\)/, e = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/, f = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/, d = "", i, o = Math.min(b, 20), m, q = 0; q < o; ++q)
			if (i = a[b - q - 1], m = i.indexOf("//"), 0 <= m && (i = i.substr(0, m)), i)
				if (d = i + d, (i = e.exec(d)) && i[1] || 
				(i = c.exec(d)) && i[1] || (i = f.exec(d)) && i[1])
					return i[1];
		return "(?)"
	}
};