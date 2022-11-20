import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@tbticketsplease/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId',
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

    res.send(order);
  }
);

export { router as getOrderRouter };
