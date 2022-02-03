import { Request, Response, Router } from 'express';
import { getTransactions, saveTransactions } from '../services/transactions';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const response = await getTransactions(req.query);
  return res.json({
    success: true,
    response
  });
});

router.post('/', async (req: Request, res: Response) => {
  const response = await saveTransactions(req.body);
  return res.json({
    success: true,
    response
  });
});

export default router;