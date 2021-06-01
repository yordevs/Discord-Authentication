const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD
  }
});



function sendEmail(email, token) {
  var mailOptions = {
    from: "no-reply@yordevs.com",
    to: email,
    subject: "Yordevs Student Authentication",
    html: `<p>Hi!</p>
            <p>Thanks for taking the time to authenticate your uni email with the yordevs discord</p>
            <p>Don't worry, we don't store your email anywhere so nobody will be able to steal it from us,
            we just like to know that members of our discord are from York </p>
            <p> Please follow this link to confirm your discord account belong to a student at York: <i>http://droplet.yordevs.com:4000/authenticate/student/${token}</i></p>
            <br />
            <p>Best Wishes,</p>
            <p>Yordevs</p>
          `
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent:' + info.response)
    }
  })
}

module.exports = {
  sendEmail
}



