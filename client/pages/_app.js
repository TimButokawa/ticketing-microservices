import 'bootstrap/dist/css/bootstrap.css'; // setup global css
import buildClient from '../api/build-client';
import Header from '../components/header';

// App component next js wrapper
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  // nextjs when using getInitialProps at the app component level
  // use Component.getInitalProps and pass data to children
  let pageProps = {};
  try {
    // fetch common data applicable to ALL pages in the application
    const { data } = await client.get('/api/users/current-user');
    // if getInitialProps exists for the component trying to render
    // fetch data applicable to THAT component
    if (appContext.Component.getInitialProps) {
      // update page props from call defined within child component
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
      pageProps,
      currentUser: data.currentUser,
    };
  } catch (e) {
    return { error: e.message }
  }
}

export default AppComponent;
