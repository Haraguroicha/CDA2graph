function initialization() {
	var LOAD_ERROR = "Loading Error!!";
	document.title += " - Loading...";
	$(function() {
		$( "#plLoader" ).dialog({
			width: 600,
			height: 250,
			modal: true,
			show: { effect: "drop", direction: "left" },
			hide: { effect: "drop", direction: "right" },
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close").hide();
				$("#plLoader").attr("data-l10n-id", "appInitializing");
				$("#ui-dialog-title-plLoader").attr("data-l10n-id", "appInitializing");
				if($.browser.msie) {
					$("#plLoader").attr("title", LOAD_ERROR);
					$("#ui-dialog-title-plLoader").html(LOAD_ERROR);
					$("#plLoader > article").html(_("notSupportBrowser"));
					$("#plProgress").progressbar({value: 100});
				}
			},
			close: function(event,ui) { setTimeout("core.init(); core.Pages.addPage(); sample();", 100); },
			closeOnEscape: false,
			draggable: false,
			resizable: false
		});
	});
	var sslURL = location.href.replace(/^https?:\/\//,"https://") + "/../ssl.json";
	if(location.protocol.match(/http(s?):/i)[1] == "")
		$.ajax({
			type: "GET",
			url: sslURL,
			dataType: "json",
			success: function(data) {
				if(data.ssl == true)
					window.location.href = sslURL.replace(/\/\.\.\/ssl\.json$/, "");
				else
					pluginLoad();
			},
			error: function(xhr, statusText) {
				if(location.href.indexOf("localhost") == -1)
					if(statusText == "error")
						$("#sslError").modal('show');
			}
		});
	else
		pluginLoad();
}
$(document).ready(function() {
	initialization();
});
function pluginLoad() {
	$( "#plProgress" ).progressbar({value: 0});
	if(!$.browser.msie) {
		pl.addModule("jquery.scroll.Extensions");
		pl.addModule("etc.first");
		pl.addModule("stackTrace");
		pl.addModule("core");
		pl.addModule("core.UI");
		pl.addModule("core.Date");
		pl.addModule("core.Tabs");
		pl.addModule("core.Files");
		pl.addModule("core.Pages");
		pl.addModule("core.logger");
		pl.addModule("Extensions");
		pl.addModule("etc.last");
		pl.init();
	}
}
function main() {
	core.UI.changeLanguage();
	$('#plLoader article:first').html(_('appLoaded'));
	setTimeout("$('#plLoader').dialog('close');", 1000);
}
function sample() {
	setTimeout('core.Pages.appendHTML("<span id=\'testFont\'></span>");', 50);
	setTimeout('core.Pages.appendHTML("<span id=\'testFont1\'></span>");', 150);
	setTimeout('core.Pages.appendHTML("<span id=\'testFont2\'></span>");', 250);
	setTimeout('core.Pages.appendHTML("test測試123 ".repeat(50));', 500);
	setTimeout('core.Pages.appendHTML("test測試123 ".repeat(500));', 1000);
	setTimeout('core.Pages.appendHTML("進電影院的觀眾最近應該發現：電影放映前的政府「政令宣導短片」一片接一片，數量多到蓋離譜，已經蓋過商業廣告！先是反毒宣導接著外交部、客委會、勞委會輪番上陣，一口氣播5到6則，再來個莫名其妙穿得露骨的陸委會廣告，之後加送台北市府廣告，政令宣導讓花錢看電影想輕鬆一下的消費者倒胃，難道進電影院是來接受洗腦的嗎？而且連續從中央到地方超過五分鐘，讓你一次洗腦洗個夠，看到讓人噁心想吐！\\n其實電影業者也厭惡這樣以國家機器威逼商業機制的廣告模式，但，政府依《電影法施行細則》第11條「政令宣導及公共服務之電影片、幻燈片，由主管機關發交電影片映演業於每一電影片映演前放映，其放映時間，每場以三分鐘為度。」強逼電影業者播放洗腦廣告，但連續五則以上政令宣導早已超過三分鐘！而且，這樣的法規不符商業機制，具有濃濃的落後倒退的威權獨裁色彩，顯示政府沒把影視產業當文化事業，卻當成官方傳輸意識形態的工具。\\n翻開《電影法》可以窺知我國對影視產業心態的不健全，第5條說，主管機關在中央為新聞局，在地方為直轄市政府或縣市政府，行政院新聞局今年五月已走入歷史，但電影產業還規定了這麼多婆婆媽媽，難怪中央及地方政府交辦的廣告電影院業者不敢不播！針對這點，文化部真的應該出來講講話吧！再看看《電影法》第26條第7款說，如有「污衊古聖先賢或歪曲史實。違反前項規定之電影片，中央主管機關於檢查時，應責令修改或逕予刪剪或禁演。」這些法令充滿封建教條，與當前社會多元化，商業邏輯思維格格不入，顯示法令及政府思維落後影視文化產業很大一段路！\\n電影法第條第33條還規定「電影片製作業製作電影片合於左列情形之一者，應予獎勵：一、弘揚中華文化，配合國家政策，具有貢獻者。」真的很八股！試問，弘揚「台灣文化」難道不必獎勵嗎？弘揚「原住民文化」更該獎勵啊，這樣的電影法落後且不符多元文化潮流，正突顯雖然人民與社會進步、電影工業進步、影視產業一日千里，唯獨只有政府還停留在20世紀中葉的利用電影做政府文宣廣告的時代！\\n落後的《電影法》條文源自於民國72年，這是因為台灣的影視產業歷經長期威權統治，1960年代發展出「官控商營」的影視制度，採取國家中心的途徑(state-centered approach)建構威權主義國家的影視機構。威權主義國家為鞏固正當性，才以官控商營的電視制度傳輸官方意識型態，藉由廣告累積剩餘價值(林麗雲，2005年10月，《威權主義國家與電視：台灣與南韓的比較》，新聞學研究第85期)。正如同拿破崙認為「一支筆可以抵得過三千支毛瑟槍」，集權獨裁國家只是把影視產業媒體當做政府的政令宣導機構。但是，民主體制國家裡媒體被是監督政府的「第四權」，電影文化是創意想像的商業產物，也是提昇人類思維的文化創意。沒想到，一踏進電影院裡，連串砲轟的政令八股就讓台灣形象破功！\\n近年來，歷史課本與孔廟、儒家教育淪為大中國法統的洗腦工具，「君君臣臣」教育成為方便其統治奴化思考的工具，電視台連新聞都被買掉的「置入行銷」淪為政府洗腦工具，專門為中國塗脂抹粉的「中資媒體」已被NCC核准即將托拉斯化，有備而來入侵全民的腦袋，而應該是商業、娛樂、輕鬆的電影院，卻被執政者公然用來大量政令宣導，有這樣的影視產業真是閱聽人的悲哀！".repeat(10));', 1500);
	setTimeout('core.Pages.appendHTML("test測試123 ".repeat(1500));', 2000);
	setTimeout(function () {
		var templateANSI = "";
		for(var i = 33; i < 127; i++)
			templateANSI += i.toString() + ':%' + ((i <= 0xf) ? '0' : '') + i.toString(0x10).toUpperCase() + ' ';
		$("#testFont").html(decodeURIComponent(templateANSI));
		$("#testFont1").html(decodeURIComponent(templateANSI));
		$("#testFont2").html(decodeURIComponent(templateANSI));
	}, 2500);
}