const LandingPage = ({ currentUser }) => {
  return (
    <h1>
      {!!currentUser
        ? 'You are signed in.'
        : 'You are not signed in.'
      }
    </h1>
  );
}

LandingPage.getInitialProps = async (ctx) => {}

export default LandingPage;
