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
      console.log(response)
      return response.json();
    } else {
      throw response.status;
    }
  });

}

function notifyUser(user) {
  console.log(user)
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
      console.log("Getting List ID Response: 200")
      console.log(response)
      return response.json();
    } else {
      throw response.status;
    }
  });
}

function fetchTasks(accessToken, list_id) {
    console.log("fetchTasks Called")
    const requestURL = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks?alt=json";
    console.log("requestURL: " + requestURL)
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
      method: "GET",
      headers: requestHeaders
    });
  
    return fetch(driveRequest).then((response) => {
      if (response.status === 200) {
        console.log("Got Tasks: 200")
        console.log(response)
        return response.json();
      } else {
        throw response.status;
      }
    });
}

function deleteTask(accessToken, list_id, task_id) {
  console.log("deleteTask Called")
  const requestURL = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks/"+task_id;
  console.log("requestURL: " + requestURL)
  const requestHeaders = new Headers();
  requestHeaders.append('Authorization', 'Bearer ' + accessToken);
  const driveRequest = new Request(requestURL, {
    method: "DELETE",
    headers: requestHeaders
  });
  return fetch(driveRequest)
}

function getListIDFromLists(lists) {
  console.log("getListIDFromLists Called")
  // console.log(lists)
  var list_items = lists.items
  // console.log(list_items)
  for (var i in list_items) {
    if (list_items[i].title == "PhoneToDesktop") {
      // console.log(list_items[i].id)
      // console.log(list_items[i].title)
      // console.log(list_items[i].selfLink)
      list_id = list_items[i].id
      // save list_id and then return it
      saveListID(list_id)
      return list_id
    }
  }
}

function saveListID(list_id) {
  console.log("saveListID Called")
  console.log("Saving List ID: " + list_id)
  localStorage.setItem('list_id', list_id)
}

function getListID() {
  return localStorage.getItem('list_id');
}

function logError(error) {
  console.error(error);
}

