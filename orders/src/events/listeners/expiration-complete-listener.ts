import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@tbticketsplease/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCanceledPublisher } from '../publishers/order-canceled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Canceled,
    });

    await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
