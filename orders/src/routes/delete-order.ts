import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from '@tbticketsplease/common';
import express, { Request, Response } from 'express';
import { OrderCanceledPublisher } from '../events/publishers/order-canceled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// actually just patching the status property
router.delete('/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new BadRequestError('Must provide orderId');
    }

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    order.status = OrderStatus.Canceled;

    await order.save();

    // publish order:canceled
    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
