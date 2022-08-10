import request from 'supertest';
import { app } from '../../app';

describe('current-user route...', () => {
  it('gets the current user', async () => {
    const cookie = await global.signin();
    const res = await request(app)
      .get('/api/users/current-user')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body.currentUser).toBeDefined();
    expect(res.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if not authenticated', async () => {
    const res = await request(app)
      .get('/api/users/current-user')
      .expect(200)

    expect(res.body.currentUser).toEqual(null);
  })
});
