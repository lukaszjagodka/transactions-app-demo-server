import { Request, Response, Router } from 'express';
import { deleteAccount, findAccounts, createAccount, updateAccountValue } from '../services/accounts';

const router = Router();

router.delete('/', async (req: Request, res: Response) => {
  const { id } = req.query;
  const response = await deleteAccount(+id);
  return res.json({
    success: true,
    response
  });
});

router.get('/', async (req: Request, res: Response) => {
  const accounts = await findAccounts();
  return res.json({
    success: true,
    data: accounts
  });
});

router.post('/', async (req: Request, res: Response) => {
  const response = await createAccount(req.body);
  return res.json({
    success: true,
    response
  });
});

router.put('/', async (req: Request, res: Response) => {
  const { id } = req.query;
  const { actualBalance } = req.body;
  const data = {actualBalance, id: +id };
  await updateAccountValue(data);
  return res.json({
    success: true,
  });
});

export default router;