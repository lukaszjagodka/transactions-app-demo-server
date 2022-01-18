import { Request, Response, Router } from 'express';
import client from '../services/dbConnection';

const router = Router()

router.get('/', (req: Request, res: Response) => {
    client.query(`SELECT * FROM "currencies" ORDER BY id DESC LIMIT 1`, function(err: Error, result: { rows: any }) {
      if(err) {
        return console.error('error running query', err);
      }
      return res.json(result.rows);
    });
})

export default router