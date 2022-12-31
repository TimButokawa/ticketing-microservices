import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@tbticketsplease/common';
import { deleteOrderRouter } from './routes/delete-order';
import { newOrderRouter } from './routes/new-order';
import { getOrdersRouter } from './routes/get-orders';
import { getOrderRouter } from './routes/get-order';

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
app.use(deleteOrderRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(newOrderRouter);

// handle undefined routes
app.all('*', () => {
  throw new NotFoundError();
});

// handle errors
app.use(errorHandler);

export { app };
