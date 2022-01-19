import { Request, Response, Router } from 'express';
import { connection } from '../services/ormConnection';
import { Currency } from "../entity/Currency";
import { logger } from '../services/logger';

const router = Router()

router.get('/', (req: Request, res: Response) => {
    connection.then(async connection => {
      let currencies = await connection.getRepository(Currency).findOne({ order: { id: "DESC" }});
      return res.json(currencies);
    }).catch(error => logger.log({ level: 'error', message: error }));
})

export default router