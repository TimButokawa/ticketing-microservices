import { TicketUpdatedEvent } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test',
    price: 50,
  });
  await ticket.save();
  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'Updated Test',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
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

it('finds, updates, and saves a ticket', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup();
  // call the onMessage function with data and message
  await listener.onMessage(data, msg);
  // assert ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
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

it('does not call ack if the event has a skipped version number', async () => {
  const {
    listener,
    data,
    msg
  } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch(e) {}


  expect(msg.ack).not.toHaveBeenCalled();
});
