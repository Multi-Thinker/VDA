/**
* @file sendmail.js
* @name sendmail.js
* @requires nodemailer
* @author Talha Habib
* Send mail from node js
* @external
* @global
*/


module.exports = (to, text, callback) => {
  const nodemailer = require('nodemailer');
  /**
  * @file sendmail.js
  * @function email sender
  * @param {String} to - Email 
  * @param {String} text - message
  * @returns {Object}
* @requires nodemailer
  * @example const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', 
        port: 587,     
        secure: false, 
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
  transporter.sendMail({to:to, subject:'Message', text: text}, callback);
  */
  const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', 
        port: 587,     
        secure: false, 
        auth: {
            user: 'thabib@contentenginellc.com',
            pass: ''
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
  transporter.sendMail({to:to, subject:'Message', text: text}, callback);
}
