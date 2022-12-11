import { OrderCreatedEvent, OrderStatus } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  // create an instance of a listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: '1234',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    ticket,
    listener,
    data,
    msg,
  };
}

it('sets the orderId of the ticket', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup();
  // call the onMessage function with data and message
  await listener.onMessage(data, msg);
  // assert ticket was created
  const orderedTicket = await Ticket.findById(ticket.id);

  expect(orderedTicket!.orderId).toBeDefined();
  expect(orderedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const {
    listener,
    data,
    msg
  } = await setup();
  // call the onMessage function with data and message
  await listener.onMessage(data, msg);
  // assert ack function has been called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup();
  // call the onMessage function with data and message
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const updated = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(updated.orderId);
});
