
import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@tbticketsplease/common';
import { app } from './app';

const startUp = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to auth db');
  } catch (e) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Auth listening on port 3000');
  });
}

startUp();
