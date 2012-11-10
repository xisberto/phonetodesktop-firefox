var widgets = require("widget");
var self = require("self");
var popup = require("panel").Panel({
  width: 352,
  height: 480,
  contentURL: self.data.url("popup.html"),
  contentScriptFile: [
    self.data.url("bootstrap/js/jquery.js"),
    self.data.url("bootstrap/js/bootstrap.js"),
    self.data.url("bootstrap/js/jquery.linkify-1.0.js"),
    self.data.url("popup.js")
  ]
});

var widget = widgets.Widget({
  id: "phonetodesktop",
  label:"PhoneToDesktop",
  contentURL: self.data.url("images/icon16.png"),
  panel: popup
});
