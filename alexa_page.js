/**
* @file alexa_page.js
* @name alexa_page.js
* @requires raw-body
* @requires alexa_handle.js
* @requires mongodb
* @requires sendmail.js
* @requires unidecode
* @requires url
* @function module.exports
* @param {Object} http - https object from alexa_page from observer.js
* @param {Object} request  - raw http request from observer.js
* @param {Object} url - URL library object from observer.js
* @member alexa_handle.js
* @module
* Alexa Database
* @description Alexa page that process functionality from database
*/

var getRawBody  = require("raw-body");
var alexa       = require("./alexa_handle.js");
var db          = require("mongodb").MongoClient;
var dburl       = "mongodb://localhost:27017/"
var Alexa       = require("alexa-response");  
var sendmail    = require("sendmail")(); 
var unidecode   = require("unidecode");
var arts        = [];
var emaild      = '';
var confirmedd  = false;
var contacts    = false;
var lsearch     = '';
var uuid        = '';
var cons        = false;
var mongo   = (http, reqq,ress,url)=>{

      /**
        * @file alexa_page.js
       * @function alexa
       * @param {Object} http - HTTPS Object
       * @param {Object}  req.body - Request Body Index
       * @param {Object}  req - Request Body
       * @param {Object}  res - Response Body
       * @param {Object}  url - URL Object
       * @returns {Object}
       * @description alexa to handle and assign extracted Object
       */
      var extract   = alexa(http, reqq.body,reqq,ress,url);

      if(typeof extract.intentName!="string") return false;

       var oldIndex   = extract.attr.index!=null 
                        ? extract.attr.index
                          : 0 
            , totalArticle = extract.attr.total!=null
                            ? extract.attr.total
                              : 0
            , UID           = extract.attr.UID!=null
                              ? extract.attr.UID
                                : 0
            , last_searched = extract.attr.last_searched!=null
                              ? extract.attr.last_searched
                                : 0,
             attr           = extract.attr.art!=null 
                              ? extract.attr.art 
                                : [],
              cont          =  extract.attr.contact!=null
                                ? extract.attr.contact
                                  : false
              maild         = extract.attr.email!=null ? extract.attr.email : null,
              confirmd      = extract.attr.confirmed!=null ? extract.attr.confirmed : false;

             emaild  = maild;
             confirmedd= confirmd; 
             arts    = attr;                     
             cons    = cont;
             if(last_searched!='') last_searched = unidecode(last_searched);
             lsearch = last_searched;  
             uuid    = UID;
        

        if(extract.intentName=="search_param"){
          searchinDB(ress,extract,totalArticle,oldIndex);
        }else if(extract.intentName=="control"){

            if(  extract.value=="full"
              || extract.value=="full card"
              || extract.value=="full article"
              || extract.value=="full post"
              || extract.value=="full block"){
                // show full card
               specificDB(ress,last_searched, oldIndex, totalArticle,UID ,"full");
            }
            if(    extract.value=="next"
                || extract.value=="next card"
                || extract.value=="next article"
                || extract.value=="next post"
                || extract.value=="next block"
              ){
              // show next article
              showNext(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            if(    extract.value=="new"
                || extract.value=="new card"
                || extract.value=="new article"
                || extract.value=="new post"
                || extract.value=="new block"
              ){
              // show next article
             showNext(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            if(    extract.value=="more"
                || extract.value=="more card"
                || extract.value=="more article"
                || extract.value=="more post"
                || extract.value=="more block"
              ){
              // show next article
            showNext(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            if(    extract.value=="next full"
                || extract.value=="next full card"
                || extract.value=="next full article"
                || extract.value=="next full post"
                || extract.value=="next full block"
              ){
              // show next article
            showNext(ress,last_searched,totalArticle,oldIndex,'full',UID, false, false);
            }
            if(    extract.value=="more full"
                || extract.value=="more full card"
                || extract.value=="more full article"
                || extract.value=="more full post"
                || extract.value=="more full block"
              ){
              // show next article
            showNext(ress,last_searched,totalArticle,oldIndex,'full',UID, false, false);
            }
            if(    extract.value=="new full"
                || extract.value=="new full card"
                || extract.value=="new full article"
                || extract.value=="new full post"
                || extract.value=="new full block"
              ){
              // show next article
            showNext(ress,last_searched,totalArticle,oldIndex,'full',UID, false, false);
            }
            if(    extract.value=="back"
                || extract.value=="back card"
                || extract.value=="back article"
                || extract.value=="back post"
                || extract.value=="back block"
              ){
              // show previous article
            showPrev(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            if(    extract.value=="back full"
                || extract.value=="back full card"
                || extract.value=="back full article"
                || extract.value=="back full post"
                || extract.value=="back full block"
              ){
              // show previous article
            showPrev(ress,last_searched,totalArticle,oldIndex,'full',UID, false, false);
            }
            if(    extract.value=="previous"
                || extract.value=="previous card"
                || extract.value=="previous article"
                || extract.value=="previous post"
                || extract.value=="previous block"
              ){
              // show previous article
            // console.log(last_searched,totalArticle,oldIndex,UID);
            showPrev(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            
            if(    extract.value=="previous full"
                || extract.value=="previous full card"
                || extract.value=="previous full article"
                || extract.value=="previous full post"
                || extract.value=="previous full block"
              ){
              // show previous article
            showPrev(ress,last_searched,totalArticle,oldIndex,'full',UID, false, false);
            }
            if(  extract.value=="status"
              || extract.value=="new"
              || extract.value=="else"){
              // show status
              showStatus(ress,last_searched,totalArticle,oldIndex,'',UID, false, false);
            }
            if(extract.value=="contacts"
              || extract.value=="contact"){
              ///((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)|(((?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?))|(((?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])))/gmi
              specificDB(ress,last_searched, oldIndex, totalArticle,UID ,"contacts");
            }

        }else if(extract.intentName=="transferval"){
          var tsearch = extract.value;
          var art     = emaild!=null ? true : false;
          var asked   = confirmedd;
          console.log("preparing emailer");
          if(extract.value.toLowerCase()=="right"
            || extract.value.toLowerCase()=="ok"
            ||extract.value.toLowerCase()=="correct"){

              confirmedd = true;

              if(uuid>0){

                specificDB(ress,last_searched, oldIndex, totalArticle,uuid ,"email");

              }else{
                var message = 'Sorry, you need to search a press release first, say search for then your text to let me know what you want as email';
                ask(ress, message, last_searched,uuid,oldIndex, totalArticle,false,false);
              }
          }else{
            if(!asked){
              var mail = tsearch.match(/(\w{1,20}\s\w{1,20}\.\w{1,20})/);
              var mail = mail!=null ? mail[0].replace(" ","@") : "0";
              if(mail=="0"){
                var message = "The email '"+tsearch+"'' provided was wrong, please say email 'then your email here' e.g example@example.com";
                ask(ress, message, last_searched,uuid,oldIndex, totalArticle,false,false);
              }
              if(uuid>0){
                emaild  = mail;
                confirmedd = false;  
                var message = `Please make sure the ${mail} is correct email, please reply "email is correct" to send email, otherwise say email to your correct email@domain.com`;
              }else{
                var message = `Please search the press release first by saying search for 'your text here' and then to send that release on email say 'email this to then your email here'`;
              }
              ask(ress, message, last_searched,uuid,oldIndex, totalArticle,false,false);
            }
          }
        }else{
              var message = "Sorry, i couldn't find any similar news feed, you can search for news by saying... alexa, search for Computers";
              say(ress, message, last_searched,UID,oldIndex, totalArticle,false,false);
              return false;
        }
    }
    

module.exports = mongo;

/**
        * @file alexa_page.js
       * @function searchinDB
       * @param {Object} res - HTTP response
       * @param {String} extract - Search text
       * @param {number} totalArticle - Total Articles in array
       * @param {number} oldIndex - Current Article Index
       * @param {string} fn - functions
       * @returns {Object}
       * @description search text in database and extract article to sessoin
       */
function searchinDB(ress,extract,totalArticle,oldIndex=0,fn=''){
  (async function() {
                  try {
                        const client = await db.connect(dburl,{ useNewUrlParser: true });
                        var dbo = client.db("Frankly");
                        var result = dbo.collection("VDA").find({
                              $text: { 
                                $search: `/^${extract.value}$/igm`
                              }
                      }).sort({dated:-1})
                      .toArray(function(err,resst){
                        if(resst!=null && Object.keys(resst).length>0){ 
                          totalArticle = Object.keys(resst).length;
                          for(var i=0; i<totalArticle;i++){
                            arts[i] = resst[i].uid;
                          }
                          if(extract.value!=lsearch){
                            oldIndex = 0;
                          }
                          var reg = /((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)|(((?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?))|(((?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])))/gmi;
                          var con = resst[oldIndex].description.match(reg);
                          sort_unique(con);
                          cons = con!=null ? con : false; 

                          // var currentArticle = /^(\w)(.*)(\.)/.exec(resst[oldIndex].description);
                          // if(currentArticle==null || currentArticle==''){
                          //   currentArticle = "title: "+resst[oldIndex].title+"\n "+resst[oldIndex].description.substr(0,5500)+"... "+"\n\n\n You can listen to whole press releases by saying 'Show Full' or move to other press release by saying 'Show next or previous' or see how many press releases are there around this search result by saying 'show status' " //<<-- missed semi-colon 
                          // }
                          var currentArticle = resst[oldIndex].title+"\n"+resst[oldIndex].description.substr(0,500)+"...";
                          currentArticle = `${currentArticle} \n You can listen to whole press releases by saying 'Show Full' or move to other press release by saying 'Show next or previous' or see how many press releases are there around this search result by saying 'show status'`;
                          var response = say(ress,currentArticle,extract.value,resst[oldIndex].uid,oldIndex,totalArticle,true,false)
                }else{
                        uuid= 0, cons = 0, emaild = null, confirmedd = false;
                        // remove zero to val to get old 
                        say(ress,`Nothing Found for search ${extract.value}, You can try new search, for example by saying... alexa, ask corporate newswire about corporation press releases `,extract.value,0,0,0,false,false)
                        return false;
                }   
            ress.end(JSON.stringify(response));
          });
         client.close();
       } catch(e) {
            console.log("error occured in searching in database", e);
            var message = "There is a problem with search in database";
            say(ress, message, lsearch,uuid,0, 0,true,false);
        }
    })();
}
function sort_unique(arr) {
  // console.log("this",arr!=null);
  // if (arr.length === 0) return arr;
  // arr = arr.sort(function (a, b) { return a*1 - b*1; });
  // var ret = [arr[0]];
  // for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
  //   if (arr[i-1] !== arr[i]) {
  //     ret.push(arr[i]);
  //   }
  // }
  return arr;
}
/**
        * @file alexa_page.js
       * @function specificDB
       * @param {Object} res - HTTP response
       * @param {String} searched - Search text
       * @param {number} oldIndex - Current Article Index
       * @param {number} totalArticle - Total Articles in array
       * @param {number} id - article id from session
       * @param {string} fn - functions
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {string} message - for alexa to speak
       * @returns {Object}
       * @description avoid searching text in database, work on ids and controls

       */
function specificDB(ress,searched, oldIndex, totalArticle, id='',fn='',ifReturn=false,message=''){
  var msg = message;
  var ifR = ifReturn;
  var ifn = fn;
  var idn = id;
  var totalA = totalArticle;
  var oldI   = oldIndex;
  var ss = searched;
  var res = ress;
  var email = emaild;
  (async function() {
   var message = msg;
   var ifReturn = ifR;
   var fn = ifn;
   var id = idn;
   var totalArticle = totalA;
   var ress = res;
   var searched = ss;
   var oldIndex = oldI;
   var emaild = email;
                  try {
                        const client = await db.connect(dburl,{ useNewUrlParser: true });
                        var dbo = client.db("Frankly");
                        if(id<=0 && typeof id!="number"){
                          
                          say(ress,"Please search a press release first by saying like this... Alexa, Search for Computers",searched,id,oldIndex,totalArticle)
                          return false;
                        }
                        var result = dbo.collection("VDA").findOne(
                              { "uid":id },
                            function(err,resst){
                                if (err) throw err;
                                var tt = resst!=null ? 
                                                      Object.keys(resst).length>0 
                                                        ? resst.hasOwnProperty("description")==true 
                                                          ? true : null 
                                                        : null
                                                      : null;  
                                // console.log(tt,"<--- this");
                                if(tt!=true){
                                   var currentArticle = "Nothing Found";
                                }else{
                                  ///^(\w)(.*)(\.)/.exec(
                                   var currentArticle = fn=="" || fn=="email"
                                                  ? resst.title+" \n"+resst.description.substr(0,500)+"..."+"\n You can listen to whole press release by saying 'Show full' or move to other press release by saying 'Show next or previous' or see how many press releases are there by saying 'show status'"
                                                  : fn=="full"  
                                                    ? "\ntitle: "+resst.title+"\n"+
                                                    "\ndescription: "+resst.description+"\n You can navigate by saying show next for next press release for same search or show previous for previous release for same search, and you can say show status to see how many news release are around this search results"+
                                                    "\n published: "+resst.dated
                                                    : fn=="contacts" 
                                                      ? cons!=false ? cons.join("\n") : 'no contacts found for this press releases' 
                                                        : 'no information found for this press releases';
                                    if(fn=="email"){
                                      var msg = resst.title +"\n"+resst.description;
                                      require("./sendmail.js")(emaild, msg,(err,info)=>{
                                        console.log(err, info);
                                        if(err){
                                          var currentArticle = "Please double check the email address, the email for press release with the title: '"+resst.title+"'' was not sent to email: "+emaild;
                                        }else{
                                          var currentArticle = "the email for press release with the title: '"+resst.title+"'' is sent to email: "+emaild;
                                        }
                                        emaild = null;
                                        confirmedd = false;
                                        say(ress,currentArticle,searched,id,oldIndex,totalArticle)
                                      });
                                      return false;
                                    }
                                    if(fn!="contacts"){
                                        var reg = /((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)|(((?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?))|(((?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])))/gmi;
                                        var con = resst.description.match(reg);
                                        sort_unique(con);
                                        cons = con!=null ? con : false;                                
                                    }
                                }                        
                          if(!ifReturn){
                            say(ress,currentArticle,searched,id,oldIndex,totalArticle)
                          }else{
                           
                            say(ress, `${message} \n ${currentArticle}`, searched, id, oldIndex, totalArticle);
                          }
          });
         client.close();
       } catch(e) {
           console.log("error occured in searching in database", e);
            var message = "There is a problem with search in specific";
            say(ress, message, lsearch,uuid,0, 0,true,false);
        }
    })();
}

/**
        * @file alexa_page.js
       * @function showNext
       * @param {Object} res - HTTP response
       * @param {String} extract - Search text
       * @param {number} totalArticle - Total Articles in array
       * @param {number} oldIndex - Current Article Index
       * @param {string} fn - functions
       * @param {number} id - article id from session
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {Boolean} session - if Alexa should end session
       * @returns {Object}
       * @description show next article
       */
function showNext(ress,extract,totalArticle=0,oldIndex=0,fn='',id=0, ifReturn=false, session=false){
    totalArticle = parseInt(totalArticle);
    oldIndex     = oldIndex<totalArticle ? oldIndex + 1 : oldIndex>totalArticle ? totalArticle : oldIndex;
    var nextArt  = totalArticle - oldIndex;
    var ifLast   = totalArticle==oldIndex ? true : false;
    var pos      = "forward";
    if(oldIndex - 1==totalArticle){
      pos = "current";
    }
    var message  = `There are  ${nextArt - 1} press releases forward, displaying ${oldIndex + 1} of ${totalArticle}...  \n`;
    id           = arts[oldIndex];
      if(!ifLast){
        specificDB(ress,extract, oldIndex, totalArticle, id,'',true,message);
      }else{
        oldIndex--;
        say(ress,"There are no more press releases in forward queue regarding the search  "+extract+" \n You can say Show previous to listen to previous press release",extract,id,oldIndex,
          totalArticle,ifReturn,session);
      }
}
/**
        * @file alexa_page.js
       * @function ShowPrev
       * @param {Object} res - HTTP response
       * @param {String} extract - Search text
       * @param {number} totalArticle - Total Articles in array
       * @param {number} oldIndex - Current Article Index
       * @param {string} fn - functions
       * @param {number} id - article id from session
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {Boolean} session - if Alexa should end session
       * @returns {Object}
       * @description show previous article
       */
function showPrev(ress,extract,totalArticle=0,oldIndex=0,fn='',id=0, ifReturn=false, session=false){
  totalArticle = parseInt(totalArticle);
  oldIndex     = oldIndex>=0 
                      ? oldIndex-1<0
                        ? 0
                        : oldIndex-1
                      : oldIndex-1;
                        
  var ifLast   = oldIndex>=0 ? true : false;
  id           = arts[oldIndex];
  var pos = "previous";
  if(oldIndex==0){
    pos = "current";
  }
  if(ifLast){
    var message  = `There are ${oldIndex} press releases backward, displaying ${oldIndex + 1} of ${totalArticle} ... \n `;
    specificDB(ress,extract, oldIndex, totalArticle, id,'',true,message);
  }else{
    say(ress,"There are no more press releases in backward queue regarding the search "+extract+"\n You can say Show next to listen to next press release",extract,id,oldIndex,
      totalArticle,ifReturn,session);
  }
}

/**
        * @file alexa_page.js
       * @function showStatus
       * @param {Object} res - HTTP response
       * @param {String} extract - Search text
       * @param {number} totalArticle - Total Articles in array
       * @param {number} oldIndex - Current Article Index
       * @param {string} fn - functions
       * @param {number} id - article id from session
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {Boolean} session - if Alexa should end session
       * @returns {Object}
       * @description show status to see articles around
       */
function showStatus(ress,extract,totalArticle=0,oldIndex=0,fn='',id=0, ifReturn=false, session=false){
    totalArticle = parseInt(totalArticle);
    oldIndex     = parseInt(oldIndex);
    id           = parseInt(id);
    var backward = oldIndex; //oldIndex - 1<1 ? 0 : oldIndex - 1;
    var forward  = (totalArticle - oldIndex) - 1;
    var contacts = cons!=null 
                    ? cons 
                      : false;
    var ifDoes   = contacts!=false ? "does" : "doesn't";
    var line     = '';
    if(ifDoes=="does"){
       //line     = "say show contacts to get contacts information for keyword searched "+extract;
       line = '';
    }
    var message  = `There are ${backward} press releases backward and 
                     ${forward} forward this press release.
                     ${line}`;
    say(ress, message, extract,id,oldIndex, totalArticle,ifReturn,session);
}

/**
        * @file alexa_page.js
       * @function say
       * @param {Object} res - HTTP response
       * @param {String} str - string for Alexa to speak
       * @param {String} searched - Last search string
       * @param {number} id - Current Article Index
       * @param {number} oldIndex - old Article Index
       * @param {number} totalArticle - Total Articles in array
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {Boolean} session - if Alexa should end session
       * @param {Boolean} ask - if alexa should tell
       * @returns {Object}
       * @description Make alexa tell 
       */
function say(ress,str,searched='',id=0,oldIndex=0,totalArticle=1, ifReturn=false, session=false, ask=false){
 
  var attributes = {
    last_searched: searched,
    UID:id>0 ? id : uuid>0 ? uuid : 0,
    index:oldIndex,
    total:totalArticle,
    art: arts,
    contact: cons,
    email: emaild,
    confirmed:confirmedd
  };
  if(!ask){
  var response = Alexa.Response
                .say(str)
                .shouldEndSession(session).attributes(attributes)
                .build();
          }else{
             var response = Alexa.Response
                .ask(str)
                .shouldEndSession(session).attributes(attributes)
                .build();
          }
      console.log("sent params",attributes);
      if(!ifReturn){
        ress.end(JSON.stringify(response));
      }else{
        return response;
      }
}

/**
        * @file alexa_page.js
       * @function ask
       * @param {Object} res - HTTP response
       * @param {String} str - string for Alexa to speak
       * @param {String} searched - Last search string
       * @param {number} id - Current Article Index
       * @param {number} oldIndex - Current Article Index
       * @param {number} totalArticle - Total Articles in array
       * @param {Boolean} ifReturn - set if you want to process without getting object in variable
       * @param {Boolean} session - if Alexa should end session
       * @returns {Object}
       * @description make alexa ask instead of tell
       */
function ask(ress,str,searched='',id=0,oldIndex=0,totalArticle=1, ifReturn=false, session=false){
 say(ress,str,searched,id,oldIndex,totalArticle, ifReturn, session, true);
}
