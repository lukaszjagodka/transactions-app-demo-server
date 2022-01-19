import { Request, Response, Router } from 'express';
import client from '../services/dbConnection';

import { connection } from '../services/ormConnection';
import { Currency } from "../entity/Currency";

const router = Router()

router.get('/', (req: Request, res: Response) => {
    connection.then(async connection => {
      let currencies = await connection.getRepository(Currency).findOne({ order: { id: "DESC" }});
      return res.json(currencies);
    }).catch(error => console.log(error));
})

export default router