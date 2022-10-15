
import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@tbticketsplease/common';
import { app } from './app';

const startUp = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

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
