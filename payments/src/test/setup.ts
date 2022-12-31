import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(10000);

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_key';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = (id?: string) => {
  // build JWT payload { id, email }
  const payload = {
    // create new id if no id is provided each time signin is used
    id: !!id ? id : new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };
  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { "jwt": "<token>"} as json
  const session = JSON.stringify({ jwt: token });
  // encode json as base64
  const base64 = Buffer.from(session).toString('base64');
  // return cookie session string
  return [`session=${base64}`];
}
