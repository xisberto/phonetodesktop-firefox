function reset_configuration() {
    localStorage.removeItem('list_id');
    console.log("reset_configuration");
    console.log("list_id: " + localStorage.getItem("list_id"));
    loadTasks();
}

function handle_list_id_updated(e) {
    if (e.key == 'list_id') {
        loadTasks();
    }
}

function loadTasks() {
    console.log("Load Tasks Called")
    $("#actionbar_tab a[href='#tab_wait']").tab('show');
    browser.runtime.getBackgroundPage((page)=>{
        page.getAccessToken()
            .then(page.getTasks)
            .then((response)=>{
                console.log(response)
                console.log(response.items)
                // resp = JSON.parse(response.items);
                listTasks(response.items);
            })
            .catch((error)=>{
                console.error(error)
                alertNoList();
            })
    });


}

function delete_item(event){
    var parent = $(this).parent().parent();
    var list_id = localStorage.getItem('list_id');
    var task_id = parent.attr("id");
    var url = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks/"+task_id;
    var callback = function(error, status, resp){
        if (status != 204) {
            parent.slideDown(300, function(){
                parent.addClass('min_height');
            });
        } else {
            parent.remove();
        }
    };
    parent.removeClass('min_height');
    parent.slideUp(300, function(){
        browser.runtime.getBackgroundPage(function(backgroundPage){
            backgroundPage.authenticatedXhr('DELETE', url, null, false, callback);
        });
    });
}

function alertNoList() {
    $("#task_list").empty();
    linear_layout = $("<div class='linear_layout min_height'>");
    message_authorize = $("<p>");
    message_authorize.text(browser.i18n.getMessage("needAuthorizeApp"));
    message_authorize.linkify({
        target: "_blank"
    });
    
    message_reset = $("<p>");
    message_reset.text(browser.i18n.getMessage("needResetConf"));
    button_reset = $("<a class='btn btn-default'>");
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
        if (tasks[j].title=="") {
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

function prepareHTMLTexts(){
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

$(document).ready(function(){
    console.log("Document is Ready")
    $("#actionbar_tab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $("#btn_refresh").click(function(e){
        loadTasks();
    });
    $("#btn_reset").click(function(e){
        reset_configuration();
    });
    prepareHTMLTexts();
    loadTasks();
});
