import { Publisher, ExpirationCompleteEvent, Subjects } from '@tbticketsplease/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
