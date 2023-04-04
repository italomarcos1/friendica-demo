import React from 'react'

import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

export default class MyDocument extends Document {  
  render() {
    return (
      <Html lang="pt">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* @ts-ignore */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;700&family=Montserrat:wght@500;600&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossOrigin="anonymous"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
