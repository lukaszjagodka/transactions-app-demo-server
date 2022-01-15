import insertToTable from './helpers/insertToTable';
require('dotenv').config();
const pg = require('pg');
const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const port = 3001;

const conString = process.env.CON_STRING;

app.get('/rates', (req: any, res: any) => {
  const client = new pg.Client(conString);
  client.connect(function(err: any) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(`SELECT * FROM "public"."currencies" LIMIT 1000`, function(err: any, result: { rows: any; }) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log(result.rows);
      res.json(JSON.stringify(result));
      client.end();
    });
  });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

var job = new CronJob('*/20 * * * *', function() {
  insertToTable()
}, null, true, 'America/Los_Angeles');
job.start();
