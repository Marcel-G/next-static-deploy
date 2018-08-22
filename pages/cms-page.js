import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'ramda'
import Head from 'next/head'

import withStyles from '$/lib/withStyles'
import withRouteData from '$/lib/withRouteData'
import withNavigationData from '$/lib/withNavigationData'

import NavigationBar from '$/components/navigationBar'
import { withChildComponents } from '$/blocks'

const Page = styled.div`
  max-width: 600px;
  margin: 0 auto;
`

const ErrorWrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  align-self: center;
  align-items: center;
`

const Error = ({ error }) => {
  const errors = {
    404: 'Sorry, that page doesn\'t exist',
    500: 'Error loading page',
    _: 'An error occurred'
  }

  return (
    <ErrorWrapper>
      <div>
        {errors[error] ? errors[error] : errors._}
      </div>
    </ErrorWrapper>
  )
}

Error.propTypes = {
  error: PropTypes.oneOf([404, 500]).isRequired
}

const CmsPage = ({
  error,
  title,
  children,
  hideNavigation,
  ...props
}) => {
  const pageTitle = error ? 'Oops!' : title
  return [
    <Head key={0}>
      <title>{pageTitle} - Learning by Doing</title>
    </Head>,
    <Page
      key={1} >
      <NavigationBar navigation={!hideNavigation && props['main-navigation']} />
      {error ?
        <Error error={error} /> :

        <div className="modules">
          {children}
        </div>
      }
    </Page>
  ]
}

CmsPage.propTypes = {
  page: PropTypes.shape({
    fields: PropTypes.shape({
      blocks: PropTypes.array,
      title: PropTypes.string
    })
  }),
  error: PropTypes.number
}

export default compose(
  withStyles(),
  withRouteData,
  withNavigationData({ navigationSlug: 'main-navigation' }),
  withChildComponents()
)(CmsPage)
