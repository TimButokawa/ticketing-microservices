import request from 'supertest';
import { app } from '../../app';

describe('sign-out route...', () => {
  it('clears the cookie after signout', async () => {
    await request(app)
      .post('/api/users/sign-up')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    
    const res = await request(app)
      .post('/api/users/sign-out')
      .send({})
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
