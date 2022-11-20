import { OrderStatus } from '@tbticketsplease/common';
import mongoose from 'mongoose';
import { TicketDocument } from './ticket';

export { OrderStatus };

// required to create
interface OrderProps {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

// on the document
interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(props: OrderProps): OrderDocument;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false,
  }
});

orderSchema.statics.build = (props: OrderProps) => {
  return new Order(props);
}

const Order = mongoose.model<OrderDocument, OrderModel>('order', orderSchema);

export {
  Order
};
