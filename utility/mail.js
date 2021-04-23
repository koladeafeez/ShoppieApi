"use strict";
const nodemailer = require("nodemailer");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// async..await is not allowed in global scope, must use a wrapper
async function welcome(email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "daisedalok@gmail.com",
      pass: "sifahdais", // naturally, replace both with your real credentials or an application-specific password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <ourstore>', // sender address
    to: email, // list of receivers
    subject: "Welcome To OurStore ", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>HI welcome to Our Store</b>
             <p>Hope you are having a great day </p>
             <p> GoodBye</p> `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function welcomeBack() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "daisedalok@gmail.com",
      pass: "sifahdais", // naturally, replace both with your real credentials or an application-specific password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <koladeafeez60@gmail.com>', // sender address
    to: "koladeafeez60@gmail.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { welcome, welcomeBack };
