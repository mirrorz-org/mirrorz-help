import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/*
  ((localStorage, document) => {
    try {
      const mode = localStorage['user-color-scheme'];
      if (mode) {
        document.documentElement.classList.add(mode)
      }
    } catch (e) {}
  })(localStorage, document)
        */}
        <script dangerouslySetInnerHTML={{ __html: '!function(b,c){try{var a=b["user-color-scheme"];a&&c.classList.add(a)}catch(d){}}(localStorage,document.documentElement)' }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
