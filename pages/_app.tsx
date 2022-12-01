import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <div className="font-sans">
      <Component {...pageProps} />
      <ToastContainer hideProgressBar autoClose={3000} />
    </div>
  );
}

export default MyApp;
