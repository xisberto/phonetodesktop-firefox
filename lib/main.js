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

var credentials = self.data.load("credentials-dev.js");
var backgroundScript =  credentials +
                        "function OnLoadGoogleAPI() { " +
                        "   console.log('Google API loaded'); " +
                        "   gapi.client.load('tasks', 'v1', function() { console.log('Tasks loaded'); } );" +
                        "}" +
                        "console.log('background page loaded');" +
                        "OnLoadGoogleAPI();";

var background = require("panel").Panel({
    width: 100,
    height: 20,
    contentURL: self.data.url("background.html"),
    contentSriptFile: "https://apis.google.com/js/client.js?onload=OnLoadGoogleAPI",
    contentScript: backgroundScript
});

var widget = widgets.Widget({
    id: "phonetodesktop",
    label:"PhoneToDesktop",
    contentURL: self.data.url("images/icon16.png"),
    panel: popup
});
