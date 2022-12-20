import { PaymentCreatedEvent, Publisher, Subjects } from '@tbticketsplease/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
