const nextExport = require('next/dist/server/export')
const config = require('../src/next.config.es6')
const fs = require('fs-extra')
const aws = require('aws-sdk')
const s3 = require('s3')

const cloudfront = new aws.CloudFront()

const outdir = `${process.env.TEMP_DIR}/out`

const store = {
  ...config,
  dev: process.env.NODE_ENV !== 'production',
  dir: process.cwd(),
  webpack: null,
  webpackDevMiddleware: null,
  poweredByHeader: true,
  distDir: '.next',
  assetPrefix: '',
  configOrigin: 'default',
  useFileSystemPublicRoutes: true,
  outdir: 'out'
}

const s3Config = {
  bucket: process.env.BUCKET_NAME,
  region: 'ap-southeast-2'
}

const s3Client = s3.createClient({
  s3Options: {
    region: s3Config.region
  }
})

const exportAll = async (event, context, cb) => {
  await fs.exists(outdir)
    .then(exists => exists && fs.remove(outdir))

  await nextExport.default(
    store.dir,
    { outdir },
    store
  )

  await new Promise((resolve, reject) => {
    const upload = s3Client.uploadDir({
      localDir: outdir,
      s3Params: {
        Bucket: s3Config.bucket,
        Prefix: '',
        ACL: 'public-read'
      }
    })
    upload.on('error', reject)
    upload.on('end', resolve)
  })

  await fs.remove(outdir)

  const params = {
    DistributionId: process.env.DIST_ID,
    InvalidationBatch: {
      CallerReference: `${new Date().getTime()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }

  await cloudfront.createInvalidation(params).promise()

  cb(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: `export to ${s3Config.bucket} complete.`
  })
}

module.exports = {
  exportAll
}
