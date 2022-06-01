import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/sign-out', (req: Request, res: Response) => {
  res.send('sign out');
});

export { router as signOutRouter };
