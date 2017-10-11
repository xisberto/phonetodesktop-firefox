function authenticatedXhr(method, url, params, interactive, callback) {
    console.log("authenticatedXhr Called with URL:" + url)
    var access_token;

    var retry = true;

    getToken();
    function setToVar(accessToken) {
        console.log("Setting Access Token to Var: " + accessToken)
        access_token = accessToken;
    }

    function getToken() {
        getAccessToken().then(setToVar).catch(logError)
        requestStart();
    }

    function requestStart() {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.onload = requestComplete;
        if (params != null) {
            xhr.setRequestHeader("Content-Type", "application/json");
            console.log(xhr)
            xhr.send(params);
        } else {
            console.log(xhr)
            xhr.send();
        }
    }

    function requestComplete() {
        if (this.status == 401 && retry) {
            retry = false;
            console.log("Auth Error, Code: 401")
            getToken();
            // browser.identity.removeCachedAuthToken({ token: access_token }, 
            //                                       getToken);
        } else {
            callback(null, this.status, this.response);
        }
    }
}

function contextMenuClick(onClickData, tab) {
    console.log(onClickData);
    console.log(tab.url);
    if (onClickData.menuItemId == "link" || onClickData.menuItemId == "page") {
        var task_title;
        if (onClickData.linkUrl != undefined) {
            console.log("enviando link");
            task_title = onClickData.linkUrl;
        } else if (onClickData.selectionText != undefined) {
            console.log("enviando texto selecionado");
            task_title = onClickData.selectionText;
        } else if (onClickData.pageUrl != undefined) {
            console.log("enviando url");
            task_title = onClickData.pageUrl;
        }

        if (task_title == undefined) {
            return;
        }

        var list_id = localStorage.getItem("list_id");
        var url = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks";
        var params = '{'+
            '   "title": "'+task_title+'"'+
            '}';
        console.log(params);
        var callback = function(error, status, resp) {
            browser.browserAction.setBadgeText({"text": ""});
            if (status == 200) {
                console.log("OK");
                console.log(resp);
            } else {
                console.log("Error");
                console.log(resp);
            }
        }
        browser.browserAction.setBadgeText({"text": "…"});
        authenticatedXhr('POST', url, params, false, callback)
    }
    
}

browser.contextMenus.onClicked.addListener(contextMenuClick);

function configureContextMenus() {
    browser.contextMenus.create({
        title: browser.i18n.getMessage("send_to_mobile"),
        contexts: ["link", "selection"],
        id: "link"
    });
    browser.contextMenus.create({
        title: browser.i18n.getMessage("send_page_to_mobile"),
        contexts: ["page"],
        id: "page"
    });
}

browser.runtime.onInstalled.addListener(function() {
    console.log("Running on install");
    getAccessToken().then((token)=>{
        console.log("token obtained");
        console.log(token)
    }).catch(logError)
    // browser.identity.getAuthToken({ interactive: true }, function(token) {
    //     console.log("token obtained");
    // });
    configureContextMenus();
});

browser.runtime.onStartup.addListener(function() {
    console.log("Running on startup");
    
    browser.browserAction.setBadgeBackgroundColor({"color": "#669900"});
    
    configureContextMenus();
});