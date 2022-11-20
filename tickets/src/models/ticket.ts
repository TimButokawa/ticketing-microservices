import mongoose from 'mongoose';

interface TicketProps {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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
  },
  userId: {
    type: String,
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
  return new Ticket(props);
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('ticket', ticketSchema);

export { Ticket }