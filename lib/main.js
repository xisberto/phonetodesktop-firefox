var widgets = require("widget");
var self = require("self");
var ss = require("simple-storage");

var widget_onclick = function() {
	if (!ss.storage.list_id) {
		ss.storage.list_id = "";
	}
	console.log("read ss.storage.list_id = "+ss.storage.list_id);
	popup.port.emit('load-list-id', ss.storage.list_id);
	popup.port.emit('start_main');
}

var popup = require("panel").Panel({
    width: 352,
    height: 480,
    contentURL: self.data.url("popup.html")
});
popup.port.on('log', function(text){
	console.log(text);
});
popup.port.on('save-list-id', function(list_id){
	console.log("Saving list_id "+list_id);
	ss.storage.list_id = list_id;
	widget_onclick();
});

var widget = widgets.Widget({
    id: "phonetodesktop",
    label:"PhoneToDesktop",
    contentURL: self.data.url("images/icon16.png"),
    panel: popup,
    onClick: widget_onclick
});

/*
var background = require("page-worker").Page({
    contentURL: self.data.url("background.html"),
});

background.port.on('background', function(text){
	console.log(text);
});

background.port.on('gapi', function(object){
	self.gapi = object;
});
*/
