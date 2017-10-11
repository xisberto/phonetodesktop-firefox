/*global getAccessToken*/

function notifyUser(user) {
  console.log(user)
  browser.notifications.create({
    "type": "basic",
    "title": "Google info",
    "message": `Hi ${user.name}`
  });
}

function getListID(lists) {
  // console.log(lists)
  var list_items = lists.items
  // console.log(list_items)
  for (var i in list_items) {
    if (list_items[i].title == "PhoneToDesktop") {
      // console.log(list_items[i].id)
      // console.log(list_items[i].title)
      // console.log(list_items[i].selfLink)
      return list_items[i].id
    }
  }
}

function saveListID(list_id) {
  console.log("Saving List ID: " + list_id)
  localStorage.setItem('list_id', list_id)
}

function logError(error) {
  console.error(error);
}

/**
When the button's clicked:
- get an access token using the identity API
- use it to get the user's info
- show a notification containing some of it
*/
// browser.browserAction.onClicked.addListener(() => {
//   getAccessToken()
//     .then(getTaskLists)
//     .then(getListID)
//     .then(saveListID)
//     .catch(logError);
//     // .then(getUserInfo)
//     // .then(notifyUser)
//   });

