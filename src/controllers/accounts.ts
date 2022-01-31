import { Request, Response, Router } from 'express';
import { findAccounts, saveAccounts } from '../services/accounts';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const getAccounts = await findAccounts();
  return res.json({
    success: true,
    data: getAccounts
  });
});

router.post('/', async (req: Request, res: Response) => {
  const response = await saveAccounts(req.body);
  return res.json({
    success: true,
    response
  });
});

export default router;