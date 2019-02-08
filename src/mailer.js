import {renderEmailContent} from "./formatting";
import {fetchNewsletterEmails} from "./api";

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
}

const mailgun = require('mailgun-js')(auth);


export default (nextWeek) => {

  fetchNewsletterEmails().then((emails) => {
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Muslim.events" <mail@muslim.events>', // sender address
      to: "" , // list of receivers
      subject: 'Muslim.events newsletter', // Subject line
      html: renderEmailContent(nextWeek), // plain text body
    };


    emails.forEach(email => {
      mailOptions.to = email
      mailgun.messages().send(mailOptions, function (error, body) {
        console.log(body);
      });
    })

  })

}
