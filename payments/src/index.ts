import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@tbticketsplease/common';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancledListener } from './events/listeners/order-canceled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closing...');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCancledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

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