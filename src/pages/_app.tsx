import type { AppProps } from 'next/app';
import { useFuckSafari } from '../hooks/use-fuck-safari';

import '@/styles/reset.css';
import '@/styles/styles.sass';

export default function App({ Component, pageProps }: AppProps) {
  useFuckSafari();

  return (
    <Component {...pageProps} />
  );
}
