function getUserInfo(accessToken) {
    const requestURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
        method: "GET",
        headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });

}

function notifyUser(user) {
    browser.notifications.create({
        "type": "basic",
        "title": "Google info",
        "message": `Hi ${user.name}`
    });
}

function getTaskLists(accessToken) {
    const requestURL = "https://www.googleapis.com/tasks/v1/users/@me/lists?alt=json";
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
        method: "GET",
        headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });
}

function fetchTasks(accessToken, list_id) {
    const requestURL = "https://www.googleapis.com/tasks/v1/lists/" + list_id + "/tasks?alt=json";
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
        method: "GET",
        headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });
}

function deleteTask(accessToken, list_id, task_id) {
    const requestURL = "https://www.googleapis.com/tasks/v1/lists/" + list_id + "/tasks/" + task_id;
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
        method: "DELETE",
        headers: requestHeaders
    });
    return fetch(driveRequest)
}

function addTask(accessToken, list_id, task_title) {
    const requestURL = "https://www.googleapis.com/tasks/v1/lists/" + list_id + "/tasks";
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    requestHeaders.append('Content-Type', 'application/json')
    var payload = { 'title': task_title }
    const driveRequest = new Request(requestURL, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(payload)
    });
    return fetch(driveRequest)
}

function getListIDFromLists(lists) {
    var list_items = lists.items
    for (var i in list_items) {
        if (list_items[i].title == "PhoneToDesktop") {
            list_id = list_items[i].id
            // save list_id and then return it
            saveListID(list_id)
            return list_id
        }
    }
}

function saveListID(list_id) {
    localStorage.setItem('list_id', list_id)
}

function getListID() {
    return localStorage.getItem('list_id');
}

function logError(error) {
    console.error(error);
}

