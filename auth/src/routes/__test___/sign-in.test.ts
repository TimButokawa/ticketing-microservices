import request from 'supertest';
import { app } from '../../app';

describe('sign-in route...', () => {
  it('fails when an email does not exist', async () => {
    await request(app)
      .post('/api/users/sign-in')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(400);
  });

  it('fails on incorrect password', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/sign-in')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('responds with cookie when sign in is valid', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/users/sign-in')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
