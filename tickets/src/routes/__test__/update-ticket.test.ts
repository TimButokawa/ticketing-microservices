import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the ticket does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Updated Title',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Updated Title',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if the ticket does not belong to the user', async () => {
  const title = 'Test Ticket';
  const price = 10;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Updated Title',
      price: 20,
    })
    .expect(401);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});

it('returns 400 if the ticket does not have a valid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Title',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket', async () => {
  const cookie = global.signin();
  const updatedTitle = 'Updated Title';
  const updatedPrice = 200;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual(updatedTitle);
  expect(ticket.body.price).toEqual(updatedPrice);
});

it('prevents reserved ticket from being updated', async () => {
  const cookie = global.signin();
  const updatedTitle = 'Updated Title';
  const updatedPrice = 200;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 10,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(400);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const updatedTitle = 'Updated Title';
  const updatedPrice = 200;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Ticket',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
