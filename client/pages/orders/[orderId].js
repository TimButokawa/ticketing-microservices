import React from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const OrderDetail = ({ order, currentUser }) => {
  const [timer, setTimer] = React.useState(0);
  const {
    doRequest,
    errors,
  } = useRequest({
    url:'/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  React.useEffect(() => {
    const remaining = () => {
      const ms = new Date(order.expiresAt) - new Date();
      setTimer(Math.round(ms/1000));
    }

    remaining();
    const timerId = setInterval(remaining, 1000);

    return () => {
      clearInterval(timerId);
    }
  }, []);

  if (timer < 0) {
    return (
      <div>
        <h2>This order has expired</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Pending Order</h1>
      <div>{`Order expires in: ${timer} sec`}</div>
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51MHBh4KC8wbN5I1g3MDEa0mW43b3oli2pxignGaik6kCB5c4yvBtfYI35yVQTdTtU7u0ZuvPiCkAyzXiegqrToqU00ALF12K6d"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
}

OrderDetail.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderDetail;
