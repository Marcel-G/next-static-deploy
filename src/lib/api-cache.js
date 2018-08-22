const fs = require('fs-extra')
const path = require('path')
const { unique } = require('shorthash')

const buildFile = '.next/BUILD_ID'

const outdir = `${process.env.TEMP_DIR || '.'}/out`

const cacheRoute = '/api-cache'

const getBuildId = () =>
  fs.readFile(buildFile, 'utf-8')

const getFileName = async (id) => {
  const buildId = await getBuildId()
  return unique(buildId + id).concat('.json')
}

const getFileUrl = (id) => {
  const { buildId } = window.__NEXT_DATA__ /* eslint-disable-line */
  return cacheRoute.concat(
    '/',
    unique(buildId + id),
    '.json'
  )
}

export const getCache = async (id) => {
  const fileName = await getFileName(id)
  return fs.readJson(path.join(outdir, cacheRoute, fileName))
}

const setCache = async (id, data) => {
  const fileName = await getFileName(id)
  await fs.ensureDir(path.join(outdir, cacheRoute))
  return fs.writeJson(path.join(outdir, cacheRoute, fileName), data)
}

export const cacheManager = async (key, promise, { fromCache }) => {
  if (fromCache) {
    return fetch(getFileUrl(key)) /* eslint no-undef: 0 */ // @todo add fetch polyfill for IE
      .then(response => response.json())
  }
  const data = await promise()
  await setCache(key, data)
  return data
}
