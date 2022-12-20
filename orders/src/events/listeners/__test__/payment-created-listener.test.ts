import { OrderStatus, PaymentCreatedEvent } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { PaymentCreatedListener } from '../payment-created-listener';

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Ticket',
    price: 50
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: PaymentCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    stripeId: 'test_charge',
    orderId: order.id,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    order,
    listener,
    data,
    msg,
  };
}

it('updates the order status to complete', async () => {
  const {
    order,
    listener,
    data,
    msg
  } = await setup();
  await listener.onMessage(data, msg);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toBe(OrderStatus.Complete);
});

it('acks the message', async () => {
  const {
    listener,
    data,
    msg
  } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
