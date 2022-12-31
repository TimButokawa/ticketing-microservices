import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

jest.setTimeout(10000);

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_key'
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const res = await request(app)
    .post('/api/users/sign-up')
    .send({ email, password })
    .expect(201);

  const cookie = res.get('Set-Cookie');
  return cookie;
}
