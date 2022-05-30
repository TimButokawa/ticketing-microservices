import express, { Request, Response } from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentUser', (req: Request, res: Response) => {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log('Auth listening on port 3000');
});
