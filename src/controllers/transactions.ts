import { Request, Response, Router } from 'express';
import { getTransactions, createTransaction } from '../services/transactions';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { id } = req.query;
  const response = await getTransactions(+id);
  return res.json({
    success: true,
    response
  });
});

router.post('/', async (req: Request, res: Response) => {
  const response = await createTransaction(req.body);
  return res.json({
    success: true,
    response
  });
});

export default router;