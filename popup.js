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

/**
 * Selects a material pane by adding the class "is-active" to it
*/
function selectPane(pane_id) {
  var layout = document.querySelector('.mdl-layout').MaterialLayout;
  var panes = document.querySelectorAll(".mdl-layout__tab-panel");
  var pane = document.querySelector("#" + pane_id);
  layout.resetPanelState_(panes);
  pane.classList.add("is-active");
  if (pane.onSelected) {
    pane.onSelected();
  }
}

/**
 * Adds a event listener to the click action in a link, to make it select the
 * corresponding pane by selectPane
*/
function setupDrawer(link) {
  link.addEventListener('click', function (e) {
    if (link.getAttribute('href').charAt(0) === '#') {
      e.preventDefault();
      var href = link.href.split("#")[1];
      selectPane(href);
      document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
  });
}

/**
 * Users setupDrawer to make the material drawer menu work
*/
function initDrawer() {
  var links = document.querySelectorAll(".mdl-navigation__link");
  for (var i = 0; i < links.length; i++) {
    setupDrawer(links[i]);
  }
}

function loadTasks() {
    selectPane("pane_wait");
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
    selectPane("pane_nolist");
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
    selectPane("pane_list");
}

function prepareHTMLTexts() {
    $("#nav_list").text(browser.i18n.getMessage("tab_list"));
    $("#nav_about").text(browser.i18n.getMessage("tab_about"));
    $("#btn_reset").text(browser.i18n.getMessage("reset_configuration"));
    var autolinker = new Autolinker();
    var message1_text = autolinker.link(browser.i18n.getMessage("about_message1"));
    var message2_text = autolinker.link(browser.i18n.getMessage("about_message2"));
    $("#about_message1").html(message1_text);
    $("#about_message2").html(message2_text);
    $("#need_authorize_message").html(autolinker.link(browser.i18n.getMessage("needAuthorizeApp")));
    $("#btn_reset_config").text(browser.i18n.getMessage("reset_configuration"));
}

$(document).ready(function () {
    initDrawer();
    selectPane("pane_wait");
    prepareHTMLTexts();

    $("#btn_refresh").click(function (e) {
        loadTasks();
    });
    $("#btn_reset").click(function (e) {
        reset_configuration();
    });
    loadTasks();
});
