import mongoose from 'mongoose';

interface PaymentProps {
  orderId: string;
  stripeId: string;
}

interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(props: PaymentProps): PaymentDocument;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id,
      delete ret._id
    }
  }
});

paymentSchema.statics.build = (props: PaymentProps) => {
  return new Payment(props);
}

const Payment = mongoose.model<PaymentDocument, PaymentModel>('payment', paymentSchema);

export { Payment };
