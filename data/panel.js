var btnStartAuth = document.getElementById("start_auth");
btnStartAuth.addEventListener("click", checkAuth);

function checkAuth(data) {
    console.log("loading...");
    self.port.emit("check-auth");
}

