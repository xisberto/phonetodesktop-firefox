function reset_configuration() {
    localStorage.removeItem('list_id');
    browser.runtime.getBackgroundPage((page) => {
        page.getAccessToken()
            .then(page.getTaskLists)
            .then(page.getListIDFromLists)
            .then(loadTasks)
    });
}

function handle_list_id_updated(e) {
    if (e.key == 'list_id') {
        loadTasks();
    }
}

function loadTasks() {
    $("#actionbar_tab a[href='#tab_wait']").tab('show');
    browser.runtime.getBackgroundPage((page) => {
        var list_id = page.getListID();
        if (list_id == null) {
            alertNoList()
            return
        }
        page.getAccessToken()
            .then((token) => {
                page.fetchTasks(token, list_id)
                    .then((response) => {
                        listTasks(response.items);
                    })
            })
    }
    );

}

function delete_item(event) {
    browser.runtime.getBackgroundPage((page) => {
        page.getAccessToken().then((accessToken) => {
            var parent = $(this).parent().parent();
            var list_id = page.getListID();
            var task_id = parent.attr("id");
            parent.slideUp(300, function () {
                page.deleteTask(accessToken, list_id, task_id)
                    .then((response) => {
                        if (response.status != 204) {
                            parent.slideDown(300, function () {
                                parent.addClass('min_height');
                            });
                        } else {
                            parent.remove();
                        }
                    });
                parent.removeClass('min_height');
            });
        });
    });
}

function alertNoList() {
    // called when we don't have list_id in Store.
    // so we have not authorized and not fetched and stored list_id in localStore
    // $("#tab_wait").empty();
    $("#task_list").empty();
    linear_layout = $("<div class='linear_layout min_height'>");
    message_authorize = $("<p>");
    message_authorize.text(browser.i18n.getMessage("needAuthorizeApp"));
    // message_authorize.linkify({
    //     target: "_blank"
    // });
    message_reset = $("<p>");
    message_reset.text(browser.i18n.getMessage("needResetConf"));
    button_reset = $("<a class='btn btn-info '>");
    button_reset.text(browser.i18n.getMessage("reset_configuration"));
    button_reset.click(reset_configuration);
    message_reset.append(button_reset);

    linear_layout.append(message_authorize);
    linear_layout.append(message_reset);
    linear_layout.appendTo($("#task_list"));
    $("#actionbar_tab a[href='#tab_list']").tab('show');
}

function listTasks(tasks) {
    $("#task_list").empty();
    var autolinker = new Autolinker();
    for (j in tasks) {
        if (tasks[j].title == "") {
            continue;
        }
        var item = $("<div class='linear_layout min_height'>");
        item.attr("id", tasks[j].id);

        var div_btns = $("<div class='btns'>");
        div_btns.appendTo(item);

        var div_text = $("<div class='task_text'>");
        var task_title = autolinker.link(tasks[j].title);
        div_text.html(task_title).appendTo(item);

        var btn_del = $("<a class='btn btn-default'>");
        btn_del.append("<img src='images/delete.png' />");
        btn_del.click(delete_item);
        btn_del.appendTo(div_btns);

        item.appendTo($("#task_list"));
    }
    $("#actionbar_tab a[href='#tab_list']").tab('show');
}

function prepareHTMLTexts() {
    $("a[href='#tab_list']").text(browser.i18n.getMessage("tab_list"));
    $("a[href='#tab_about']").text(browser.i18n.getMessage("tab_about"));
    $("#btn_reset").text(browser.i18n.getMessage("reset_configuration"));
    var autolinker = new Autolinker();
    var message1_text = autolinker.link(browser.i18n.getMessage("about_message1"));
    var message2_text = autolinker.link(browser.i18n.getMessage("about_message2"));
    $("<p>")
        .html(message1_text)
        .appendTo($("#about_message"));
    $("<p>")
        .html(message2_text)
        .appendTo($("#about_message"));
}

$(document).ready(function () {
    $("#actionbar_tab a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#btn_refresh").click(function (e) {
        loadTasks();
    });
    $("#btn_reset").click(function (e) {
        reset_configuration();
    });
    prepareHTMLTexts();
    loadTasks();
});
