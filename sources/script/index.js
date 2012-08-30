function initialization() {
	window.namespaces = "cda2g.hhmr.biz";
	$(function() {
		$( "#plLoader" ).dialog({
			width: 600,
			height: 250,
			modal: true,
			show: { effect: "drop", direction: "left" },
			hide: { effect: "drop", direction: "right" },
			open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
			close: function(event,ui) { setTimeout("core.init();", 100); },
			closeOnEscape: false,
			draggable: false,
			resizable: false
		});
	});
	$( "#plProgress" ).progressbar({value: 0});
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
initialization();
function main() {
	core.Pages.addPage().appendHTML("test測試123 ".repeat(50)).appendHTML("test測試123 ".repeat(500));
	core.Pages.init();
	$( '#plLoader article:first' ).html("Application Initialzation Completed !!");
	setTimeout("$( '#plLoader' ).dialog('close');", 1000);
}