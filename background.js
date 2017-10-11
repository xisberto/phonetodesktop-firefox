function contextMenuClick(onClickData, tab) {
    var task_title;
    // if a menuItem is clicked
    if (onClickData.menuItemId) {
        // build task_title
        switch (onClickData.menuItemId) {
            case "link":
                task_title = onClickData.linkUrl + " [" + onClickData.linkText + "]"
                break;
            case "selection":
                task_title = onClickData.pageUrl + " [" + onClickData.selectionText + "]"
                break;
            case "page":
                task_title = onClickData.pageUrl + " [Page from Firefox]"
                break;
            default:
                break;
        }
        var list_id = localStorage.getItem("list_id");
        getAccessToken().then((accessToken) => {
            browser.browserAction.setBadgeText({ "text": "..." });
            browser.browserAction.setBadgeBackgroundColor({ color: "#ffa000" });
            browser.browserAction.setBadgeBackgroundColor
            addTask(accessToken, list_id, task_title).then((response) => {
                if (response.status == 200) {
                    browser.browserAction.setBadgeText({ "text": "" });
                    browser.browserAction.setBadgeBackgroundColor({ color: "" });
                } else {
                    browser.browserAction.setBadgeText({ "text": "!!!" });
                    browser.browserAction.setBadgeBackgroundColor({ color: "#f44336" });
                }
            })
        })
    }
}

browser.contextMenus.onClicked.addListener(contextMenuClick);

function configureContextMenus() {
    browser.contextMenus.create({
        title: browser.i18n.getMessage("send_link_to_mobile"),
        contexts: ["link"],
        id: "link"
    });
    browser.contextMenus.create({
        title: browser.i18n.getMessage("send_selection_to_mobile"),
        contexts: ["selection"],
        id: "selection"
    });
    browser.contextMenus.create({
        title: browser.i18n.getMessage("send_page_to_mobile"),
        contexts: ["page"],
        id: "page"
    });
}

browser.runtime.onInstalled.addListener(function () {
    configureContextMenus();
});

browser.runtime.onStartup.addListener(function () {
    configureContextMenus();
});