import { currentUser, errorHandler, NotFoundError } from '@tbticketsplease/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { newPaymentRouter } from './routes/new-payment';

const app = express();

// trust traffic from nginx
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: false,
}));

// middleware
app.use(currentUser);

// routes
app.use(newPaymentRouter);

// handle undefined routes
app.all('*', () => {
  throw new NotFoundError();
});

// handle errors
app.use(errorHandler);

export { app };
