import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {

  if (!tickets) {
    return (
      <div>
        <h1>There are no tickets available</h1>
        <Link href="/tickets/new" as="/tickets/new">
          <a>Sell a ticket!</a>
        </Link>
      </div>
    );
  }

  const rows = !!tickets && tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>view</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Available Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}

LandingPage.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/tickets');

  return {
    tickets: data,
  };
}

export default LandingPage;
