/**
Display the redirect URL.
*/
document.querySelector("#redirect-url").textContent = browser.identity.getRedirectURL();
console.log("Redirect URL: "+ browser.identity.getRedirectURL())