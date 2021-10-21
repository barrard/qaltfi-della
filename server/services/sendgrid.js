require("dotenv").config();

const colors = require("colors");
const logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});
// const nodemailer = require('nodemailer');

// const mandrillTransport = require('nodemailer-mandrill-transport');
const sgMail = require("@sendgrid/mail");

// var transport = nodemailer.createTransport(mandrillTransport({
//   auth: {
//     apiKey: process.env.MAIL_CHIMP_API_KEY
//   }
// }));
// logger.log(process.env.SENDGRID_API_KEY)

const mandrill = {};
mandrill.send_mail = send_mail;
mandrill.verify_email = verify_email;
// mandrill.send_mail('barrars@gmail.com', 'noreply@qaltfi.com', 'TEST',  require('./sendgrid_modules/email_verification.js')('1', "/") )
module.exports = mandrill;

async function send_mail(to, from, subject, html) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from,
      subject,
      text: "Email verification Text",
      html: html
    };
    await sgMail.send(msg);
    logger.log("mail sent".bgYellow);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
}

async function verify_email(to, token, url) {
  try {
    logger.log(`Sending verification email to ${to}`.bgYellow);
    let from = "noreply-qaltfi@stealth.qaltfi.com";
    let subject = "Email Verification";
    let html = await require("./email_verification.js")(
      token,
      url
    );
    // logger.log(html)

    await send_mail(to, from, subject, html);
    const verification_tokens = require("./../models/verification_tokens.js");
    let email = to;
    verification_tokens.save_token({ token, email });
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    throw err;
  }
}
