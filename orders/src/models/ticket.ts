import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

// required to create
interface TicketProps {
  id: string;
  title: string;
  price: number;
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
  findByPrevVersion(event: { id: string, version: number }): Promise<TicketDocument | null>;
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
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByPrevVersion = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    __id: event.id,
    version: event.version - 1,
  });
}

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
