import request from 'supertest';
import { app } from '../../app';

describe('sign-up route...', () => {
  describe('request body validation...', () => {
    it('returns 201 on successful signup', () => {
      return request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'testpassword',
        })
        .expect(201);
    });

    it('returns a 400 with an invalid email', () => {
      return request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test.com',
          password: 'testpassword',
        })
        .expect(400);
    });

    it('returns a 400 with an invalid password', () => {
      return request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 't',
        })
        .expect(400);
    });

    it('returns a 400 with missing email and password', async () => {
      await request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
        })
        .expect(400);
      return request(app)
        .post('/api/users/sign-up')
        .send({
          password: 'password',
        })
        .expect(400);
    });

    it('disallows duplicate emails', async () => {
      await request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);
      return request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(400);
    });
  });

  describe('session headers...', () => {
    it('sets a cookie after successful signup', async () => {
      const res = await request(app)
        .post('/api/users/sign-up')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);
      expect(res.get('Set-Cookie')).toBeDefined();
    });
  });
});
