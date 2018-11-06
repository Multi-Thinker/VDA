/**
* @name observer.js
* @file observer.js
* @author Talha habib
* @requires ssl.js
* @requires https
* @requires express
* @requires body-parser
* @requires url 
* @requires alexa_page.js
* @requires alexa-verifier
* @module
* main starting script of VDA project
*/
var Observer_js

// SSL Key, Cert and CA
var certs = require("./ssl.js");

// SSL HTTP Request Handler 
var https = require("https");

// Additional libraries
var express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  url = require("url"),
  alexa_page = require("./alexa_page.js"),
  verifier = require("alexa-verifier");

/**
       * @file observer.js
       * express request body stream 
       * @function app.use
       * @param {Object} request body for express router
       * @returns {JSON} raw body
       * @name bodyParser
       */
app.use(bodyParser.json());

/**
        * @file observer.js
       * method: GET 
       * Route: /
       * @function app.get
       * @param {Object} req - Request body
       * @param {Object}  res - Response Body
       * @returns {JSON} error 400 - Alexa isn't supposed to send GET request
       */
app.get("/", function(req, res) {
  res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
  res.end(`{"qoute": 
      "Everything is relative and doubtful in many ways, you can either live your life wondering or discovering --Talha Habib",
      "status": "failure", "reason":"Alexa shouldnt be sending GET request"}`);
});

 /**
        * @file observer.js
       * Method: POST
       * Route: /
       * @function app.get
       * @param {Object} req - Request body
       * @param {Object} res - Response Body
       */
app.post("/", function(req, res) {


  
  //@param {string} cert_url - amazon certificate url from http header
  var cert_url = req.headers.signaturecertchainurl;

  // @param {string} signatre - amazon certificate signatre from http header

  var signature = req.headers.signature;

  /**
       * @file observer.js
       * Alexa Request Verifier 
       * @function verifier
       * @param {Object} cert_url - Certification url from HTTP Header
       * @param {Object} signature - Signature from HTTP Header
       * @param {Object} body - Request body from express
       * @name alexa_request_verifier
       * @returns {Promise}
       */
  const verifyPromise = verifier(cert_url, signature, JSON.stringify(req.body));
  verifyPromise
    .then(function(response) {
      /**
        * @file observer.js
       * Alexa Handler
       * @function alexa_page
       * @param {Object} https - The Object of HTTPS request and resource 
       * @param {Object} req - The Object of Express Request
       * @param {Object} res - The Object of Express Response
       * @param {Object} url - The Object URL Library
       * @returns {JSON} Alexa Response 
       * @name alexa_page
       */
      alexa_page(https, req, res, url);
    })
    .catch(function(err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      var response = `{"status": "failure", "reason":"${err}"}`;
      res.end(response);
    });
});

/**
  * @file observer.js
 * Method: GET, Route: /google
 * @function app.get
 * @param {Object} req - The Object of HTTP Request 
 * @param {Object} res - The Object of HTTP resource/thread
 * @returns {JSON} error 400 Google isn't supposed to send GET requests
 */
app.get("/google", (req, res) => {
  res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
  res.end(`{"qoute": 
      "Everything is relative and doubtful in many ways, you can either live your life wondering or discovering --Talha Habib",
      "status": "failure", "reason":"Google shouldnt be sending GET request"}`);
});

 /**
  * @file observer.js
 * METHOD: POST, Route: /Google
 * @function app.post
 * @param {Object} req - The Object of HTTP Request 
 * @param {Object} res - The Object of HTTP resource/thread
 * @returns {null}
 */
app.post("/google", (req, res) => {

  /**
  * @file observer.js
 * Google handler
 * @function google_page
 * @param {Object} req - The Object of HTTP Request 
 * @param {Object} res - The Object of HTTP resource/thread 
 * @returns {JSON} Google Response
 */
  require("./google_page.js")(req, res);
});


/**
  * @file observer.js
 * HTTPS Listener
 * @function listen
 * @param {Object} certs - The Object of SSL certificates.
 * @param {Object} app - Express Router to bind request to.
 * @param {number} port - default hardcoded port 443 for public SSL listener on port 80
 */
https
  .createServer(certs, app)
  .listen(443, () => console.log("listening on port 443"));
