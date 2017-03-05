"use strict"
var notifi = {
    callbackOpts: function (notifications) {
        console.log(notifications);
    },

    callbackSingleOpts: function (notification) {
        console.log(notification);
    },

    get: function () {
        cordova.plugins.notification.local.get(1, callbackSingleOpts);
    },

    getMultiple: function () {
        cordova.plugins.notification.local.get([1, 2], callbackOpts);
    },

    getAll: function () {
        cordova.plugins.notification.local.getAll(callbackOpts);
    },

    getScheduled: function () {
        cordova.plugins.notification.local.getScheduled(callbackOpts);
    },

    getTriggered: function () {
        cordova.plugins.notification.local.getTriggered(callbackOpts);
    }

};

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
        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);
        //cordova.plugins.notification.local
        app.localNote = cordova.plugins.notification.local;

        app.localNote.on("click", function (notification) {
            console.log(notification.text);
        });

        app.localNote.on('trigger', function (notification) {
            alert('ontrigger: ' + notification.title);
            //            console.log('notification ID :' + notification.id);
            //            app.localNote.clear(notification.id, function() {
            //                console.log('clear', notification.id);
            //            });
            //            let contentDiv = document.querySelector(".content");
            //            let id = contentDiv.id;
            //
            //            if (id == "list") {
            //                app.showList();
            //            }

        });
        app.localNote.on('schedule', function (notification) {
            console.log('onschedule', arguments, notification.id);
        });


        //show the list when loading
        console.log("Here is onDeviceReady");
        //app.showList();
    },
    pageChanged: function (ev) {
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        let contentDiv = ev.currentTarget.document.querySelector(".content");
        let id = contentDiv.id;

        console.debug("ID value: " + id);

        switch (id) {
        case "list":
            console.log("Here is pageChanged");
            app.showList();
            break;
        case "add":
            app.saveNew(ev);
            break;
            // default:
            //     createHtmlforProfile();
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
        let a = Date();
        //let rs = moment(a).add(1, 'hour');
        let t = moment().format('MMMM Do YYYY, H:mm a');
        time.value = t; //moment().format('MMMM Do YYYY, h:mm:ss a');  

    },
    /*//////////////////////////////////////////////////////////////////////
    //
    // Delete item clicked on lits
    //
    */ //////////////////////////////////////////////////////////////////////
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
        var now = new Date().getTime(),
            //_5_sec_from_now = moment().add(1, 'hour').format('MMMM Do YYYY, H:mm a'); //new Date(now + 20 * 1000);
            // Temporarily 
            _5_sec_from_now = new Date(now + 20 * 1000);

        if (time == "" || title == "" || text == "") {
            navigator.notification.alert("Please enter all details");
            return;
        }

        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
        let timestamp = Date.now();
        console.log("timestamp:" + " " + timestamp);

        app.localNote.hasPermission(function (granted) {
            if (granted == true) {
                // schedule(id, title, message, schedule_time);
                app.localNote.schedule({
                    id: timestamp,
                    title: title,
                    text: text,
                    at: _5_sec_from_now,
                    sound: sound,
                    icon: "img/Animation.png",
                    smallIcon: 'res://cordova',
                    badge: 2
                });
            } else {
                app.localNote.registerPermission(function (granted) {
                    if (granted == true) {
                        //schedule(id, title, message, schedule_time);
                        app.localNote.schedule({
                            id: timestamp,
                            title: title,
                            text: text,
                            at: _5_sec_from_now,
                            sound: sound,
                            icon: "http://3.bp.blogspot.com/-Qdsy-GpempY/UU_BN9LTqSI/AAAAAAAAAMA/LkwLW2yNBJ4/s1600/supersu.png",
                            badge: 2
                        });
                    } else {
                        navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                    }
                });
            }
        });

        //ev.currentTarget.removeEventListener('click', createNewNotification);
        console.log("id: " + app.localNote.schedule.id);
    },
    /**
     * This is a description
     * @namespace index.js
     * @method callbackOpts
     * @param {Object} notifications - is about array on scheduled notification
     */
    callbackOpts: function (notifications) {

        let ul = document.querySelector('#list-notify');
        console.log(notifications + " " + notifications.length);

        ul.innerHTML = "";
        //let ul = document.createElement("ul");
        //ul.classList.add("table-vbiew");
        ul.style.listStyle = "none";

        //let listcontent = document.querySelector(".content");
        [].forEach.call(notifications, function (list) {
            let li = document.createElement("li");
            li.classList.add("table-view-cell", "media");

            let span = document.createElement("span");
            span.classList.add("media-object", "pull-left", "icon", "icon-trash");

            let img = document.createElement("img");
            img.classList.add("media-object", "pull-left");
            img.src = list.icon;
            img.style.width = "10%";
            img.style.height = "10%";

            let div = document.createElement("div");
            div.classList.add("media-body");
            div.textContent = list.title + " " + list.at;

            li.appendChild(span);
            li.appendChild(img);
            li.appendChild(div);

            ul.appendChild(li);
            span.addEventListener('click', function (e) {
                app.deleteList(e, list);
            });

        });
        //listcontent.appendChild(ul);

        //showToast(notifications.length === 0 ? '- none -' : notifications.join(' ,'));
    }
};

app.init();