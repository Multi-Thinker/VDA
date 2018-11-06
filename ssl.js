/**
* @file ssl.js
* @name SSL cert file
* @desc contains SSL cert files
* @requires cert
* @requires private_key
* @requires ca_file
* @module
* @member ssl.js
*/

var fs       	= require("fs");
var ssl 		= {
    'cert': fs.readFileSync("cert.pem"),
    'key': fs.readFileSync('privkey.pem'),
    'ca': fs.readFileSync('fullchain.pem')
};
module.exports  = ssl;