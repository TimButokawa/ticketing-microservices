import Router from 'next/router';
import React from 'react';
import useRequest from '../../hooks/useRequest';

const SignOut = () => {
  const {
    doRequest,
  } = useRequest({
    method: 'post',
    url: '/api/users/sign-out',
    body: {},
    onSuccess: () => Router.push('/auth/sign-in'),
  });

  React.useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
