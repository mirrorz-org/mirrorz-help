import type { AppProps } from 'next/app';
import { useFuckSafari } from '../hooks/use-fuck-safari';
import { Layout } from '../components/layout';

import '@/styles/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  useFuckSafari();

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
