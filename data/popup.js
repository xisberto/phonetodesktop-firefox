function reset_configuration() {
    self.port.emit("logout");
}

function delete_item(event){
    var parent = $(this).parent().parent();
    var task_id = parent.attr("id");
    
    parent.removeClass('min_height');
    parent.slideUp(300, function(){
        self.port.emit("delete", task_id);
    });
}

self.port.on("alert-auth", function() {
    $("#actionbar_tab a[href='#tab_alert']").tab('show');
});

self.port.on("load-list", function(tasks) {
    $("#task_list").empty();
	var autolinker = new Autolinker();
    for (index in tasks) {
        if (tasks[index].title=="") {
            continue;
        }
        var item = $("<div class='linear_layout min_height'>");
        item.attr("id", tasks[index].id);
        
        var div_btns = $("<div class='btns'>");
        div_btns.appendTo(item);
        
        var div_text = $("<div class='task_text'>");
		var task_title = autolinker.link(tasks[index].title);
        div_text.html(task_title).appendTo(item);
        
        var btn_del = $("<a class='btn btn-default'>");
        btn_del.append("<img src='images/delete.png' />");
        btn_del.click(delete_item);
        btn_del.appendTo(div_btns);
        
        item.appendTo($("#task_list"));
    }
    $("#actionbar_tab a[href='#tab_list']").tab('show');
});

function prepareHTMLTexts(){
	var autolinker = new Autolinker();
    $("#about_message #1").html(autolinker.link($("#about_message #1").html()));
    $("#about_message #2").html(autolinker.link($("#about_message #2").html()));
    $("#needAuthorizeApp").html(autolinker.link($("#needAuthorizeApp").html()));
    $("#needResetConf").html(autolinker.link($("#needResetConf").html()));
}

$(document).ready(function(){
    $("#actionbar_tab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $("#btn_refresh").click(function(e){
        $("#actionbar_tab a[href='#tab_wait']").tab('show');
        self.port.emit("get-tasks");
    });
    $("#btn_reset1").click(function(e){
        self.port.emit("logout");
    });
    $("#btn_reset2").click(function(e){
        self.port.emit("logout");
    });
    prepareHTMLTexts();
});