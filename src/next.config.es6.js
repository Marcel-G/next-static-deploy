require('dotenv').config()

const contentService = require('./lib/contentService').default

const path = require('path')

let Dotenv = null

if (!process.env.SERVERLESS_EXEC) { // Serverless sets environment variables with it's own webpack
  Dotenv = require('dotenv-webpack') /* eslint-disable-line */
}

const toRoutes = (route, all) => ({ ...all, ...route })

module.exports = {
  webpack: config => ({
    ...config,
    // XXX https://github.com/evanw/node-source-map-support/issues/155
    node: {
      fs: 'empty',
      module: 'empty'
    },
    plugins: [
      ...config.plugins || [],
      Dotenv && new Dotenv({
        path: path.join(__dirname, '../.env'),
        systemvars: true
      })
    ].filter(Boolean)
  }),
  exportPathMap: async () => {
    const pages = await contentService.getAllPages()
    return ({
      ...pages
        .map(({ fields: { route } }) => ({ [route]: { page: '/cms-page' } }))
        .reduce(toRoutes, {})
    })
  }
}
