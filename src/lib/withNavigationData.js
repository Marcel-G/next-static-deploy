/* eslint react/no-danger: 0 */
import React from 'react'
import contentService from '$/lib/contentService'
import { cacheManager } from '$/lib/api-cache'

const isStaticExport = ctx => {
  const isServer = typeof window === 'undefined'
  return isServer && !ctx.req.headers
}

const getNavigation = async (navigationSlug, fromCache) => {
  let navigation = null

  const getNavigationFunc = () =>
    contentService.getNavigationItems(navigationSlug)

  if (process.env.NODE_ENV === 'production') {
    navigation = await cacheManager(
      'navigation-data',
      getNavigationFunc,
      { fromCache }
    )
  } else {
    navigation = await getNavigationFunc()
  }

  if (!navigation) {
    return {
      navigation: null
    }
  }


  const { fields: { links } } = navigation

  return {
    navigation: links.map(({
      fields: { route, title, themeName }
    }) => ({ route, label: title, themeName }))
  }
}

export default ({ navigationSlug }) => ComposedComponent => {
  const PageNavigationData = (props) => <ComposedComponent {...props} />

  PageNavigationData.getInitialProps = async (ctx) => {
    const composedInitialProps =
      ComposedComponent.getInitialProps && (await ComposedComponent.getInitialProps(ctx))

    const { navigation } = await getNavigation(navigationSlug, !isStaticExport(ctx))

    return {
      ...composedInitialProps,
      [navigationSlug]: navigation
    }
  }

  return PageNavigationData
}

