

// https://parseplatform.org/

// clone this example https://github.com/parse-community/parse-server-example

// Parse server init, appId and masterKey
Parse.initialize("vis_exercise_app", "vis_exercise_app");

// Parse server url
Parse.serverURL = 'https://EvaVis.s15.hkustvis.org/parse'

export var collection = {
    pool: [],
    poolsize: 199,
    static: {},
    init: function() {
        collection.getBrowser();
        collection.getOS();
    },
    accumulation(localevent) {
        let track = collection.defAttributes(localevent)
        for (let key in localevent) {
            if (typeof(localevent[key]) != "object") {
                track[key] = localevent[key];
            }
        }
        collection.pool.push(new Parse.Object("mousetrack", track))
        if (collection.pool.length >= collection.poolsize) {
            collection.submitData();
            collection.pool = []
        }
    },
    submitData() {
        Parse.Object.saveAll(collection.pool)
            .then(function() {
                console.log("Success");
            })
            .catch(function(e) {
                alert("Error saving test object!" + e.message);
            });
    },
    defAttributes(localevent) {
        let track = {}
        track['d_path'] = collection.getElementPathByEvent(localevent);
        // add user id information if necessary
        track['d_userid'] = window.localStorage["test_id"] || "-1";
        track['d_group'] = window.localStorage["test_group"] || "-1";
        track['d_osVersion'] = collection.static.OS;  
        track['d_browser'] = collection.static.Browser || "unknown";
        track['d_timestamp'] = (new Date()).getTime();
        track["d_url"] = window.location.href;
        track["d_clientWidth"] = localevent.srcElement.clientWidth;
        track["d_clientHeight"] = localevent.srcElement.clientHeight;
        return track;
    },
    getElementPathByEvent: function(event) {
        let target = event.target;
        if(!target || target.classList==undefined){
            return ""
        }
        let pathstr = "," + (target.tagName || "") + "#" + (target.id||"") + "." + target.classList.value.replace(/ /g, ".");
        for (; target.parentElement != null;) {
            target = target.parentElement;
            pathstr = "," + target.tagName + "#" + target.id + "." + target.classList.value.replace(/ /g, ".") + pathstr;
        }
        return pathstr.slice(1);
    },
    getTouchable: function() {
        collection.static.hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
    },
    getOS: function() {
        collection.static.OS = navigator.appVersion.match(/\(.+?\)/)[0].replace(/[\(\)]/g, "");
    },
    getBrowser: function() {
        /* Browser name */
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        collection.static.Browser = M.join(' ');
    }
}
collection.init()

export var mousetrack = {
    config: {
        ele: null,
        mouseEvents: ["mousemove", "mousedown", "mouseleave", "mouseenter", "mouseup", "mouseover", "mouseout", "mousewheel", "select", "wheel", "contextmenu"],
        windowEvent: ["blur", "focus"],
        documentEvent: ["keypress", "paste", "copy", "cut"],
    },
    init() {
        mousetrack.config.ele = document.getElementsByTagName("html")[0]
        mousetrack.setWindowEvent()
        mousetrack.setDocumentEvent()
        mousetrack.setMouseEvent()
    },
    throttle(callback, limit) {
        var tick = false;
        return function () {
            if (!tick) {
                callback.call();
                tick = true;
                setTimeout(function () {
                    tick = false;
                }, limit);
            }
        }
    },
    setWindowEvent() {
        mousetrack.config.windowEvent.forEach(element => {
            window.addEventListener(element, function (e) {
                collection.accumulation(e)
            });
        });
        window.onbeforeunload = function(e){
            collection.accumulation(e)
            collection.submitData();
        }
    },
    setDocumentEvent() {
        mousetrack.config.documentEvent.forEach(element => {
            document.addEventListener(element, function (e) {
                collection.accumulation(e)
            });
        });
    },
    setMouseEvent(localelement) {
        if (!localelement) {
            localelement = window;
        }
        mousetrack.config.mouseEvents.forEach(element => {
            if (typeof (element) == "string") {
                localelement.addEventListener(element, function (e) {
                    collection.accumulation(e)
                })
            } else {
                localelement.addEventListener(element, mousetrack.throttle(function (e) {
                    collection.accumulation(e)
                }, element[1]));
            }
        });
    }
}
mousetrack.init()

