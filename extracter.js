/**
* @file extracter.js
* @name extracter.js
* @author Talha Habib
* @module
* @function extracter
* @param {Object} responsed - Amazon request index of HTTP JSON body request
* @returns {Object} formatted object for amazon handling
* variable parser for amazon body request to use inside VDA functionality. it returns session slots, intents, intents type and timestamp
*/

var extracter = function(responsed) {
    var r = responsed.request != null ? responsed.request : [];
    var time = r.timestamp;
    var t = typeof r.length != "number" ?
        r.type != null ? r.type : [] :
        [];
    var i = typeof t == "string" ?
        r.intent != null ? r.intent : [] :
        [];
    var s = typeof i.length != "number" ? i.slots != null ? i.slots : [] : [];
    var slotVal = typeof s.length != "number" ? s.control != null ?
        s.control.value :
        s.search_param != null ?
        s.search_param.value :
        s.navigationslot != null ?
        s.navigationslot.value :
        s.transferval!=null ? s.transferval.value : [] :
        [];
    var iN = typeof s.length != "number" ? s.control != null ?
        s.control.name :
        s.search_param != null ?
        s.search_param.name :
        s.navigationslot != null ?
        s.navigationslot.name :
        s.transferval!=null ? s.transferval.name : [] :
        [];
    var session = responsed.session != null ?
        responsed.session :
        [];
    var attrs = [];
    if (typeof session == "object") {
        if (session.attributes != null) {
            attrs = Object.keys(session.attributes).length > 0 ?
                session.attributes :
                [];
        }
    }
    var extract = {
        "request": r,
        "type": t,
        "intent": i,
        "intentName": iN,
        "slots": s,
        "value": slotVal,
        "attr": attrs,
        "timestamp":time
    };
    return extract;
}

module.exports = extracter;