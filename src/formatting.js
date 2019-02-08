import fetch from "node-fetch";
import moment from "moment";
import {FBRegex, getDisplayedDay} from "./utils";


export function handleRecords(records) {
  const nextWeek = []
  const recentEvents = []

  records.forEach(function(record) {
    const eventCreate= moment(record.fields['Created time'])
    const eventStart =  moment(record.fields['Start time'])
    if( eventCreate.isBetween(moment().subtract(7, "d"), moment())) {
      recentEvents.push(record)
    }
    if(eventStart.isBetween(moment(), moment().add(7, "d"))) {
      nextWeek.push(record)
    }
  });
  return {
    nextWeek,
    recentEvents
  }
}

export function handleNextWeekEvents(nextWeek) {
  const output = [];
  nextWeek.sort((a, b) => {
    if (moment(a.fields["Start time"]).isAfter(b.fields["Start time"]))
      return 1;
    if (moment(a.fields["Start time"]).isBefore(b.fields["Start time"]))
      return -1;
    return 0;
  });
  nextWeek.forEach(record => {
    const startDate = new Date(record.fields["Start time"]);
    const city = record.fields["City"]
    const out = `- ${record.fields.Name} (${getDisplayedDay(startDate)} ${city ? city : ""})`;
    const FBEvent = record.fields.Description.match(FBRegex);
    output.push({
      text: out,
      FBEvent: FBEvent ? FBEvent[0] : FBEvent
    })
  });
  return output;
};

export function handleRecentEvents(recentEvents) {
  const output= []
  recentEvents.sort((a, b) => {
    if(moment(a.fields["Start time"]).isAfter(b.fields["Start time"]))
      return 1
    if(moment(a.fields["Start time"]).isBefore(b.fields["Start time"]))
      return -1
    return 0
  })
  recentEvents.forEach(record => {
    const date = new Date(record.fields["Start time"])
    const day = `${ date.getMonth() + 1 }/${ date.getDate() }`
    const city = record.fields["City"]
    let out = ""
    try {
      out = `- ${ record.fields.Name } (${ day }: ${ city ? city : "" })`
      const FBEvent = record.fields.Description.match(FBRegex);
      output.push({
        text: out,
        FBEvent: FBEvent ? FBEvent[0] : FBEvent
      })
    }
    catch (e) {
      console.log(e.message)
    }
  })
  return output
}

export function renderEmailContent(nextWeek) {
  nextWeek = handleNextWeekEvents(nextWeek)
  return `
    <!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
  <div style="background-color: #fff;justify-content: center;align-items: center;">
    <div style="color: #393E4E;text-align: center;margin-bottom: 50px;">
      <div>
        <img style="width: 35%;" src="https://preview.ibb.co/irP1A0/logo.png" alt="logo">
      </div>
      <div >
        The list of Muslim events in the Bay Area
      </div>
    </div>
    <div style="margin-bottom: 50px;">
      <h3 style="margin-bottom: 35px;">Salam 👋 </h3>
      <div style="margin-bottom: 35px;">
        <h3>
        Here are the events happening over the next 7 days: 
        <span style="background: #ff3131;
          padding: 3px 7px;
          border-radius: 25%;
          color: white;
          margin-left: 5px;
          font-size: 14px;">
          ${nextWeek.length}
        </span> 
      </h3>
        <ul style="margin-top: 10px;list-style-type: none;margin-left: 25px;padding: 0;">
          ${
            nextWeek.map(({text, FBEvent}) => {
              return (`
                <li style="margin: 5px 0;font-weight: bold;font-size: 14px;">
                  ${text}
                  ${
                    FBEvent ? (`
                      <a href=${FBEvent} style="vertical-align: sub;">
                        <img 
                          src="https://preview.ibb.co/dE86Cf/external-link.png"
                          style="height: 15px;width: 15px;" 
                          alt="event_link" />
                      </a>
                    `) : ""
                  }
                </li>
              `)
            }).join("")
          }
        </ul>
      </div>
    </div>
    <div style="color: #393E4E;text-align: center;">
      <h4>To view the details for any of these events, visit:</h4>
      <a href="https://muslim.events">https://muslim.events</a>
      <br />
      <a href="mailto:unsubscribe@muslim.events?subject=Unsubscribe&body=Unsubscribe+me+from+muslim.events+newsletter+">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
  `
}
