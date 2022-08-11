import 'bootstrap/dist/css/bootstrap.css';
// set up global css for app
// App component next js wrapper
const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
}

export default App;
