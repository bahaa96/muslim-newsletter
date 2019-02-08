import fetch from "node-fetch";
import {handleRecords} from "./formatting";


const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

let response = []

export function loadData(offset = "") {
  console.log("Fetching.....");
  return fetch(`https://api.airtable.com/v0/appmDngHl6n1PvFv7/Table%201?api_key=${ AIRTABLE_API_KEY }&offset=${ offset }`)
    .then(res => res.json())
    .then(json => {
      response = [...response, ...json.records]
      if(json.offset) {
        return loadData(json.offset)
      }
      else  {
        const output = handleRecords(response)
        response = []
        return output
      }
    })
    .catch(e => {
      console.log(e.message)
    })
}

let emails = []

export function fetchNewsletterEmails(offset = "") {
  return fetch(`https://api.airtable.com/v0/apptpabSI7jqL9qyl/Table%201?api_key=${ AIRTABLE_API_KEY }&offset=${ offset }`)
    .then(res => res.json())
    .then(json => {
      emails = [...emails, ...json.records]
      if(json.offset) {
        return fetchNewsletterEmails(json.offset)
      }
      else  {
        const output = emails.map(email => email.fields.Name)
        emails = []
        return output
      }
    })
    .catch(e => {
      console.log(e.message)
    })
}
