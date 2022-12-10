import { TicketCreatedEvent } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    title: 'Test',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
}

it('creates and saves a ticket', async () => {
  const {
    listener,
    data,
    msg
  } = await setup();
  // call the onMessage function with data and message
  await listener.onMessage(data, msg);
  // assert ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
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
