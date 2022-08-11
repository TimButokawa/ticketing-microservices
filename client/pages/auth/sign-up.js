import React from 'react';

const SignUp = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log('email: ', email)
    console.log('password: ', password)
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
}

export default SignUp;
