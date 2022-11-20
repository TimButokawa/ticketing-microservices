import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '../../models/order';

describe('Canceling an order...', () => {
  it('changes order status to "cancelled"', async () => {
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

  // TODO: test emit order:canceled event
  it.todo('emits an order canceled event');
});