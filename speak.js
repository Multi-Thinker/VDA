/**
* @file speak.js
* @name Alexa Responses
* @requires alexa-response
* @author Talha Habib
* @param {Object} Extract - Alexa Request body from alexa_handle.js
* @param {Object} Res - HTTP Resource object from alexa_handle.js
* @param {Object} Alexa - Alixa library from alexa_handle.js
* @memberof alexa_handle.js
* @module
* @desc External Alexa Speak JSON generator
*/


var fn = (extract, ress, Alexa) => {

    var r = extract.request;
    var i = extract.intent;
    var attrs = extract.attr;
    if (extract.intentName == "search_param") {
        var val = extract.value != null ? extract.value : ". .";
        if (val.split(" ").length <= 0) {
            var response = Alexa.Response
                .say("Please add more to your search, your searched should be more than 1 word")
                .shouldEndSession(false)
                .build();
            console.log(`inside ${r.type}`);
            ress.end(JSON.stringify(response));
            return false;
        }
    }
    if (r.type == "LaunchRequest") {
        var response = Alexa.Response
            .say(`Welcome to Corporate News wire, 
                                 You can search for press release like this for example: alexa, search for Computers`)
            .shouldEndSession(false)
            .build();
        console.log(`inside ${r.type}`);
        ress.end(JSON.stringify(response));
        return false;
    } else if (i.name == "AMAZON.StopIntent") {
        var response = Alexa.Response
            .say("Okay, You can start a new search by asking me like this... alexa, ask corporate newswire about corporation press releases")
            .shouldEndSession(true).attributes(attrs)
            .build();
        console.log(`inside ${i.name}`, i);
        ress.end(JSON.stringify(response));
        return false;
    } else if (i.name == "AMAZON.CancelIntent" || r.type == "SessionEndedRequest") {
        var response = Alexa.Response
            .say("Okay, You can ask me again to show you news feed like this... alexa, ask corporate newswire about corporation press releases")
            .shouldEndSession(true).attributes(attrs)
            .build();
        console.log(`inside ${r.type!=null ? r.type : i.name}`, i);
        ress.end(JSON.stringify(response));
        return false;
    }
    if (r.reason == "ERROR") {
        var response = Alexa.Response
            .say("Hmmm.. There seems to be some error, can you check?")
            .shouldEndSession(false).attributes(attrs)
            .build();
        console.log(`inside ${r.reason}`);
        ress.end(JSON.stringify(response));
        return false;
    }
}



module.exports = fn;