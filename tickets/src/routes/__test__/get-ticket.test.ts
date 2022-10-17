import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const resp = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('returns the ticket', async () => {
  const title = 'Test Ticket';
  const price = 10;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
      userId: '1234',
    })
    .expect(201);
  
  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});
