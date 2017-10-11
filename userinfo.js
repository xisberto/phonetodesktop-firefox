/**
Fetch the user's info, passing in the access token in the Authorization
HTTP request header.
*/

/* exported getUserInfo */

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

function deleteTask(accessToken, list_id) {
  console.log("fetchTasks Called")
  const requestURL = "https://www.googleapis.com/tasks/v1/lists/"+list_id+"/tasks?alt=json";
  console.log("requestURL: " + requestURL)
  const requestHeaders = new Headers();
  page.
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
