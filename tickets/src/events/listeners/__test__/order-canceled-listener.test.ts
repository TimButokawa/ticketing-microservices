import { OrderCanceledEvent, OrderStatus } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCanceledListener } from '../order-canceled-listener';

const setup = async () => {
  // create an instance of a listener
  const listener = new OrderCanceledListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  // reserve ticket with orderId
  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();
  // create a fake data event
  const data: OrderCanceledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
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

  expect(orderedTicket!.orderId).not.toBeDefined();
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
});
