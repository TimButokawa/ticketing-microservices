import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@tbticketsplease/common';
import { createTicketRouter } from './routes/new-ticket';
import { getTicketRouter } from './routes/get-ticket';
import { getTicketsRouter} from './routes/get-tickets';
import { updateTicketRouter } from './routes/update-ticket';

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
app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

// handle undefined routes
app.all('*', () => {
  throw new NotFoundError();
});

// handle errors
app.use(errorHandler);

export { app };
