import { Publisher, Subjects, TicketUpdatedEvent } from '@tbticketsplease/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
