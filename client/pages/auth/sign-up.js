import React from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const SignUp = ({ currentUser }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {
    errors,
    doRequest,
    loading,
  } = useRequest({
    method: 'post',
    url: '/api/users/sign-up',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  React.useEffect(() => {
    if (!!currentUser) {
      Router.push('/');
    }
  }, [currentUser]);

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col col-lg-3">
            <h1>Sign Up</h1>
            <div className="form-group py-2">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group py-2">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>
            {errors}
            <div className="form-group py-2">
              <button className="btn btn-primary" disabled={loading}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
   </form>
  );
}

export default SignUp;
