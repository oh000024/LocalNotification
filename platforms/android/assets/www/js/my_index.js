"use strict"
if ('deviceready' in document) {
    console.log("Start DeviecReady");
    onDeviceReady();
} else {

    console.log("Stat DOMContent");
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

//var magicnum = 0;
//if (document.deviceready) {
//    document.addEventlistener('deviceready', onDeviceReady);
//        console.log("Called DEVICEDREADY");
//} 
//else {
//    document.addEventListener('DOMContentLoaded', onDeviceReady)
//    console.log("Called DOMLOADED");
//    window.document.dispatchEvent('DOMContentLoaded_event');
//}


function onDeviceReady() {
    console.log("Called onDeviceReady");
    window.addEventListener("push", function(ev) {
        let contentDiv = ev.currentTarget.document.querySelector(".content");
        let id = contentDiv.id;

        console.debug("ID value: " + id);
        switch (id) {
            case "list":
                showListsOfNotifications();
                break;
            case "add":
                newNotification();
                break;
            default:
                createHtmlforProfile();
        }
    });
}


var callbackOpts = function(notifications) {
    console.log(notifications + " " + notifications.length);

    let ul = document.createElement("ul");
    ul.classList.add("table-vbiew");
    ul.style.listStyle = "none";

    let listcontent = document.querySelector(".content");
    [].forEach.call(notifications, function(list) {
        let li = document.createElement("li");
        li.classList.add("table-view-cell", "media");

        let span = document.createElement("span");
        span.classList.add("media-object", "pull-left", "icon", "icon-trash");

        let div = document.createElement("div");
        div.classList.add("media-body");
        div.textContent = list.title + " " + list.at;

        li.appendChild(span);
        //li.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);
        span.addEventListener('click', function(e) {
            deleteList(e, list);
        });

    });
    listcontent.appendChild(ul);

    //showToast(notifications.length === 0 ? '- none -' : notifications.join(' ,'));
};
/******************************************************************
// Delete profile in profiles
// Remove the profiels from golbal array and save it to localStorage
*****************************************************************/
function deleteList(e, scheduledItem) {
    let span = e.currentTarget;
    let li = e.currentTarget.parentNode;
    let ul = e.currentTarget.parentNode.parentNode;
    cordova.plugins.notification.local.cancel(scheduledItem.id, function() {

    });
    span.removeEventListener('click', deleteList);
    ul.removeChild(li);
}

function showListsOfNotifications() {
    console.log("Here is First Page");
    cordova.plugins.notification.local.getAll(callbackOpts);
}

function newNotification(argument) {

    let btn = document.querySelector("button");
    btn.addEventListener('click',createNewNotification);
    console.log("Second Page");
    let time = document.getElementById("time");
    let a = Date();
    //let rs = moment(a).add(1, 'hour');
    let t = moment().format('MMMM Do YYYY, H:mm a');
    time.value = t; //moment().format('MMMM Do YYYY, h:mm:ss a');
}

function createNewNotification(ev) {

    let title = document.getElementById("title");
    let text = document.getElementById("text");
    let time = document.getElementById("time");
    var now = new Date().getTime(),
        //_5_sec_from_now = moment().add(1, 'hour').format('MMMM Do YYYY, H:mm a'); //new Date(now + 20 * 1000);
        // Temporarily 
        _5_sec_from_now = new Date(now + 20 * 1000);

    var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
    let timestamp = Date.now();
    console.log("timestamp:" + " " + timestamp);

    cordova.plugins.notification.local.hasPermission(function(granted) {
        if (granted == true) {
            // schedule(id, title, message, schedule_time);
            cordova.plugins.notification.local.schedule({
                id: timestamp,
                title: title.value,
                text: text.value,
                at: _5_sec_from_now,
                sound: sound,
                badge: 2
            });
        } else {
            cordova.plugins.notification.local.registerPermission(function(granted) {
                if (granted == true) {
                    //schedule(id, title, message, schedule_time);
                    cordova.plugins.notification.local.schedule({
                        id: timestamp,
                        title: title.value,
                        text: text.value,
                        at: _5_sec_from_now,
                        sound: sound,
                        badge: 2
                    });
                } else {
                    navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                }
            });
        }
    });

    //ev.currentTarget.removeEventListener('click', createNewNotification);
    console.log("id: " + cordova.plugins.notification.local.schedule.id);
}