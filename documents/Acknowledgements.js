var z = (function () {
	const Ack = [ '\\x8A\\x8C', '\\x8B\\x1D' ], nL = {
		friend: [ 'E4-05F41E@', '\\xE4A@\\xECPC', '\\xE0OD\\xE0OD', 'EBA17CEBAD3B' ],
		lab: [ 'F00F02EBBEF4', '\\xE7\\xD1E\\xE80y', 'EFA17CE85DB6', 'E410zF0216',
				'\\xE7\\x7E\\x3D\\xEFM9', '\\xE0M5\\xE4\\x1F\\x3D' ],
		teacher: [ 'F3CE03EB9F3B', '\xE7\x9EE\xEB\xAD\x04' ]
	}, ls = '\164\157L\x6F\x63\x61\x6C\x65S\164\162\x69\x6E\x67', tz = '\040\050\x55\x54\x43\053\x38\051';
	const v = 'ev', ba = btoa, w = window, d = Date, e = w[v+'al'], ue = unescape; var str = '', nLS = undefined || '';
	w.f = new d(0x07DD,'\x35', 015, 0x0B, '\x33\x30')[ls]() + tz; if(!w['\x24'])
		return '\111\x20\x6E\x65\x65\x64\040\x6D\x6F\x6E\x65\171'; w.a = new d(0x07DD,'\x35', 0x12, 025, 018)[ls]() + tz;
	if(!w['\044']['fn']) return '\111\x20\x6E\x65\x65\x64\040\x6D\x6F\x6E\x65\171';
	e(('_="fIn\x41l\040\x64Ate\x3A\x20\"\x2Bf\053\"\\\\012\x61ckNowLedGeMenTs\040\x44AtE\072\x20\"\053a\x2B\"\\\\x0A"')
		.replace(/([A-Za-z]+(\ |:))/g, function(x) {return x[0].toUpperCase() + x.substr(1).toLowerCase();}));
	$(Ack).each(function(){str+=('%u' +this.toString().replace(/\\x/g, ''));}); _+=str+'%u7D66%uFF1A';
	for(var k in nL) $(nL[k]).each(function(){
		nLS += (nLS.length > 0 ? '\x3B' : '') +
			ue(ba(ue((this.indexOf('\\x') != -1 ? this.replace(/\\x([0-9A-F]{2,4})/g, '%$1') :
				this.replace(/([0-9A-F]{2})/g, '%$1')))).replace(/([0-9A-Z]{4})/g, '%u$1'));
		});_+=nLS;_=ue(_);w.e=e;
	return e('\145(\x27\042\x27+_+\047\x22\047)');
})();console.log(z);