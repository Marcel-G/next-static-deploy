/* eslint react/no-danger: 0 */
import React from 'react'
import contentService from '$/lib/contentService'
import { cacheManager } from '$/lib/api-cache'

const isStaticExport = ctx => {
  const isServer = typeof window === 'undefined'
  return isServer && !ctx.req.headers
}

const getDataForRoute = async (route, fromCache) => {
  if (!route) {
    return {
      error: 404
    }
  }

  // clear off trailing slash
  const [sanitisedRoute] = route.match(/^\/(\/?[\w-]+)*/)

  let page = null

  const getPage = () =>
    contentService.getPageByRoute(
      sanitisedRoute,
      { include: 2 }
    )

  if (process.env.NODE_ENV === 'production') {
    page = await cacheManager(
      `route-data-${sanitisedRoute}`,
      getPage,
      { fromCache }
    )
  } else {
    page = await getPage()
  }


  if (!page) {
    return {
      error: 404
    }
  }

  return {
    page
  }
}

export default ComposedComponent => {
  const PageRouteData = (props) => <ComposedComponent {...props} />

  PageRouteData.getInitialProps = async (ctx) => {
    const composedInitialProps =
      ComposedComponent.getInitialProps && (await ComposedComponent.getInitialProps(ctx))

    const { asPath } = ctx

    const { error, page } = await getDataForRoute(
      asPath,
      !isStaticExport(ctx)
    )

    if (error) {
      return {
        ...composedInitialProps,
        error
      }
    }

    return {
      ...composedInitialProps,
      ...page.fields,
      id: page.sys.id
    }
  }

  return PageRouteData
}

