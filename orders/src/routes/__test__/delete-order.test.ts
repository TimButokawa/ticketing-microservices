import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('Canceling an order...', () => {
  it('changes order status to "canceled"', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      version: 1,
    });

    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: updatedOrder } = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(order.status).toEqual(OrderStatus.Created);
    expect(updatedOrder.status).toEqual(OrderStatus.Canceled);
  });

  it('does not cancel orders for other users', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      version: 1,
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
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user2)
      .send()
      .expect(404);

  });

  it('publishes an order:canceled event', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      version: 1,
    });

    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: updatedOrder } = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});