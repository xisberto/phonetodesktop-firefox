var btnStartAuth = document.getElementById("start_auth");
btnStartAuth.addEventListener("click", function(event) {
    self.port.emit("check-auth");    
});
var btnLogOut = document.getElementById("logout");
btnLogOut.addEventListener("click", function(event) {
    self.port.emit("logout");
});


self.port.on("panel-opened", function(authenticated) {
    console.log("authenticated: " + authenticated);
    if (authenticated) {
        document.getElementById("div_app").style.display = 'block';
        document.getElementById("div_auth").style.display = 'none';
    } else {
        document.getElementById("div_app").style.display = 'none';
        document.getElementById("div_auth").style.display = 'block';
    }
})

self.port.on("load-list", function(tasks) {
    var list = document.getElementById('list_tasks');
    for (i in tasks) {
        var item = document.createElement('li');
        item.innerHTML = tasks[i].title;
        list.appendChild(item);
    }
});