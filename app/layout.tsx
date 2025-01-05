'use client';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Provider store={store}>
          <Navbar />
          {children}
          <ScrollToTop />
        </Provider>
      </body>
    </html>
  );
}