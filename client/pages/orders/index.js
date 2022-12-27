const Orders = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      {(!orders || !orders.length ) && (
        <p>You have no orders</p>
      )}
      <ul>
        {!!orders.length && orders.map((order) => (
          <li key={order.id}>{order.ticket.title} - {order.status}</li>
        ))}
      </ul>
    </div>
  );
}

Orders.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
}

export default Orders;
