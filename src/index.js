import express from "express"
import bodyParser from "body-parser"
import {CronJob} from "cron"
import {loadData} from "./api"
import sendEmail from "./mailer"

require('dotenv').config()

const app = express()

app.use(bodyParser.json()); // creates express http server


// To send a message every minute for any testing purpose
// replace the cron timing string with this
// new CronJob("* * * * *", function() {

new CronJob("0 11 * * 4", function() {
  loadData().then(({nextWeek}) => {
    console.log('length: ', nextWeek.length);
    sendEmail(nextWeek);
  }).catch((e) => {
    console.log(e.message);
  });
}, null, true, 'America/Los_Angeles');

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
