var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var request = require('sdk/request');
var oauth = require('addon-google-oauth2')

console.log("init");

//Preparing UI components

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
    height: 480,
    width: 320,
    contentURL: "./popup.html",
    contentScriptFile: "./panel.js",
    onHide: onPanelHide
});

function showPanel(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
        console.log("Panel opened");
        getTasks();
    }
}

function onPanelHide() {
    button.state('window', {checked: false});
}

function checkAuth() {
    console.log("checking auth");
    var oauth2_options = {
        client_id: "396885376537-avfrd05q028n6bo2fpi6p26sarqo4822.apps.googleusercontent.com",
        client_secret: "1WiaiN_m_D-PsaSf8Dyz8_Tu",
        scopes: "https://www.googleapis.com/auth/tasks"
    }
    oauth.refreshToken(oauth2_options, onAuthChecked);
}

function onAuthChecked(token) {
    console.log("onAuthChecked called with token: " + token);
    var list_id = ss.storage.list_id;
    if (list_id) {
        getTasks();
    } else {
        saveListId(token, onAuthChecked);
    }
}

function saveListId(access_token) {
    console.log("saveListId called with token: " + access_token);
    request.Request({
        url: "https://www.googleapis.com/tasks/v1/users/@me/lists",
        headers: {
            "Authorization": "Bearer " + access_token
        },
        onComplete: function(resp) {
            lists = resp.json.items;
            for (i in lists) {
                if (lists[i].title == "PhoneToDesktop") {
                    console.log("saving list id");
                    ss.storage.list_id = lists[i].id;
                    getTasks();
                    break;
                }
            }
        }
    }).get();
}

function getTasks() {
    var token = ss.storage.access_token;
    var list_id = ss.storage.list_id;
    if (token == undefined || list_id == undefined) {
        panel.port.emit("panel-opened", false);
    } else {
        panel.port.emit("panel-opened", true);
        request.Request({
            url: "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks",
            headers: {
                "Authorization": "Bearer " + token
            },
            onComplete: function(resp) {
                panel.port.emit("load-list", resp.json.items);
            }
        }).get();    
    }
}

panel.port.on("check-auth", function (){
    panel.hide();
    checkAuth();
});

panel.port.on("logout", function(){
    delete ss.storage.list_id;
    delete ss.storage.access_token;
    delete ss.storage.refresh_token;
    panel.port.emit("panel-opened", false);
});