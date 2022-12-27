import React from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const TicketDetail = ({ ticket }) => {
  const {
    doRequest,
    errors,
  } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{`price: ${ticket.price}`}</h4>
      {errors}
      <button
        className="btn btn-primary"
        onClick={() => doRequest()}
      >
        Purchase
      </button>
    </div>
  );
};

TicketDetail.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketDetail;
