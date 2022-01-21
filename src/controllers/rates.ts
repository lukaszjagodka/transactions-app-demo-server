import { Request, Response, Router } from 'express';
import { findCurrency } from '../services/rates';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const getLastCurrency = await findCurrency();
  return res.json({
    success: true,
    data: getLastCurrency
  });
});

export default router;