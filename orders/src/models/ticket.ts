import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// required to create
interface TicketProps {
  id: string;
  title: string;
  price: number;
  version: number;
}

// on the document
export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(props: TicketProps): TicketDocument;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  version: {
    type: Number,
    required: true,
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

ticketSchema.statics.build = (props: TicketProps) => {
  return new Ticket({
    ...props,
    _id: props.id,
  });
}

// mongoos requires keyword function
ticketSchema.methods.isReserved = async function() {
  // make sure that the ticket is not reserved (does not belong to an order that is not status canceled)
  // if an existing order has been created, is awaiting payment, or is complete, the current order can't
  // be created
  const existingOrder = await Order.findOne({
    ticket: this, // this === the ticket document that was just called
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ]
    }
  });

  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('ticket', ticketSchema);

export {
  Ticket
};
