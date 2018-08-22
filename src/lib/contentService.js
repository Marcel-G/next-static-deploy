import { createClient } from 'contentful'

const contentfulConfig = {
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_ACCESS_SPACE,
  resolveLinks: true
}

export const ContentModels = {
  page: 'page',
  navigation: 'navigation'
}

class ContentService {
  constructor() {
    this.contentful = createClient(contentfulConfig)
  }

  async getAllPages(args = {}) {
    const pages = await this.contentful.getEntries(
      {
        'fields.enabled': true,
        content_type: ContentModels.page,
        include: 0
      },
      args
    )

    return pages.items
  }

  async getPageByRoute(route, args = {}) {
    return this.getSingleByParams(
      {
        'fields.route': route,
        'fields.enabled': true,
        content_type: ContentModels.page,
        include: 3
      },
      args
    )
  }

  async getNavigationItems(slug, args = {}) {
    return this.getSingleByParams(
      {
        'fields.slug': slug,
        content_type: ContentModels.navigation
      },
      args
    )
  }

  async getHeaderConfig(slug, args = {}) {
    return this.getSingleByParams(
      {
        'fields.slug': slug,
        content_type: ContentModels.headerConfig
      },
      args
    )
  }

  async getSingleByParams(params, args = {}) {
    const entries = await this.contentful.getEntries(
      Object.assign(
        {},
        params,
        { limit: 1 }
      ), args)

    if (entries && entries.items.length > 0) {
      return entries.items[0]
    }

    return null
  }
}

const instance = new ContentService()
export default instance
