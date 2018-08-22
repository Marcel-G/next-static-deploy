import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }
  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="keywords" content="woodwork,kids,children,activity,victoria,education,schools" />
          <meta name="description" content="The Learning By Doing Woodwork Room is an Education Centre that delivers creative and practical woodwork, electrix, science and technology developmental programs for children aged 4 – 15. They have worked in over 450 schools all over Victoria, with well in excess of 1 million children having taken home a wooden model / toy that THEY built." />
          <meta name="og:title" content="Learning by Doing" />
          <meta name="og:description" content="The Learning By Doing Woodwork Room is an Education Centre that delivers creative and practical woodwork, electrix, science and technology developmental programs for children aged 4 – 15. They have worked in over 450 schools all over Victoria, with well in excess of 1 million children having taken home a wooden model / toy that THEY built." />
          <link rel="icon" href="/static/favicon-square.png" />
          <link rel="canonical" href="https://www.learningbydoing.com.au" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
