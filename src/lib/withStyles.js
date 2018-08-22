/* eslint react/no-danger: 0 */
import React from 'react'
import Head from 'next/head'

const withStyles = () => ComposedComponent =>
  class StyledPage extends React.Component {
    static async getInitialProps(ctx) {
      const composedInitialProps =
        ComposedComponent.getInitialProps && (await ComposedComponent.getInitialProps(ctx))
      return {
        ...composedInitialProps
      }
    }

    render() {
      return [
        <Head key={0}>
          {/* Waiting for proper Global styling api https://github.com/styled-components/styled-components/pull/1493 */}
          <style dangerouslySetInnerHTML={{
            __html: `
              html {
                text-size-adjust: 100%;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                -webkit-tap-highlight-color: transparent;
              }

              body {
                margin: 0;
                padding: 0;
              }
              `
            }} />
        </Head>,
        <div key={1}>
          <ComposedComponent {...this.props} />
        </div>
      ]
    }
  }

export default withStyles
