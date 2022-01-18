import * as pg from "pg";

const conString = process.env.CON_STRING;
const client = new pg.Client(conString);

client.connect(function(err: any) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

export default client;