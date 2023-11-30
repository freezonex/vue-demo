'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASICURL: '"/api"',
  SUPOS_URL: '"https://apaas-r4xv.saas.supos.io/"'
})
