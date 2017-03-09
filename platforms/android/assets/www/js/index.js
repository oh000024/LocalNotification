/*****************************************************************
File: index.js
Author: Jake Oh
Description:
Here is the sequence of logic for the app
- On readying the device, create listenter in onDeviceReady function
- pageChanged memeber function is for push event
- showlist function is for showing lists of notifications
- saveNew functions is for create new notification
- deletelist function is for deleteing one list among lists on screen
- createNewNotification function is involved when user click the button for creaeting a notification
- callbackOpts function is creating Html element for ul and li and so on
Version: 0.0.1
Updated: Mar 5, 2017
*****************************************************************/
"use strict"

var app = {
    localNote: null,
    init: function () {
        try {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } catch (e) {
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
            console.log('failed to find deviceready');
        }
    },
    onDeviceReady: function () {
        //assing cordova.plugins.notification.local to variable
        app.localNote = cordova.plugins.notification.local;

        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);

        app.localNote.on("click", function (notification) {
            console.log(notification.text);
            //alert('click: ' + notification.title);
            app.localNote.getAll(app.callbackOpts);
        });

        app.localNote.on('trigger', function (notification) {
            //alert('ontrigger: ' + notification.title);
        });

        //show the list when loading
        //console.log("Here is onDeviceReady");
        app.showList();
    },
    pageChanged: function (ev) {
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        let contentDiv = ev.currentTarget.document.querySelector(".content");
        let id = contentDiv.id;

        console.debug("ID value: " + id);

        switch (id) {
        case "list":
            //console.log("Here is pageChanged");
            app.showList();
            break;
        case "add":
            app.saveNew(ev);
            break;
        }
    },
    showList: function () {

        console.log("Here is First Page");
        app.localNote.getAll(app.callbackOpts);
    },
    saveNew: function (ev) {
        ev.preventDefault();
        //create a new notification with the details from the form
        let btn = document.querySelector("button");
        btn.addEventListener('click', app.createNewNotification);
        console.log("Second Page");
        let time = document.getElementById("time");
        let a = new Date();

        time.value = moment(a, 'YYYY-MM-DD');
        time.defaultValue = "2015-01-02T11:42:13.510";
        let t = moment().format().split('-');
        console.log(t[0] + t[1] + t[2]);
        document.getElementById("time").value = t[0] + "-" + t[1] + "-" + t[2];
    },
    /* To delete one among lists on the home page
     * @namespace index.js
     * @method deleteList
     * @param {} scheduledItem - just in case, add it, but useless
     */
    deleteList: function (e, scheduledItem) {
        let span = e.currentTarget;
        let li = e.currentTarget.parentNode;
        let ul = e.currentTarget.parentNode.parentNode;
        app.localNote.cancel(scheduledItem.id, function () {

        });
        span.removeEventListener('click', app.deleteList);
        ul.removeChild(li);
    },
    /**
     * Fired Event: get a data from html, checking permission, create Object for a notification and add the Obj
     * @namespace index.js
     * @method createNewNotification
     * @param {Object} notifications - is about array on scheduled notification
     */
    createNewNotification: function (ev) {

        let title = document.getElementById("title").value;
        let text = document.getElementById("msg").value;
        let time = document.getElementById("time").value;
        let now = new Date().getTime();

        if (time == "" || title == "" || text == "") {
            alert("Please enter all details");
            return;
        }

        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
        let timestamp = Date.now();
        console.log("timestamp:" + " " + timestamp);

        let iconSRadio = document.querySelector("input[name=icontype]:checked");
        let iconSValue = iconSRadio ? iconSRadio.value : "";

        if (iconSValue) {
            iconSValue = iconSValue + ".png";
        }

        let repeatSRadio = document.querySelector("input[name=repeat]:checked");
        let repeatSValue = repeatSRadio ? repeatSRadio.value : "";

        app.localNote.hasPermission(function (granted) {
            if (granted == true) {

                app.localNote.schedule({
                    id: timestamp,
                    title: title,
                    text: text,
                    at: time.value,
                    every: repeatSValue ? repeatSValue.toString() : 0,
                    sound: sound,
                    icon: iconSValue,

                });
            } else {
                app.localNote.registerPermission(function (granted) {
                    if (granted == true) {

                        app.localNote.schedule({
                            id: timestamp,
                            title: title,
                            text: text,
                            at: time.value,
                            every: repeatSValue ? repeatSValue.toString() : 0,
                            sound: sound,
                            icon: iconSValue,
                        });
                    }
                });
            }
        });

        console.log("id: " + app.localNote.schedule.id);

        let home = document.querySelectorAll(".tab-item");
        var event = new CustomEvent('click');
        home[0].dispatchEvent(event);
    },
    /**
     * This is a description
     * @namespace index.js
     * @method callbackOpts
     * @param {Object} notifications - is about array on scheduled notification
     */
    callbackOpts: function (notifications) {

        let ul = document.querySelector('#list-notify');
        //console.log(notifications + " " + notifications.length);

        ul.innerHTML = "";
        ul.style.listStyle = "none";

        //let listcontent = document.querySelector(".content");
        [].forEach.call(notifications, function (list) {
            console.trace(list);
            let li = document.createElement("li");
            li.classList.add("table-view-cell", "media");

            let span = document.createElement("span");
            span.classList.add("media-object", "pull-left", "icon", "icon-trash");

            let div = document.createElement("div");
            div.classList.add("media-body");
            //console.log(list.every);
            div.textContent = list.title + "  " + new Date(list.at * 1000);

            console.log(div.textContent);

            li.appendChild(span);
            li.appendChild(div);
            ul.appendChild(li);

            span.addEventListener('click', function (e) {
                app.deleteList(e, list);
            });
        });
    }
};

app.init();