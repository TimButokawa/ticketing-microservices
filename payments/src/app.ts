import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@tbticketsplease/common';

const app = express();

// trust traffic from nginx
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

// middleware
app.use(currentUser);

// routes

// handle undefined routes
app.all('*', () => {
  throw new NotFoundError();
});

// handle errors
app.use(errorHandler);

export { app };
