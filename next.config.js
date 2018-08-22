require('@babel/register')({
  babelrc: false,
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: '8.10'
        }
      }]
  ]
})

module.exports = require('./src/next.config.es6')
