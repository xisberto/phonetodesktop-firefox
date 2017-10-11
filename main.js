/*global getAccessToken*/

function notifyUser(user) {
  console.log(user)
  browser.notifications.create({
    "type": "basic",
    "title": "Google info",
    "message": `Hi ${user.name}`
  });
}

async function getListIDFromLists(lists) {
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

