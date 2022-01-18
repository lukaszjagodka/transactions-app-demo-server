const pg = require('pg');
const express = require('express');

const router = express.Router()

const conString = process.env.CON_STRING;
const client = new pg.Client(conString);

router.get('/', (req: any, res: any) => {
  client.connect(function(err: any) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(`SELECT * FROM "public"."currencies" LIMIT 1000`, function(err: any, result: { rows: any; }) {
      if(err) {
        return console.error('error running query', err);
      }
      client.end();
      console.log(result)
      
      return res.json(result.rows);
    });
  });
})

export default router