import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
});

router.post('/', async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
});

export default router;