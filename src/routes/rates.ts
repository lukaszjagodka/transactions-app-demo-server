import { Request, Response, Router } from 'express';
import * as pg from "pg";

const router = Router()

const conString = process.env.CON_STRING;
const client = new pg.Client(conString);

router.get('/', (req: Request, res: Response) => {
  client.connect(function(err: any) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(`SELECT * FROM "public"."currencies" LIMIT 1000`, function(err: Error, result: { rows: any }) {
      if(err) {
        return console.error('error running query', err);
      }
      client.end();
      return res.json(result.rows);
    });
  });
})

export default router