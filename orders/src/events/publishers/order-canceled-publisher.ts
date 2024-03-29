import { Publisher, OrderCanceledEvent, Subjects } from '@tbticketsplease/common';

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}
