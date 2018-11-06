/**
* @file alexa_handle.js
* @name alexa_handle.js
* @requires alexa-response
* @requires speak.js
* @requires extracter.js
* @requires https
* @requires url
* @function module.exports
* @param {Object} http - https object from alexa_page
* @param {Object} responsed - parsed http request responsed from alexa_page
* @param {Object} request  - raw http request from alexa_page
* @param {Object} resource - raw http resource from alexa_page
* @param {Object} url - URL library object
* @member alexa_handle.js
* @module
* Alexa handler
* @description Alexa page that double check the resources and serve the alexa speak json 
*/

var Alexa 		= require("alexa-response"); 
var speak 		= require("./speak.js");
var extracter   = require("./extracter.js");
module.exports  =  (http, responsed,reqq,ress,url)=>{

      /**
        * @file alexa_handle.js
       * @function extracter
       * @param {Object} Parsed HTTP Request from alexa_page
       * @returns {Object}
       * @description alexa to handle and assign extracted Object to double check timestamp, certificate and signature. 
       */
   		 var extract  = extracter(responsed);
   		 var appId    = 'amzn1.ask.skill.9fd34107-ee21-4fb3-a3d4-f5c67ad4d533';

   		 var signature   = reqq.headers!=null ?
   		 					 reqq.headers.signature!=null 
   		 						? reqq.headers.signature : '' : '';
   		 var chainurl    = reqq.headers!=null ? 
   		 					reqq.headers.signaturecertchainurl!=null 
   		 						? reqq.headers.signaturecertchainurl : '' : '';
   		 if(signature==''){
   		 	 head("Header : Signature is missing.",ress, "Signature is missing");
   		 }
   		 if(chainurl==""){
   		 	 head("Header : Signaturecertchainurl is missing.",ress, "chain url is missing");
   		 }else{
   		 	var verify_url = url.parse(chainurl,true);
   		 	var segment    = verify_url.path.split("/")[1].replace(/\s/,"");
   		 	var protocol   = verify_url.protocol;
   		 	var host 	   = verify_url.host;
   		 	var port       = verify_url.port;
   		 	var SSLError   = false;
   		 	if((port!=null && port!="443")){ 
   		 		SSLError = true;
   		 	 	console.log("PORT: ", port);
   		 	 }
   		 	if(protocol!="https:"){ 		
   		 		SSLError = true; 
   		 		console.log("PROTO: ",protocol); 
   		 	}
   		 	if(host!="s3.amazonaws.com"){ 
   		 		SSLError = true; 
   		 		console.log("HOSTO: ",host);
   		 	}
   		 	if(segment.localeCompare("echo.api")==-1){		
   		 		SSLError = true; 
   		 		console.log("Segment: ",segment,segment.localeCompare("echo.api"));
   		 	}
   		 	if(SSLError==true){
   		 		console.log("----------=============-----------=========----------");
   		 		console.log("there was a problem with the chain URL");
   		 		console.log(verify_url);
   		 		console.log("----------=============-----------=========----------");
   		 	 	head("Header : BAD URL",ress, "bad URL");
   		 	}
   		 }
   		
    	var time = new Date(extract.timestamp);
    	var forward = new Date(); //time.setSeconds(time.getSeconds() + 150);
    	var getTime = new Date(time).getTime();
    	forward     = forward.setSeconds(forward.getSeconds()+150);
    	var getForward = new Date(forward).getTime();
    	console.log(getTime,getForward,"ummm");
    	if(getTime>getForward){
    		head("timestamp",ress,"timestamp error");
    	}
    	if(responsed.session.application.applicationId==appId){
	   		 speak(extract,ress,Alexa);
			 return extract;
			}else{
				ress.end("");
				return [];
		}
}

function head(str,ress,msg=''){
   	ress.writeHead(400, {"alexa request validation error : " : str});
   	ress.end(msg);
   	return false;
}
