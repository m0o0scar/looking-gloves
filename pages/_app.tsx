import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';

import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <RecoilRoot>
      <div className="font-sans">
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
        />
        <Analytics />
      </div>
    </RecoilRoot>
  );
}

export default MyApp;
