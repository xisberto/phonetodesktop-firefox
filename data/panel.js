var btnStartAuth = document.getElementById("start_auth");
btnStartAuth.addEventListener("click", function(event) {
    self.port.emit("authorize");    
});
var btnLogOut = document.getElementById("logout");
btnLogOut.addEventListener("click", function(event) {
    self.port.emit("logout");
});


