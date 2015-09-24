var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var oauth = require('addon-google-oauth2');

console.log("init");

var button = ToggleButton({
    id: "ptd-button",
    label: "Phone to Desktop",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: showPanel
});

var panel = panels.Panel({
    contentURL: "./panel.html",
    contentScriptFile: "./panel.js",
    onHide: onPanelHide
});


function showPanel(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
        console.log("Teste");
    }
}

function onPanelHide() {
    button.state('window', {checked: false});
}

function checkAuth() {
    console.log("checking auth")
    var oauth2_options = {
        client_id: "908808215735.apps.googleusercontent.com",
        client_secret: "4rs0dvjj6PxW6F6C1dlvXP3y",
        scopes: "https://www.googleapis.com/auth/tasks"
    }
    oauth.refreshToken(oauth2_options, callback);
}

function callback(token) {
    console.log("callback called with token: " + token);
    ss.storage.token = token;
}

panel.port.on("check-auth", function (){
    panel.hide();
    checkAuth();
});
