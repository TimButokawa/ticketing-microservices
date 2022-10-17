import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_key';
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

global.signin = () => {
  // create new id each time signin is used
  const id = new mongoose.Types.ObjectId().toHexString();
  // build JWT payload { id, email }
  const payload = {
    id,
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
