import { Publisher, Subjects, TicketCreatedEvent } from '@tbticketsplease/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
