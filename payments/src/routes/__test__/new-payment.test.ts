import { OrderStatus } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

describe('Create a new payment...', () => {
  it('returns a 404 if the order does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: '1234',
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 50,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: '1234',
        orderId: order.id,
      })
      .expect(401);
  });

  it('returns a 400 when purchasing a canceled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 50,
      status: OrderStatus.Canceled,
      userId,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: '1234',
        orderId: order.id,
      })
      .expect(400);
  });

  it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 50,
      status: OrderStatus.Created,
      userId,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'token',
        orderId: order.id,
      })
      .expect(201);

    expect(stripe.charges.create).toHaveBeenCalled();

    const options = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(options.source).toEqual('token');
    expect(options.amount).toEqual(50 * 100);
    expect(options.currency).toEqual('usd');

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: 'test_charge'
    });

    expect(payment).toBeDefined();
  });
});
