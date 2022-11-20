import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from '@tbticketsplease/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

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

    // TODO: publish an event for order created

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
