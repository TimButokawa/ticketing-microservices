import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('Getting an order by id...', () => {
  it('gets an order', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: gotOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .expect(200);

    expect(gotOrder.id).toEqual(order.id);
  });

  it('does not get orders for other users', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const user = global.signin();
    const user2 = global.signin();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user2)
      .expect(404);

  });
});
