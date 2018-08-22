/* eslint no-multi-assign: 0 */
const nextRoutes = require('next-routes')

const routes = module.exports = nextRoutes()


/*
  should match any route that does not contain dot
  eg so that /robots.txt does not match
*/
routes.add('cms-page', '/([^.]*)')

