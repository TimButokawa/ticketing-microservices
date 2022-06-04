import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "./errors/database-connection-error";

const app = express();

app.use(json());

// routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// handle undefined routes
app.all('*', () => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

const startUp = () => {
  try {
    mongoose.connect('mongodb://auth-mongo-ip-service:27017/auth');
    console.log('Connected to auth db');
  } catch (e) {
    console.log('error: ', e)
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Auth listening on port 3000');
  });
}

startUp();
