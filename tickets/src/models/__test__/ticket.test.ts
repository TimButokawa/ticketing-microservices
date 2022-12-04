import { Ticket } from '../ticket';

describe('Ticket model...', () => {
  it('implements optimistic concurrency control', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
      title: 'test',
      price: 5,
      userId: 'abc'
    });
    // save the ticket to the database
    await ticket.save();
    // fetch the ticket twice
    const first = await Ticket.findById(ticket.id);
    const second = await Ticket.findById(ticket.id);
    // make two separate changes to the tickets
    first?.set({ price: 10 });
    second?.set({ price: 15 });
    // save the first ticket
    await first?.save();
    // save the second ticket
    const attempt = second?.save();

    expect(attempt).rejects.toThrow(Error)
  });

  it('increments the version number on save', async () => {
    const ticket = Ticket.build({
      title: 'test',
      price: 5,
      userId: 'abc',
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
  });
});
