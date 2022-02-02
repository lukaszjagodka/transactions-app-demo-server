import { Request, Response, Router } from 'express';
import { deleteAccount, findAccounts, saveAccounts } from '../services/accounts';

const router = Router();

router.post('/deleteaccount', async (req: Request, res: Response) => {
  const response = await deleteAccount(req.body);
  return res.json({
    success: true,
    response
  });
});

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