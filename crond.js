/**
* @file crond.js
* @name crond.js
* @author Talha Habib
* @module
* Interval-scheduled Cron for Feed
*/



var crond;
var fs          = require("fs");
var http        = require("https");
var db          = require("mongodb").MongoClient;
var dburl       = "mongodb://localhost:27017/"
var parseString = require("xml2js").parseString; 
var url         = require("url");
var util        = require('util');
var h2p         = require("html2plaintext");
var unidecode   = require("unidecode");

var certs            = {
    'cert': fs.readFileSync("cert.pem"),
    'key': fs.readFileSync('privkey.pem'),
    'ca': fs.readFileSync('fullchain.pem')
};


var log_file    = fs.createWriteStream(__dirname + '/frankly_db.log', {flags : 'w'});
var log_stdout  = process.stdout;
console.log     = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};




var some_feed = function(){
   
    var URL = "some_feed_link";
    http.get(URL, response => {
        response.setEncoding("utf8");
        console.log(`status to the ${URL} is ${response.statusCode}`);
        var data = "";
        response.on("data", function(body) {
            data += body;
        });
        response.on("end", function(body) {
            var allArr = [];
            
            data = unidecode(data);
            parseString(data, function(err, result) {

                var arts = result.rss.channel[0].item.length;

                var arts = result.rss.channel[0].item!=null ? result.rss.channel[0].item.length : [];
                if(arts<=0){
                  console.log("nothing found for feed");
                  return false;
                }
                
                for(var index=0;index<arts;index++){

                    //********************** get UID
                    var pUrl = result.rss.channel[0].item[index].guid[0];
                    // IF its WordPress
                    var uuid = pUrl.split(
                        "?p="
                    )[1];
                    // If its not Wordpress
                    if(typeof uuid=="undefined"){
                        var uuid = '';
                        var ar    = pUrl.split("/");
                        do{
                            uuid = ar.pop();
                        }while(uuid=='');
                    }
                    //********************** get Description
                    var desc = h2p(
                        result.rss.channel[0].item[index].description[0].toString()
                    );
                    //********************** get Title
                    var title = h2p(result.rss.channel[0].item[index].title.toString());
                    //********************** get date
                    var date = result.rss.channel[0].item[index].pubDate[0].toString();
                    //********************** Logging
                    console.log("\n ["+index+"/"+arts+"]:-------- TITLE: "+title+" ---------- \n");
                    console.log("\n ["+index+"/"+arts+"]:-------- UUID: " + uuid + " ------ \n");
                    //********************** DB UPSTER
                     var query = {
                                   "uid":uuid,
                                   "title":title,
                                   "description":desc,
                                   "dated":date
                               };
                       allArr[index] = query;        
               } 

               (async function() {
                  try {

                    const client = await db.connect(dburl,{ useNewUrlParser: true });
                    var dbo = client.db("Frankly");
                    console.log("adding "+allArr.length+" records to DB");
                    for(var queries = 0; queries<allArr.length;queries++){

                        // console.log("Adding record "+ (parseInt(queries) + 1) +" of "+allArr.length);  
                          dbo.collection("VDA").update(
                            allArr[queries],
                            allArr[queries],
                            {upsert: true}),function (err, result) {
                                if (err) throw err;
                                // console.log(result);
                            };  
                      }
                    client.close();
                    console.log("Added to DB @ "+ new Date().toDateString());
                  } catch(e) {
                    console.error(e)
                  }

                })();
            });
        });
    });
}


/**
* @file crond.js
* @function setInterval
* @param {closure}
* @returns {console} logs
* @name setInterval
* @description gets variable in scope
* crond.js is database cron job, which fetch feeds for several rss, parse and record it to database, the feeds are crawled in sequence using setInterval 
*/
// przen();
var options = [some_feed];
if(options.length>1){
var index = 0;
options[index](); // <-- init
index++;
setInterval(function(){
   if(index>=options.length){
      index = options.length -1;
    }
    options[index]();
    index++;
    if(index==options.length-1){
      index = 0;
    }
} ,((1000*60)*2.5));
}else{
  setInterval(function(){
    options[0]();
  },(1000*60)*2.5);
}
