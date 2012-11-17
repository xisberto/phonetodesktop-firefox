/*
var addon = new Object();
addon.port = new Object();
addon.port.emit = function(tag, what){ console.log(what); };
addon.port.on = function(tag, callback){ callback(); };
//*/

var list_id = "";
addon.port.on('load-list-id', function(new_id){
	list_id = new_id;
});

function handleAuthResult(authResult) {
	addon.port.emit('log', 'Starting handleAuthResult');
	addon.port.emit('log', "authResult: "+JSON.stringify(authResult));
	var btn_auth = $("#btn_auth");
	if (authResult && !authResult.error) {
		btn_auth.style.visibility = 'hidden';
		gapi.client.load('tasks', 'v1', function() { 
			addon.port.emit('log', 'Tasks loaded');
			loadTasks();
		});
		addon.port.emit('log', 'Google API loaded');
	} else {
		btn_auth.style.visibility = '';
    	$("#actionbar_tab a[href='#tab_authorize']").tab('show');
		btn_auth.conclick = handleAuthClick;
	}
}

function OnLoadGoogleAPI() {
	addon.port.emit('log', 'Google API loading');
	gapi.client.setApiKey(apiKey);
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthClick(event) {
	addon.port.emit('log', 'Starting handleAuthClick');
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

function saveListId() {
    addon.port.emit('log',"Start saveListId");
    var url = "https://www.googleapis.com/tasks/v1/users/@me/lists";
    var request = gapi.client.tasks.tasklists.list();
    var callback = function(resp) {
    	addon.port.emit('log', "resposta: "+JSON.stringify(resp));
        var lists = resp.items;
        for (i in lists) {
            addon.port.emit('log',"Lista: "+lists[i].title);
            if (lists[i].title == "PhoneToDesktop") {
                addon.port.emit('save-list-id', lists[i].id);
            }
        }
        //if (localStorage.getItem('list_id') == null) {
        //    alertNoList();
        //}
    };
    request.execute(callback);
}

function handle_list_id_updated(e) {
    if (e.key == 'list_id') {
        loadTasks();
    }
}

function loadTasks() {
    addon.port.emit('log',"Start loadTasks");
    addon.port.emit('log',"list_id: "+list_id);
    if (list_id == ""){
        saveListId();
        return;
    } else {
        window.removeEventListener("storage", handle_list_id_updated, false);
        var url = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks";
        var request = {
            'method': 'GET'
        };
        var callback = function(resp, xhr) {
            resp = JSON.parse(resp);
            listTasks(resp.items);
        }
        oauth.sendSignedRequest(url, callback, request);
    }
}

function delete_item(event){
    var parent = $(this).parent();
    var list_id = localStorage.getItem('list_id');
    var task_id = parent.attr("id");
    var url = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks/"+task_id;
    var request = {
        'method': 'DELETE'
    };
    var callback = function(resp, xhr){
        if (resp) {
            parent.slideDown(300, function(){
                parent.addClass('min_height');
            });
        } else {
            parent.remove();
        }
    };
    parent.removeClass('min_height');
    parent.slideUp(300, function(){
        oauth.sendSignedRequest(url, callback, request);
    });
}

function alertNoList() {
    $("#task_list").empty();
    var linear_layout = $("<div class='linear_layout min_height'>");
    linear_layout.append($("<div>"));
    linear_layout.children("div").attr("data-l10n-id", "needAuthorizeApp");
    linear_layout.children("div").linkify(function(links){
        links.attr("target", "_blank");
    });
    linear_layout.appendTo($("#task_list"));
    $("#actionbar_tab a[href='#tab_list']").tab('show');
}

function listTasks(tasks) {
    $("#task_list").empty();
    for (j in tasks) {
        if (tasks[j].title=="") {
            continue;
        }
        var item = $("<div class='linear_layout min_height'>");
        item.attr("id", tasks[j].id);
        
        var div_btns = $("<div class='btns'>");
        div_btns.appendTo(item);
        
        var div_text = $("<div class='task_text'>")
        div_text.text(tasks[j].title).appendTo(item);
        if (tasks[j].status == "completed") {
            div_text.addClass("done");
        }
        
        var btn_done = $("<a class='btn'>");
        btn_done.append("<i class='icon-ok'></i>");
        btn_done.appendTo(div_btns);
        
        var btn_del = $("<a class='btn'>");
        btn_del.append("<i class='icon-trash'></i>");
        btn_del.click(delete_item);
        btn_del.appendTo(div_btns);
        
        item.appendTo($("#task_list"));
        $("#task_list").linkify(function(links){
            links.attr("target", "_blank");
        });
    }
    $("#actionbar_tab a[href='#tab_list']").tab('show');
}

function main(){
    //$("#actionbar_tab a[href='#tab_wait']").tab('show');
    $("#actionbar_tab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $("#btn_refresh").click(function(e){
        $("#actionbar_tab a[href='#tab_wait']").tab('show');
        window.setTimeout(function(){
            loadTasks();
        }, 300);
    });
    $("#about_message").linkify(function(links){
        links.attr("target", "_blank");
    });
    $("#btn_auth").click(handleAuthClick);
    
	OnLoadGoogleAPI();
    //loadTasks();
};
addon.port.on('start_main', function(){
	main();
});
