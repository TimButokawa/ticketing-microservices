import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@tbticketsplease/common';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'random-string', 'http://nats-ip-service:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closing...');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
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
